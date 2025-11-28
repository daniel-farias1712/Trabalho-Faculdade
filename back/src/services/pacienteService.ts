import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pacienteService = {
  async salvarHumor(pacienteUserId: number, humor: string, sobre?: string) {
    const paciente = await prisma.paciente.findUnique({
      where: { userId: pacienteUserId },
    });
    if (!paciente) throw new Error('Paciente não encontrado');

    await prisma.humor.create({
      data: {
        pacienteId: paciente.id,
        mood: humor as any,
        texto: sobre,
      },
    });

    if (sobre) {
      await prisma.paciente.update({
        where: { id: paciente.id },
        data: { sobreVoce: sobre },
      });
    }
  },

  async listarAgendaMes(pacienteUserId: number, ano: number, mes: number) {
    const paciente = await prisma.paciente.findUnique({
      where: { userId: pacienteUserId },
    });
    if (!paciente) throw new Error('Paciente não encontrado');

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);

    const consultas = await prisma.consulta.findMany({
      where: {
        pacienteId: paciente.id,
        data: { gte: inicio, lte: fim },
      },
    });

    return consultas;
  },

  async listarAgendaDia(pacienteUserId: number, data: Date) {
    const paciente = await prisma.paciente.findUnique({
      where: { userId: pacienteUserId },
    });
    if (!paciente) throw new Error('Paciente não encontrado');

    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999);

    const consultas = await prisma.consulta.findMany({
      where: {
        pacienteId: paciente.id,
        data: { gte: inicio, lte: fim },
      },
      include: { psicologo: true },
    });

    return consultas;
  },
};
