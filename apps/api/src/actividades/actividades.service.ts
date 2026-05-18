import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActividadDto, ModificarActividadDto } from './actividades.dto';

@Injectable()
export class ActividadesService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateActividadDto) {
    // Nota: internamente la actividad se guarda en la tabla TipoActividad
    // (catálogo de actividades). El otro modelo "Actividad" del schema es
    // la oferta de horario y se maneja en otra HU.

    // Escenario 2: Creación fallida por actividad ya registrada
    const yaExiste = await this.prisma.tipoActividad.findUnique({
      where: { nombre: dto.nombre },
    });
    if (yaExiste) {
      throw new BadRequestException('La actividad ya se encuentra registrada');
    }

    // Escenario 1: Creación exitosa
    await this.prisma.tipoActividad.create({
      data: { nombre: dto.nombre },
    });

    return { message: 'La actividad se creó con éxito' };
  }

  async modificar(id: number, dto: ModificarActividadDto) {
    // Verificación adicional (no está en los escenarios de la HU, pero es buena
    // práctica): si la actividad que querés modificar no existe, devolver 404.
    const actividadActual = await this.prisma.tipoActividad.findUnique({
      where: { id },
    });
    if (!actividadActual) {
      throw new NotFoundException('La actividad no existe');
    }

    // Escenario 2: el nuevo nombre ya está siendo usado por OTRA actividad.
    // (Si el nombre coincide con el de la actividad actual, no hay conflicto:
    // simplemente no estás cambiando nada.)
    const conflicto = await this.prisma.tipoActividad.findUnique({
      where: { nombre: dto.nombre },
    });
    if (conflicto && conflicto.id !== id) {
      throw new BadRequestException('El nombre de la actividad ya se encuentra registrada');
    }

    // Escenario 1: Modificación exitosa
    await this.prisma.tipoActividad.update({
      where: { id },
      data: { nombre: dto.nombre },
    });

    return { message: 'La actividad se modificó con éxito' };
  }

  async eliminar(id: number) {
    // 1) Verificar que la actividad exista (no está en los escenarios, pero
    //    sin esto te tiraría un 500 feo si pasan un id inexistente).
    const actividad = await this.prisma.tipoActividad.findUnique({
      where: { id },
    });
    if (!actividad) {
      throw new NotFoundException('La actividad no existe');
    }

    // 2) Escenario 2: verificar que NO haya turnos activos.
    //    Interpretamos "activo" como cualquier estado != CANCELADO.
    //    Navegamos: TipoActividad -> Actividad (oferta) -> Turno.
    const turnosActivos = await this.prisma.turno.count({
      where: {
        oferta_actividad: {
          TipoActividad_id: id,
        },
        estado: { not: 'CANCELADO' },
      },
    });

    if (turnosActivos > 0) {
      throw new BadRequestException(
        'Deben reprogramarse los turnos antes de eliminar una actividad',
      );
    }

    // 3) Escenario 1: eliminar.
    //    Nota: si la TipoActividad tiene "ofertas" (filas de Actividad) sin
    //    turnos activos, la FK puede impedir el delete. Si te aparece ese caso
    //    en testing avisame y vemos si conviene borrar las ofertas en cascada
    //    o agregar onDelete: Cascade en el schema.
    await this.prisma.tipoActividad.delete({
      where: { id },
    });

    return { message: 'La actividad se eliminó con éxito' };
  }
}