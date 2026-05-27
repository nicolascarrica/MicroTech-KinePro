import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';

import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ReservaService } from './reserva.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { EstadoReserva } from '@prisma/client';
import { Roles } from '@/auth/roles.decorator';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Roles('PACIENTE')
  @Post('crear')
  create(@Req() req, @Body() createReservaDto: CreateReservaDto) {
    const pacienteId = req.user.id;
    return this.reservaService.create(createReservaDto, pacienteId);
  }

  @Roles('PACIENTE')
  @Get('')
  findAll(@Req() req) {
    const pacienteId = req.user.id;
    return this.reservaService.findAll(pacienteId);
  }

  @Roles('PACIENTE')
  @Get('historial')
  findHistorial(@Req() req) {
    const pacienteId = req.user.id;
    return this.reservaService.findHistorial(pacienteId);
  }

  @Roles('PACIENTE')
  @Get('mis-reservas')
  async getReservasFiltro(@Req() req, @Query('estado') estado:EstadoReserva = EstadoReserva.PENDIENTE)
  {
    const pacienteId = req.user.id;
    return this.reservaService.filtrarReservas(pacienteId, estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(+id);
  }

  @Roles('PACIENTE')
  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    const pacienteId = req.user.id;
    return this.reservaService.update(+id, pacienteId, updateReservaDto);
  }

  @Roles('PACIENTE')
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const pacienteId = req.user.id;
    return this.reservaService.remove(+id, pacienteId);
  }
}
