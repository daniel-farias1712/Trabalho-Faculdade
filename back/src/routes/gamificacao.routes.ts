import { Router } from 'express';
import { GamificacaoController } from '../controllers/gamificacaoController';
import { authObrigatorio, somentePaciente, somentePsicologo } from '../middlewares/auth';

export const gamificacaoRouter = Router();


gamificacaoRouter.get(
  '/psicologo',
  authObrigatorio,
  somentePsicologo,
  GamificacaoController.listarDinamicasPsicologo,
);
gamificacaoRouter.post(
  '/psicologo',
  authObrigatorio,
  somentePsicologo,
  GamificacaoController.criarDinamica,
);

// rotas de paciente
gamificacaoRouter.get(
  '/paciente',
  authObrigatorio,
  somentePaciente,
  GamificacaoController.listarDinamicasPaciente,
);
gamificacaoRouter.post(
  '/paciente/status',
  authObrigatorio,
  somentePaciente,
  GamificacaoController.atualizarStatusDinamicaPaciente,
);
