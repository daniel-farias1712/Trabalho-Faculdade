import { Router } from 'express';
import { AgendaController } from '../controllers/agendaController';
import { authObrigatorio, somentePsicologo } from '../middlewares/auth';

export const agendaRouter = Router();

agendaRouter.use(authObrigatorio, somentePsicologo);

agendaRouter.get('/mes', AgendaController.agendaMesPsicologo);
agendaRouter.get('/dia', AgendaController.agendaDiaPsicologo);
agendaRouter.post('/dia', AgendaController.criarDiaDisponivel);
agendaRouter.post('/slots', AgendaController.criarSlot);
agendaRouter.delete('/slots/:id', AgendaController.removerSlot);
