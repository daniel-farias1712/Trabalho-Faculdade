import { z } from 'zod';

export const salvarHumorSchema = z.object({
  humor: z.enum(['RAIVA', 'NEUTRO', 'TRISTE', 'FELIZ', 'MUITO_FELIZ']),
  sobre_voce: z.string().optional(),
});
