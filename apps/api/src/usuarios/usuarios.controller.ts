import { Controller, Post, Put, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreatePacienteDto, LoginDto, LogoutDto } from './usuarios.dto';
import { UpdateContraseñaDto, UpdateUsuarioDto } from './usuarios.dto';
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  registrar(@Body() createPacienteDto: CreatePacienteDto) {
    return this.usuariosService.registrar(createPacienteDto);
  }


  @Post('modificacion')
  modificar(@Body() UpdateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.modificar(UpdateUsuarioDto);
  }

  @Post('inicio')
  iniciar(@Body() LoginDto: LoginDto){
    return this.usuariosService.iniciarsesion(LoginDto);
  }

  @Post('cierre')
  cerrar(@Body() LogoutDto: LogoutDto){
    return this.usuariosService.cerrarsesion(LogoutDto);
  }

  @Put('modificarcontraseña')
  modificarContraseña(@Body() UpdateContraseñaDto: UpdateContraseñaDto){
    return this.usuariosService.modificarcontraseña(UpdateContraseñaDto);
  }

  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obtenerPorId(id);
  }
}