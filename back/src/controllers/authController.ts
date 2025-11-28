import { Request, Response, NextFunction } from 'express';
import {
  registrarPacienteSchema,
  registrarPsicologoSchema,
  loginSchema,
} from '../schemas/authSchemas';
import { authService } from '../services/authService';
import { gerarToken } from '../utils/jwt';

export const AuthController = {
  async registrarPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const body = registrarPacienteSchema.parse(req.body);
      const user = await authService.registrarPaciente(body);
      const token = gerarToken({ userId: user.id, tipo: 'PACIENTE' });
      return res.status(201).json({ token });
    } catch (err) {
      next(err);
    }
  },

  async registrarPsicologo(req: Request, res: Response, next: NextFunction) {
    try {
      const body = registrarPsicologoSchema.parse(req.body);
      const user = await authService.registrarPsicologo(body);
      const token = gerarToken({ userId: user.id, tipo: 'PSICOLOGO' });
      return res.status(201).json({ token });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = loginSchema.parse(req.body);
      const user = await authService.login(body.email, body.senha);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      const token = gerarToken({ userId: user.id, tipo: user.tipo });
      return res.json({ token });
    } catch (err) {
      next(err);
    }
  },
};
