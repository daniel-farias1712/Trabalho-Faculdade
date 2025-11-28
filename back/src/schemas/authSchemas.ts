import { z } from 'zod';

export const registrarPacienteSchema = z.object({
  nome_completo: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  telefone: z.string().min(8),
  cpf: z.string().min(11).max(14),
  data_nascimento: z.string().date(),
});

export const registrarPsicologoSchema = z.object({
  nome_completo: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  telefone: z.string().min(8),
  crp: z.string().min(6),
  especialidade: z.string().optional(),
  localizacao: z.string().optional(),
  valor_consulta_hora: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});
