import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const gamificacaoService = {
  async listarDinamicasPsicologo(userId: number) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    return prisma.dinamica.findMany({
      where: { psicologoId: psicologo.id, ativo: true },
    });
  },

  async criarDinamica(userId: number, titulo: string, descricao?: string) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    return prisma.dinamica.create({
      data: {
        psicologoId: psicologo.id,
        titulo,
        descricao,
      },
    });
  },

  async listarDinamicasPaciente(userId: number) {
    const paciente = await prisma.paciente.findUnique({
      where: { userId },
    });
    if (!paciente) throw new Error('Paciente não encontrado');

    return prisma.dinamicaPaciente.findMany({
      where: { pacienteId: paciente.id },
      include: { dinamica: true },
    });
  },

  async atualizarStatusDinamicaPaciente(
  userId: number,
  dinamicaId: number,
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA',
) {
  const paciente = await prisma.paciente.findUnique({
    where: { userId },
  });
  if (!paciente) throw new Error('Paciente não encontrado');

  const registro = await prisma.dinamicaPaciente.upsert({
    where: {
      dinamicaId_pacienteId: {
        dinamicaId,
        pacienteId: paciente.id,
      },
    },
    update: { status },
    create: { dinamicaId, pacienteId: paciente.id, status },
  });

  return registro;
},
};
