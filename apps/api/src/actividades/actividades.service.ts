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
    const existe = await this.prisma.tipoActividad.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new BadRequestException('Ya existe una actividad con ese nombre');
    }
    if (dto.precio === undefined || dto.precio === null) {
      throw new BadRequestException('El precio es obligatorio');
    }

    // ----- Escenario 3: Creación fallida por precio no ingresado -----
// (lo valida el DTO con @IsNotEmpty → "El precio es obligatorio")

    await this.prisma.tipoActividad.create({
      data: {
        nombre: dto.nombre,
        precio: dto.precio,
      },
    });

    return { message: 'Actividad creada correctamente' };
  }

  // ============================================================
  // HU: Modificar actividad
  // ============================================================
  async modificar(id: number, dto: ModificarActividadDto) {
    const actividad = await this.prisma.tipoActividad.findUnique({
      where: { id },
    });

    if (!actividad) {
      throw new NotFoundException(`La actividad con ID ${id} no existe`);
    }

    const nombreTomado = await this.prisma.tipoActividad.findFirst({
      where: { nombre: dto.nombre, NOT: { id } },
    });

    if (nombreTomado) {
      throw new BadRequestException('Ya existe una actividad con ese nombre');
    }

    await this.prisma.tipoActividad.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        precio: dto.precio,
      },
    });

    return { message: 'Actividad modificada correctamente' };
  }

  // ============================================================
  // HU: Eliminar actividad
  // ============================================================
  async eliminar(id: number) {
    const actividad = await this.prisma.tipoActividad.findUnique({
      where: { id },
    });

    if (!actividad) {
      throw new NotFoundException(`La actividad con ID ${id} no existe`);
    }

    await this.prisma.tipoActividad.delete({ where: { id } });

    return { message: 'Actividad eliminada correctamente' };
  }
}
