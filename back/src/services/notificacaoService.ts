import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const notificacaoService = {
  async listarNotificacoesPsicologo(userId: number) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const notificacoes = await prisma.notificacao.findMany({
      where: { psicologoId: psicologo.id },
      orderBy: { createdAt: 'desc' },
    });

    return notificacoes;
  },

  async marcarComoLida(userId: number, id: number) {
    const psicologo = await prisma.psicologo.findUnique({
      where: { userId },
    });
    if (!psicologo) throw new Error('Psicólogo não encontrado');

    const notif = await prisma.notificacao.findUnique({
      where: { id },
    });

    if (!notif || notif.psicologoId !== psicologo.id) {
      throw new Error('Notificação não encontrada');
    }

    await prisma.notificacao.update({
      where: { id },
      data: { lida: true },
    });
  },
};
