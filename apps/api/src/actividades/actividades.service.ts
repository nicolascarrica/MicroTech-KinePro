import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActividadDto, ModificarActividadDto } from './actividades.dto';

@Injectable()
export class ActividadesService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // HU: Crear actividad
  // ============================================================
  async crear(dto: CreateActividadDto) {
    // Nota: internamente la actividad se guarda en la tabla TipoActividad
    // (catálogo de actividades). El otro modelo "Actividad" del schema es
    // la oferta de horario y NO se usa en ninguna HU.

    // ----- Escenario 2: Creación fallida por actividad ya registrada -----
    const yaExiste = await this.prisma.tipoActividad.findUnique({
      where: { nombre: dto.nombre },
    });
    if (yaExiste) {
      throw new BadRequestException('La actividad ya se encuentra registrada');
    }
    if (dto.precio === undefined || dto.precio === null) {
      throw new BadRequestException('El precio es obligatorio');
    }

    // ----- Escenario 3: Creación fallida por precio no ingresado -----
// (lo valida el DTO con @IsNotEmpty → "El precio es obligatorio")


    // ----- Escenario 1: Creación exitosa -----
    await this.prisma.tipoActividad.create({
      data: {
        nombre: dto.nombre,
        precio: dto.precio,
      },
    });

    return { message: 'La actividad se creó con éxito' };
  }

  // ============================================================
  // HU: Modificar actividad
  // ============================================================
  async modificar(id: number, dto: ModificarActividadDto) {
    // Verificación adicional (no está en los escenarios de la HU, pero es
    // buena práctica): si la actividad que se quiere modificar no existe,
    // devolver 404 para evitar errores feos de Prisma.
    const actividadActual = await this.prisma.tipoActividad.findUnique({
      where: { id },
    });
    if (!actividadActual) {
      throw new NotFoundException('La actividad no existe');
    }

    // ----- Escenario 2: Modificar actividad fallido por nombre ya registrado -----
    // (El nuevo nombre ya está siendo usado por OTRA actividad. Si el nombre
    // coincide con el actual no hay conflicto.)
    const conflicto = await this.prisma.tipoActividad.findUnique({
      where: { nombre: dto.nombre },
    });
    if (conflicto && conflicto.id !== id) {
      throw new BadRequestException('El nombre de la actividad ya se encuentra registrada');
    }

// ----- Escenario 3: Modificar actividad fallido por precio no ingresado -----
// (lo valida el DTO con @IsNotEmpty → "El precio es obligatorio")

    // ----- Escenario 1: Modificar actividad exitoso -----
    await this.prisma.tipoActividad.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        precio: dto.precio,
      },
    });

    return { message: 'La actividad se modificó con éxito' };
  }

  // ============================================================
  // HU: Eliminar actividad
  // ============================================================
  async eliminar(id: number) {
    // Verificación adicional (no está en los escenarios de la HU, pero es
    // buena práctica): si la actividad no existe, devolver 404.
    const actividad = await this.prisma.tipoActividad.findUnique({
      where: { id },
    });
    if (!actividad) {
      throw new NotFoundException('La actividad no existe');
    }

    // ----- Escenario 2: Eliminar actividad fallido por turnos activos -----
    // "Activo" se interpreta como cualquier estado != CANCELADO
    // (es decir, DISPONIBLE o RESERVADO).
    const turnosActivos = await this.prisma.turno.count({
      where: {
        tipoActividad_id: id,
        estado: { not: 'CANCELADO' },
      },
    });
    if (turnosActivos > 0) {
      throw new BadRequestException(
        'Deben reprogramarse los turnos antes de eliminar una actividad',
      );
    }

    // ----- Escenario 1: Eliminar actividad exitoso -----
    await this.prisma.tipoActividad.delete({
      where: { id },
    });

    return { message: 'La actividad se eliminó con éxito' };
  }
}