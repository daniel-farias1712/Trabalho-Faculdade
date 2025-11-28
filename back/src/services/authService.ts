import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';

const prisma = new PrismaClient();

interface RegistrarPacienteInput {
  nome_completo: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
}

interface RegistrarPsicologoInput {
  nome_completo: string;
  email: string;
  senha: string;
  telefone: string;
  crp: string;
  especialidade?: string;
  localizacao?: string;
  valor_consulta_hora?: string;
}

export const authService = {
  async registrarPaciente(data: RegistrarPacienteInput) {
    const senhaHash = await hashPassword(data.senha);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        senhaHash,
        tipo: 'PACIENTE',
        paciente: {
          create: {
            nomeCompleto: data.nome_completo,
            telefone: data.telefone,
            cpf: data.cpf,
            dataNascimento: new Date(data.data_nascimento),
          },
        },
      },
      include: { paciente: true },
    });

    return user;
  },

  async registrarPsicologo(data: RegistrarPsicologoInput) {
    const senhaHash = await hashPassword(data.senha);

    const valorDecimal = data.valor_consulta_hora
      ? parseFloat(data.valor_consulta_hora)
      : null;

    const user = await prisma.user.create({
      data: {
        email: data.email,
        senhaHash,
        tipo: 'PSICOLOGO',
        psicologo: {
          create: {
            nomeCompleto: data.nome_completo,
            telefone: data.telefone,
            crp: data.crp,
            especialidade: data.especialidade,
            localizacao: data.localizacao,
            valorConsultaHora: valorDecimal,
          },
        },
      },
      include: { psicologo: true },
    });

    return user;
  },

  async login(email: string, senha: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const ok = await comparePassword(senha, user.senhaHash);
    if (!ok) {
      return null;
    }

    return user;
  },
};
