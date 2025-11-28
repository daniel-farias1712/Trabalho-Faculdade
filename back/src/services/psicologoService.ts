import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const psicologoService = {
  async listarPacientes(psicologoUserId: number, q?: string) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId: psicologoUserId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const pacientes = await prisma.paciente.findMany({
      where: {
        consultas: {
          some: { psicologoId: psicologo.id },
        },
        ...(q && {
          nomeCompleto: {
            contains: q,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        consultas: {
          where: { psicologoId: psicologo.id },
        },
      },
    });

    return pacientes.map((p: any) => ({
  id: p.id,
  nomeCompleto: p.nomeCompleto,
  visitas: p.consultas.length,
}));

  },

  async detalhePaciente(psicologoUserId: number, pacienteId: number) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId: psicologoUserId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const paciente = await prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: {
        anotacoes: {
          where: { psicologoId: psicologo.id },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!paciente) throw new Error('Paciente não encontrado');

    return paciente;
  },
};
