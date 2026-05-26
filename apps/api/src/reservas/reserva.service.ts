import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ReservaService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ReservaService.name);


  async create(createReservaDto: CreateReservaDto, pacienteId: number) {
  // 1. Buscamos el turno
  const turno = await this.prisma.turno.findUnique({
    where: { id: createReservaDto.turno_id },
  });

  if (!turno) {
    throw new BadRequestException('El turno especificado no existe');
  }

  // CORRECCIÓN 1: Validamos según los inscriptos actuales vs la capacidad total
  if (turno.cantidad_inscriptos >= turno.capacidad) {
    throw new BadRequestException(
      'La actividad no posee cupos en el día y horario seleccionado',
    );
  }

  // 2. Validamos la actividad
  const actividad = await this.prisma.tipoActividad.findUnique({
    where: { id: turno.tipoActividad_id },
  });

  if (!actividad) {
    throw new BadRequestException('Debe seleccionar una actividad');
  }

  
  const tieneReserva = await this.prisma.reserva.findFirst({
    where: {
      paciente_id: pacienteId, 
      turno: {
        fecha: turno.fecha,
      },
    },
  });

  if (tieneReserva) {
    throw new BadRequestException(
      'El paciente ya posee un turno para una actividad en el día y horario seleccionado',
    );
  }

  // transaccion para poder evitar inconsistencias en la base de datos
  try {

  await this.prisma.$transaction(async (tx) => {
    
   
    await tx.reserva.create({
      data: {
        estado: 'CONFIRMADA',         
        turno: {
          connect: { id: createReservaDto.turno_id }
        },
        paciente: {
          connect: { id: pacienteId }
        }
      },
    });

    await tx.turno.update({
      where: { id: createReservaDto.turno_id },
      data: {
        cantidad_inscriptos: { increment: 1 } 
      },
    });

    //Acá iría la lógica del pago...
  });

  return {
    message: 'Reserva exitosa',
  };

} catch (error)  
  {
    this.logger.error(`Error al procesar la transacción de la reserva: ${String(error)}`);
  }
  throw new InternalServerErrorException
  ( 'Ocurrió un error inesperado al procesar la reserva. Ningún cobro fue realizado. Por favor, intente nuevamente más tarde.' );

}

  findAll() {
    return `This action returns all reserva`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  // es para probar hasta que tengamos el pago
  async updateState(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
    // cancelar reservar seria
  }
}