import { Request, Response, NextFunction } from 'express';
import { verificarToken, JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authObrigatorio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const [, token] = header.split(' ');

  try {
    const payload = verificarToken(token);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function somentePaciente(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.tipo !== 'PACIENTE') {
    return res.status(403).json({ error: 'Apenas pacientes' });
  }
  return next();
}

export function somentePsicologo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.tipo !== 'PSICOLOGO') {
    return res.status(403).json({ error: 'Apenas psicólogos' });
  }
  return next();
}
