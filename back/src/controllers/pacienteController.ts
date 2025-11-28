import { Request, Response, NextFunction } from 'express';
import { salvarHumorSchema } from '../schemas/pacienteSchemas';
import { criarConsultaSchema, cancelarConsultaSchema } from '../schemas/consultaSchemas';
import { pacienteService } from '../services/pacienteService';
import { consultaService } from '../services/consultaService';

export const PacienteController = {
  async salvarHumor(req: Request, res: Response, next: NextFunction) {
    try {
      const body = salvarHumorSchema.parse(req.body);
      await pacienteService.salvarHumor(req.user!.userId, body.humor, body.sobre_voce);
      return res.status(201).json({ ok: true });
    } catch (err) {
      next(err);
    }
  },

  async agendaMes(req: Request, res: Response, next: NextFunction) {
    try {
      const ano = Number(req.query.ano) || new Date().getFullYear();
      const mes = Number(req.query.mes) || new Date().getMonth() + 1;
      const consultas = await pacienteService.listarAgendaMes(req.user!.userId, ano, mes);
      return res.json({ consultas });
    } catch (err) {
      next(err);
    }
  },

  async agendaDia(req: Request, res: Response, next: NextFunction) {
    try {
      const dataStr = String(req.query.data);
      const data = new Date(dataStr);
      const consultas = await pacienteService.listarAgendaDia(req.user!.userId, data);
      return res.json({ consultas });
    } catch (err) {
      next(err);
    }
  },

  async criarConsulta(req: Request, res: Response, next: NextFunction) {
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

  async cancelarConsulta(req: Request, res: Response, next: NextFunction) {
    try {
      const body = cancelarConsultaSchema.parse(req.body);
      const id = Number(req.params.id);
      await consultaService.cancelarConsultaPaciente(req.user!.userId, id, body.motivo);
      return res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
};
