import { z } from 'zod';

export const atualizarPerfilPsicologoSchema = z.object({
  telefone: z.string().min(8).optional(),
  crp: z.string().min(3).optional(),
  especialidade: z.string().optional(),
  localizacao: z.string().optional(),
  bio: z.string().optional(),
  valor_consulta_hora: z.string().optional(), 
});
