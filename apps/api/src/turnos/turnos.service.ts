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

    // Validar que la fecha no sea anterior a hoy
    const hoyUTC = new Date();
    hoyUTC.setUTCHours(0, 0, 0, 0);
      
    if (fechaDate < hoyUTC) {
      throw new BadRequestException('La fecha del turno no puede ser anterior al día actual');
    }


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

    // Verificar que no exista YA la misma actividad en ese día y horario
    // (la combinación (fecha, hora_inicio, tipoActividad_id) es unique en el schema).
    const turnoExistente = await this.prisma.turno.findUnique({
      where: {
        fecha_hora_inicio_tipoActividad_id: {
          fecha: fechaDate,
          hora_inicio: horaInicioDate,
          tipoActividad_id: dto.tipoActividad_id,
        },
      },
    });

    if (turnoExistente) {
      throw new BadRequestException('La actividad ya existe en el día y horario seleccionado');
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

  // ============================================================
  // HU: Visualizar turnos (personal)
  // ============================================================

  // Cubre Escenarios 1 y 2: devuelve la lista de turnos de la fecha
  // (array vacío si no hay; el front muestra el mensaje correspondiente).
  async listarPorFecha(fechaStr: string) {
    const fecha = new Date(`${fechaStr}T00:00:00.000Z`);

    const turnos = await this.prisma.turno.findMany({
      where: { fecha },
      include: { tipoActividad: true },
      orderBy: { hora_inicio: 'asc' },
    });

    return turnos.map((t) => ({
      id: t.id,
      fecha: t.fecha,
      hora_inicio: t.hora_inicio,
      actividad: t.tipoActividad.nombre,
      capacidad: t.capacidad,
      cantidad_inscriptos: t.cantidad_inscriptos,
      espacios_libres: t.capacidad - t.cantidad_inscriptos,
      estado: t.estado,
    }));
  }

  // Cubre Escenario 3: detalle de un turno específico con reservas y espacios libres.
  async obtenerDetalle(id: number) {
    const turno = await this.prisma.turno.findUnique({
      where: { id },
      include: { tipoActividad: true },
    });

    if (!turno) {
      throw new NotFoundException('El turno no existe');
    }

    return {
      id: turno.id,
      fecha: turno.fecha,
      hora_inicio: turno.hora_inicio,
      actividad: turno.tipoActividad.nombre,
      cantidad_reservas: turno.cantidad_inscriptos,
      espacios_libres: turno.capacidad - turno.cantidad_inscriptos,
      capacidad: turno.capacidad,
      estado: turno.estado,
    };
  }

  async obtenerDiasDeTurnosDisponilbles(mes: number, anio: number): Promise<number[]> {
  
  const primerDia = new Date(Date.UTC(anio, mes - 1, 1));
  const primerDiaSiguienteMes = new Date(Date.UTC(anio, mes, 1));

  const turnosDelMes = await this.prisma.turno.findMany({
    where: {
      fecha: {
        gte: primerDia,             // Mayor o igual al día 1 del mes
        lt: primerDiaSiguienteMes,  // Menor estricto al día 1 del mes siguiente
      },
    },
    select: {
      fecha: true,
      capacidad: true,
      cantidad_inscriptos: true,
    },
  });

  const diasConCupo = turnosDelMes
    .filter(turno => turno.capacidad > turno.cantidad_inscriptos)
    .map(turno => turno.fecha.getUTCDate()); 

  const diasUnicos = [...new Set(diasConCupo)];
  return diasUnicos.sort((a, b) => a - b);
}
}