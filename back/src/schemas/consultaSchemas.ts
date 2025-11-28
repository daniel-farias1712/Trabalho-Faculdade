import { z } from 'zod';

export const criarConsultaSchema = z.object({
  psicologoId: z.number(),
  data: z.string(),       
  horaInicio: z.string(), 
  horaFim: z.string(),    
});

export const cancelarConsultaSchema = z.object({
  motivo: z.string().optional(),
});
