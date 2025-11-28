import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const agendaService = {
  async agendaMesPsicologo(userId: number, ano: number, mes: number) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);

    const disponibilidades = await prisma.disponibilidade.findMany({
      where: {
        psicologoId: psicologo.id,
        data: { gte: inicio, lte: fim },
      },
      include: { slots: true },
    });

    const consultas = await prisma.consulta.findMany({
      where: {
        psicologoId: psicologo.id,
        data: { gte: inicio, lte: fim },
      },
    });

    return { disponibilidades, consultas };
  },

  async agendaDiaPsicologo(userId: number, dataStr: string) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const data = new Date(`${dataStr}T00:00:00`);

    const disponibilidade = await prisma.disponibilidade.findFirst({
      where: {
        psicologoId: psicologo.id,
        data,
      },
      include: { slots: true },
    });

    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999);

    const consultas = await prisma.consulta.findMany({
      where: {
        psicologoId: psicologo.id,
        data: { gte: inicio, lte: fim },
      },
      include: { paciente: true },
    });

    return { disponibilidade, consultas };
  },

 async criarOuAtualizarDiaDisponivel(
  userId: number,
  dataStr: string,
  statusDia: 'ATIVO' | 'INATIVO' | 'FERIAS',
) {
  const psicologo = await prisma.psicologo.findUnique({
    where: { userId },
  });
  if (!psicologo) throw new Error('Psicólogo não encontrado');

  const data = new Date(`${dataStr}T00:00:00`);

  const disponibilidade = await prisma.disponibilidade.upsert({
    where: {
      psicologoId_data: {
        psicologoId: psicologo.id,
        data,
      },
    },
    update: { statusDia },
    create: {
      psicologoId: psicologo.id,
      data,
      statusDia,
    },
  });

  return disponibilidade;
},

  async criarSlot(userId: number, dataStr: string, horaInicio: string, horaFim: string) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const data = new Date(`${dataStr}T00:00:00`);

   const disponibilidade = await prisma.disponibilidade.upsert({
  where: {
    psicologoId_data: {
      psicologoId: psicologo.id,
      data,
    },
  },
  update: {},
  create: {
    psicologoId: psicologo.id,
    data,
    statusDia: 'ATIVO',
  },
});

    const [hI, mI] = horaInicio.split(':').map(Number);
    const [hF, mF] = horaFim.split(':').map(Number);

    const inicio = new Date(data);
    inicio.setHours(hI, mI, 0, 0);
    const fim = new Date(data);
    fim.setHours(hF, mF, 0, 0);

    const slot = await prisma.disponibilidadeSlot.create({
      data: {
        disponibilidadeId: disponibilidade.id,
        horaInicio: inicio,
        horaFim: fim,
      },
    });

    return slot;
  },

  async removerSlot(userId: number, slotId: number) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const slot = await prisma.disponibilidadeSlot.findUnique({
      where: { id: slotId },
      include: { disponibilidade: true },
    });

    if (!slot || slot.disponibilidade.psicologoId !== psicologo.id) {
      throw new Error('Slot não encontrado');
    }

    await prisma.disponibilidadeSlot.delete({
      where: { id: slotId },
    });
  },
};
