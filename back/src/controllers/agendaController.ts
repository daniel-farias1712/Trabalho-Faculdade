import { Request, Response, NextFunction } from 'express';
import {
  agendaMesPsicologoSchema,
  agendaDiaPsicologoSchema,
  criarDiaDisponivelSchema,
  criarSlotSchema,
  removerSlotSchema,
} from '../schemas/agendaSchemas';
import { agendaService } from '../services/agendaService';

export const AgendaController = {
  async agendaMesPsicologo(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = agendaMesPsicologoSchema.parse(req.query);
      const { disponibilidades, consultas } =
        await agendaService.agendaMesPsicologo(
          req.user!.userId,
          parsed.ano,
          parsed.mes,
        );
      return res.json({ disponibilidades, consultas });
    } catch (err) {
      next(err);
    }
  },

  async agendaDiaPsicologo(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = agendaDiaPsicologoSchema.parse(req.query);
      const data = await agendaService.agendaDiaPsicologo(
        req.user!.userId,
        parsed.data,
      );
      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async criarDiaDisponivel(req: Request, res: Response, next: NextFunction) {
    try {
      const body = criarDiaDisponivelSchema.parse(req.body);
      const disp = await agendaService.criarOuAtualizarDiaDisponivel(
        req.user!.userId,
        body.data,
        body.statusDia as any,
      );
      return res.status(201).json({ disponibilidade: disp });
    } catch (err) {
      next(err);
    }
  },

  async criarSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const body = criarSlotSchema.parse(req.body);
      const slot = await agendaService.criarSlot(
        req.user!.userId,
        body.data,
        body.horaInicio,
        body.horaFim,
      );
      return res.status(201).json({ slot });
    } catch (err) {
      next(err);
    }
  },

  async removerSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const params = removerSlotSchema.parse({ id: req.params.id });
      await agendaService.removerSlot(req.user!.userId, params.id);
      return res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
};
