import { Request, Response, NextFunction } from 'express';
import { notificacaoService } from '../services/notificacaoService';
import { marcarNotificacaoLidaSchema } from '../schemas/notificacaoSchemas';

export const NotificacaoController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacoes = await notificacaoService.listarNotificacoesPsicologo(
        req.user!.userId,
      );
      return res.json({ notificacoes });
    } catch (err) {
      next(err);
    }
  },

  async marcarComoLida(req: Request, res: Response, next: NextFunction) {
    try {
      const body = marcarNotificacaoLidaSchema.parse({
        id: req.params.id,
      });
      await notificacaoService.marcarComoLida(req.user!.userId, body.id);
      return res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
};
