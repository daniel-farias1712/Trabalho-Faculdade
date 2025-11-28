import { Request, Response, NextFunction } from 'express';
import { criarConsultaSchema, cancelarConsultaSchema } from '../schemas/consultaSchemas';
import { consultaService } from '../services/consultaService';

export const ConsultaController = {
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const body = criarConsultaSchema.parse(req.body);
      const consulta = await consultaService.criarConsultaPaciente(
        req.user!.userId,
        body,
      );
      return res.status(201).json({ consulta });
    } catch (err) {
      next(err);
    }
  },

  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const body = cancelarConsultaSchema.parse(req.body);
      const id = Number(req.params.id);
      await consultaService.cancelarConsultaPaciente(
        req.user!.userId,
        id,
        body.motivo,
      );
      return res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
};
