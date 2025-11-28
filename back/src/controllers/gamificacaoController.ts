import { Request, Response, NextFunction } from 'express';
import {
  criarDinamicaSchema,
  atualizarStatusDinamicaPacienteSchema,
} from '../schemas/gamificacaoSchemas';
import { gamificacaoService } from '../services/gamificacaoService';

export const GamificacaoController = {
  async listarDinamicasPsicologo(req: Request, res: Response, next: NextFunction) {
    try {
      const dinamicas = await gamificacaoService.listarDinamicasPsicologo(
        req.user!.userId,
      );
      return res.json({ dinamicas });
    } catch (err) {
      next(err);
    }
  },

  async criarDinamica(req: Request, res: Response, next: NextFunction) {
    try {
      const body = criarDinamicaSchema.parse(req.body);
      const dinamica = await gamificacaoService.criarDinamica(
        req.user!.userId,
        body.titulo,
        body.descricao,
      );
      return res.status(201).json({ dinamica });
    } catch (err) {
      next(err);
    }
  },

  async listarDinamicasPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const dinamicas = await gamificacaoService.listarDinamicasPaciente(
        req.user!.userId,
      );
      return res.json({ dinamicas });
    } catch (err) {
      next(err);
    }
  },

  async atualizarStatusDinamicaPaciente(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = atualizarStatusDinamicaPacienteSchema.parse(req.body);
      const registro = await gamificacaoService.atualizarStatusDinamicaPaciente(
        req.user!.userId,
        body.dinamicaId,
        body.status as any,
      );
      return res.json({ registro });
    } catch (err) {
      next(err);
    }
  },
};
