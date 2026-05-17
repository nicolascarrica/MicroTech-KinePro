import { Controller, Post, Body } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './actividades.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  crear(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadesService.crear(createActividadDto);
  }
}