import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ReservaService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ReservaService.name);


  async create(createReservaDto: CreateReservaDto) {
    // Fallido por turno lleno
    const turno = await this.prisma.turno.findUnique({
      where: { id: createReservaDto.turno_id },
    });

    if (!turno) {
      throw new BadRequestException('El turno especificado no existe');
    }

    if (turno.capacidad <= 0) {
      throw new BadRequestException(
        'La actividad no posee cupos en el día y horario seleccionado',
      );
    }

    // Por las dudas de que no haya ingresado una actividad (igual se chequea antes en el front)
    const actividad = await this.prisma.tipoActividad.findUnique({
      where: { id: turno.tipoActividad_id },
    });

    if (!actividad) {
      throw new BadRequestException('Debe seleccionar una actividad');
    }

    // Fallido por que ya tiene un turno para la misma fecha y hora
    const tieneReserva = await this.prisma.reserva.findFirst({
      where: {
        paciente_id: createReservaDto.paciente_id,
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

    // error por pago -> todavia no esta implementado asi que lo hago casero
    // llamar al servicio de pago o que te llegue si o si el arreglo con el pago[]
    try {
      // Intentamos ejecutar todo el bloque atómico
      await this.prisma.$transaction(async (tx) => {
        const nuevaReserva = await tx.reserva.create({
          data: {
            turno_id: createReservaDto.turno_id,
            paciente_id: createReservaDto.paciente_id,
            estado: 'CONFIRMADA', 
          },
        });

        await tx.turno.update({
          where: { id: turno.id },
          data: {
            capacidad: { decrement: 1 },
          },
        });

        // acá creo el pago...
      });
      return {
        message: 'Reserva exitosa',
      };

    } catch (error) 
      {
        if (error instanceof Error) {
          this.logger.error(`Error al procesar la transacción de la reserva: ${error.message}`, error.stack);
        } else {
          this.logger.error(`Error al procesar la transacción de la reserva: ${String(error)}`);
        }
        throw new InternalServerErrorException(
          'Ocurrió un error inesperado al procesar la reserva. Ningún cobro fue realizado. Por favor, intente nuevamente más tarde.'
        );
    }
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