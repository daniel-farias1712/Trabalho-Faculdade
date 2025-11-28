import { Request, Response, NextFunction } from 'express';
import { psicologoService } from '../services/psicologoService';
import { PrismaClient } from '@prisma/client';
import { atualizarPerfilPsicologoSchema } from '../schemas/psicologoSchemas';

const prisma = new PrismaClient();

export const PsicologoController = {
  async listarPacientes(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q ? String(req.query.q) : undefined;
      const pacientes = await psicologoService.listarPacientes(
        req.user!.userId,
        q,
      );
      return res.json({ pacientes });
    } catch (err) {
      next(err);
    }
  },

  async detalhePaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const paciente = await psicologoService.detalhePaciente(
        req.user!.userId,
        id,
      );
      return res.json({ paciente });
    } catch (err) {
      next(err);
    }
  },

  async meuPerfil(req: Request, res: Response, next: NextFunction) {
    try {
      const psicologo = await prisma.psicologo.findUnique({
        where: { userId: req.user!.userId },
      });
      if (!psicologo) {
        return res.status(404).json({ error: 'Psicólogo não encontrado' });
      }
      return res.json({ psicologo });
    } catch (err) {
      next(err);
    }
  },

  async atualizarPerfil(req: Request, res: Response, next: NextFunction) {
    try {
      const body = atualizarPerfilPsicologoSchema.parse(req.body);

      const psicologo = await prisma.psicologo.findUnique({
        where: { userId: req.user!.userId },
      });
      if (!psicologo) {
        return res.status(404).json({ error: 'Psicólogo não encontrado' });
      }

      const valor =
        typeof body.valor_consulta_hora === 'string'
          ? parseFloat(body.valor_consulta_hora)
          : undefined;

      const atualizado = await prisma.psicologo.update({
        where: { id: psicologo.id },
        data: {
          telefone: body.telefone,
          crp: body.crp,
          especialidade: body.especialidade,
          localizacao: body.localizacao,
          bio: body.bio,
          ...(valor !== undefined && { valorConsultaHora: valor }),
        },
      });

      return res.json({ psicologo: atualizado });
    } catch (err) {
      next(err);
    }
  },
};
