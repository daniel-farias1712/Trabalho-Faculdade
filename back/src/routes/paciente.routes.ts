import { Router } from 'express';
import { PacienteController } from '../controllers/pacienteController';
import { authObrigatorio, somentePaciente } from '../middlewares/auth';

export const pacienteRouter = Router();

pacienteRouter.use(authObrigatorio, somentePaciente);

pacienteRouter.post('/perfil/humor', PacienteController.salvarHumor);
pacienteRouter.get('/agenda/mes', PacienteController.agendaMes);
pacienteRouter.get('/agenda/dia', PacienteController.agendaDia);
pacienteRouter.post('/consultas', PacienteController.criarConsulta);
pacienteRouter.post('/consultas/:id/cancelar', PacienteController.cancelarConsulta);
