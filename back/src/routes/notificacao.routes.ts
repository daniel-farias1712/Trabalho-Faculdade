import { Router } from 'express';
import { NotificacaoController } from '../controllers/notificacaoController';
import { authObrigatorio, somentePsicologo } from '../middlewares/auth';

export const notificacaoRouter = Router();

notificacaoRouter.use(authObrigatorio, somentePsicologo);

notificacaoRouter.get('/', NotificacaoController.listar);
notificacaoRouter.post('/:id/lida', NotificacaoController.marcarComoLida);
