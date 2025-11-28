import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


interface CriarConsultaInput {
  psicologoId: number;
  data: string;       
  horaInicio: string; 
  horaFim: string;    
}

export const consultaService = {
  async criarConsultaPaciente(
    pacienteUserId: number,
    body: CriarConsultaInput,
  ) {
    const paciente = await prisma.paciente.findUnique({
      where: { userId: pacienteUserId },
    });
    if (!paciente) throw new Error('Paciente não encontrado');

    const data = new Date(`${body.data}T00:00:00`);

    const [hI, mI] = body.horaInicio.split(':').map(Number);
    const [hF, mF] = body.horaFim.split(':').map(Number);
    const inicio = new Date(data);
    inicio.setHours(hI, mI, 0, 0);
    const fim = new Date(data);
    fim.setHours(hF, mF, 0, 0);

   

    const consulta = await prisma.consulta.create({
  data: {
    pacienteId: paciente.id,
    psicologoId: body.psicologoId,
    data,
    horaInicio: inicio,
    horaFim: fim,
    status: 'AGENDADA', 
  },
});

await prisma.notificacao.create({
  data: {
    psicologoId: body.psicologoId,
    pacienteId: paciente.id,
    tipo: 'CONSULTA_MARCADA', 
    mensagem: `Nova consulta agendada com ${paciente.nomeCompleto}`,
    dataEvento: inicio,
  },
});


    return consulta;
  },

  async cancelarConsultaPaciente(
    pacienteUserId: number,
    consultaId: number,
    motivo?: string,
  ) {
    const paciente = await prisma.paciente.findUnique({
      where: { userId: pacienteUserId },
    });
    if (!paciente) throw new Error('Paciente não encontrado');

    const consulta = await prisma.consulta.findUnique({
      where: { id: consultaId },
    });

    if (!consulta || consulta.pacienteId !== paciente.id) {
      throw new Error('Consulta não encontrada');
    }

    await prisma.consulta.update({
  where: { id: consultaId },
  data: {
    status: 'CANCELADA_PACIENTE', 
    motivoCancelamento: motivo,
  },
});

await prisma.notificacao.create({
  data: {
    psicologoId: consulta.psicologoId,
    pacienteId: paciente.id,
    tipo: 'CONSULTA_CANCELADA', 
    mensagem: `Consulta cancelada pelo paciente`,
    dataEvento: consulta.data,
  },
});

  },
};
