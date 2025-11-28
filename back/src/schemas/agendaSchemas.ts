import { z } from 'zod';

export const agendaMesPsicologoSchema = z.object({
  ano: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : new Date().getFullYear())),
  mes: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : new Date().getMonth() + 1)),
});

export const agendaDiaPsicologoSchema = z.object({
  data: z.string(), 
});

export const criarDiaDisponivelSchema = z.object({
  data: z.string(), 
  statusDia: z.enum(['ATIVO', 'INATIVO', 'FERIAS']),
});

export const criarSlotSchema = z.object({
  data: z.string(),       
  horaInicio: z.string(), 
  horaFim: z.string(),    
});

export const removerSlotSchema = z.object({
  id: z.coerce.number(),
});
