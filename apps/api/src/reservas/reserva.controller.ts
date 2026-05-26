import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';

import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ReservaService } from './reserva.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { EstadoReserva } from '@prisma/client';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  
  @UseGuards(JwtAuthGuard)
  @Post('crear')
  create(@Req() req, @Body() createReservaDto: CreateReservaDto) {
    const pacienteId = req.user.id;
    return this.reservaService.create(createReservaDto, pacienteId);
  }

 @UseGuards(JwtAuthGuard)
  @Get('')
  findAll(@Req() req) {
    const pacienteId = req.user.id;
    return this.reservaService.findAll(pacienteId);
  }

  @UseGuards(JwtAuthGuard)
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservaService.update(+id, updateReservaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reservaService.remove(id);
  }
}
