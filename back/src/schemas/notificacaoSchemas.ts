import { z } from 'zod';

export const marcarNotificacaoLidaSchema = z.object({
  id: z.coerce.number(),
});
