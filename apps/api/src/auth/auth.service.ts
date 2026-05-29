import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // 1. Importamos el servicio de JWT
import { PrismaService } from '../prisma/prisma.service'; // Tu servicio de Prisma
import { LoginDto } from 'src/usuarios/usuarios.dto';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, 
  ) {}

  async login(dto: LoginDto) {
    const usuarioIngresado = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // Escenario 2: Fallido por email inexistente
    if (!usuarioIngresado) {
      throw new BadRequestException('Datos incorrectos');
    }

    // Escenario 5: Fallido por cuenta bloqueada
    if (usuarioIngresado.bloqueado) {
      throw new BadRequestException('La cuenta se encuentra bloqueada.');
    }

    // Escenario 3 y 4: Fallido por contraseña incorrecta
    if (usuarioIngresado.contrasena !== dto.password) {
      const nuevosIntentos = usuarioIngresado.intentosFallidos + 1;
      
      await this.prisma.usuario.update({
        where: { id: usuarioIngresado.id },
        data: { intentosFallidos: nuevosIntentos },
      });

      if (nuevosIntentos === 3) {
        await this.prisma.usuario.update({
          where: { id: usuarioIngresado.id },
          data: { bloqueado: true },
        });
        throw new BadRequestException(
          'Datos incorrectos. La cuenta fue bloqueada y se le envió un email al correo asociado para desbloquearla.'
        );
      }

      throw new BadRequestException('Datos incorrectos, intente nuevamente.');
    }

    // Escenario 1: Exitoso -> Reseteamos intentos fallidos
    await this.prisma.usuario.update({
      where: { id: usuarioIngresado.id },
      data: { intentosFallidos: 0 },
    });
    
    const paciente = await this.prisma.paciente.findUnique({
    where: { usuario_id: usuarioIngresado.id },
    select: { id: true }
  });

    // Esto es para el toke, es info que va con el token
    const usuarioRegistrado = { 
      id: usuarioIngresado.id,
      pacienteId: paciente ? paciente.id : null,
      dni: usuarioIngresado.dni, 
      email: usuarioIngresado.email,
      rol: usuarioIngresado.rol 
    };

    //Firmamos el token y retornamos lo que necesite el front
    return {
      message: 'Inicio de sesión exitoso',
      token: this.jwtService.sign(usuarioRegistrado),
      usuario: {
        id: usuarioIngresado.id,
        nombre: usuarioIngresado.nombre,
        apellido: usuarioIngresado.apellido,
        email: usuarioIngresado.email,
        dni: usuarioIngresado.dni,
        telefono: usuarioIngresado.telefono,
        rol: usuarioIngresado.rol,
      },
    };
  }
}