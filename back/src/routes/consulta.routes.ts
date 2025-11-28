import { Router } from 'express';
import { ConsultaController } from '../controllers/consultaController';
import { authObrigatorio, somentePaciente } from '../middlewares/auth';

export const consultaRouter = Router();

consultaRouter.use(authObrigatorio, somentePaciente);

consultaRouter.post('/', ConsultaController.criar);
consultaRouter.post('/:id/cancelar', ConsultaController.cancelar);
