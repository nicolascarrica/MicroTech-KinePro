import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActividadDto } from './actividades.dto';

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
}