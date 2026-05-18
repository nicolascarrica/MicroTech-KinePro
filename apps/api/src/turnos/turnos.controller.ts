import { Controller, Post, Body } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './turnos.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  crear(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.crear(createTurnoDto);
  }
}