import { z } from 'zod';

export const criarDinamicaSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().optional(),
});

export const atualizarStatusDinamicaPacienteSchema = z.object({
  dinamicaId: z.number(),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']),
});
