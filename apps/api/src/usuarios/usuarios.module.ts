import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Se exporta por si otro módulo necesita el servicio a futuro
})
export class UsuariosModule {} 
// Debe decir "export class", de lo contrario TS dice que "no es un módulo"