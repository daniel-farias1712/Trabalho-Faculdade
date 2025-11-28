import { Router } from 'express';
import { PsicologoController } from '../controllers/psicologoController';
import { authObrigatorio, somentePsicologo } from '../middlewares/auth';

export const psicologoRouter = Router();

psicologoRouter.use(authObrigatorio, somentePsicologo);

psicologoRouter.get('/pacientes', PsicologoController.listarPacientes);
psicologoRouter.get('/pacientes/:id', PsicologoController.detalhePaciente);
psicologoRouter.get('/perfil', PsicologoController.meuPerfil);
psicologoRouter.post('/perfil', PsicologoController.atualizarPerfil);
