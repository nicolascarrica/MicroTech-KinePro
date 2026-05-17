import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreatePacienteDto } from './usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  registrar(@Body() createPacienteDto: CreatePacienteDto) {
    return this.usuariosService.registrar(createPacienteDto);
  }
}