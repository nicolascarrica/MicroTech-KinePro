import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTurnoDto } from './turnos.dto';

@Injectable()
export class TurnosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateTurnoDto) {
    // Verificar que la actividad exista
    const actividad = await this.prisma.tipoActividad.findUnique({
      where: { id: dto.tipoActividad_id },
    });
    if (!actividad) {
      throw new NotFoundException('La actividad no existe');
    }

    // Parsear fecha y hora a Date
    // Importante: usamos UTC para evitar corrimientos por zona horaria.
    const fechaDate = new Date(`${dto.fecha}T00:00:00.000Z`);
    const horaInicioDate = new Date(`1970-01-01T${dto.hora_inicio}:00.000Z`);

    // Escenario 4: validar rango semanal (lunes a viernes).
    // getUTCDay(): 0 = domingo, 1 = lunes, ..., 6 = sábado.
    const diaSemana = fechaDate.getUTCDay();
    if (diaSemana === 0 || diaSemana === 6) {
      throw new BadRequestException('El día se encuentra fuera del rango semanal');
    }

    // Escenario 3: validar rango horario (07:00 a 20:00, con cierre a las 21:00).
    // Como los turnos duran 60 min, el último válido es el de las 20:00 (termina a las 21:00).
    const [horas, minutos] = dto.hora_inicio.split(':').map(Number);
    const minutosDesdeMedianoche = horas * 60 + minutos;
    const minLimite = 7 * 60;   // 07:00 = 420
    const maxLimite = 20 * 60;  // 20:00 = 1200
    if (minutosDesdeMedianoche < minLimite || minutosDesdeMedianoche > maxLimite) {
      throw new BadRequestException('El horario se encuentra fuera del rango horario');
    }

    // Escenarios 2 y 5: verificar si ya existe un turno en ese slot.
    // (fecha, hora_inicio) es @@unique en el schema.
    const turnoExistente = await this.prisma.turno.findUnique({
      where: {
        fecha_hora_inicio: {
          fecha: fechaDate,
          hora_inicio: horaInicioDate,
        },
      },
    });

    if (turnoExistente) {
      if (turnoExistente.tipoActividad_id === dto.tipoActividad_id) {
        // Escenario 2: misma actividad en mismo slot
        throw new BadRequestException(
          'La actividad ya existe en el día y horario seleccionado',
        );
      } else {
        // Escenario 5: otra actividad ocupando el slot
        throw new BadRequestException(
          'El día y horario se encuentra ocupado por otra actividad',
        );
      }
    }

    // Escenario 1: crear el turno
    await this.prisma.turno.create({
      data: {
        tipoActividad_id: dto.tipoActividad_id,
        fecha: fechaDate,
        hora_inicio: horaInicioDate,
        capacidad: dto.capacidad,
        cantidad_inscriptos: 0,
      },
    });

    return { message: 'Turno creado' };
  }
}