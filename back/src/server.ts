import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { authRouter } from './routes/auth.routes';
import { pacienteRouter } from './routes/paciente.routes';
import { psicologoRouter } from './routes/psicologo.routes';
import { agendaRouter } from './routes/agenda.routes';
import { consultaRouter } from './routes/consulta.routes';
import { notificacaoRouter } from './routes/notificacao.routes';
import { gamificacaoRouter } from './routes/gamificacao.routes';
import { errorHandler } from './middlewares/errorHandler';
import { logRequests } from './middlewares/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logRequests);

// rotas
app.use('/auth', authRouter);
app.use('/paciente', pacienteRouter);
app.use('/psicologo', psicologoRouter);
app.use('/agenda', agendaRouter);
app.use('/consultas', consultaRouter);
app.use('/notificacoes', notificacaoRouter);
app.use('/gamificacao', gamificacaoRouter);

// middleware final de erro
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});
