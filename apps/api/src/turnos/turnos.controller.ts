import { Controller, Post, Body, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto, ListarTurnosDto } from './turnos.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  crear(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.crear(createTurnoDto);
  }

  // HU "Visualizar turnos (personal)" - Escenarios 1 y 2
  @Get()
  listarPorFecha(@Query() query: ListarTurnosDto) {
    return this.turnosService.listarPorFecha(query.fecha);
  }

  // HU "Visualizar turnos (personal)" - Escenario 3
  @Get(':id')
  obtenerDetalle(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.obtenerDetalle(id);
  }
}