import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './usuarios.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async registrar(dto: CreatePacienteDto) {

    // Escenario 2: Registro fallido por DNI ya registrado
    const dniExiste = await this.prisma.usuario.findUnique({
      where: { dni: dto.dni },
    });
    if (dniExiste) {
      throw new BadRequestException('El DNI ya se encuentra registrado');
    }

    // Escenario 3: Registro fallido por email ya registrado
    const emailExiste = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (emailExiste) {
      throw new BadRequestException('El email ya se encuentra registrado');
    }

    // Escenario 4: Registro fallido por teléfono ya registrado
    const telefonoExiste = await this.prisma.usuario.findUnique({
      where: { telefono: dto.telefono },
    });
    if (telefonoExiste) {
      throw new BadRequestException('El teléfono ya se encuentra registrado');
    }

    // Escenario 5: Registro fallido por edad menor a los 13 años.
    const hoy = new Date();
    const fechaNac = dto.fechaNacimiento;
    let edadExacta = hoy.getFullYear() - fechaNac.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();

    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
      edadExacta--;
    }

    if (edadExacta < 13) {
      throw new BadRequestException('La edad mínima para registrarse es 13 años');
    }

    // Hashear contraseña (Buenas prácticas, nunca en texto plano)
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Escenario 1: Registro exitoso
    // La HU dice "registrarme para solicitar turnos", le asigno rol PACIENTE
    const nuevoUsuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        dni: dto.dni,
        email: dto.email,
        telefono: dto.telefono,
        contrasena: dto.password, // Reemplazar por hashedPassword
        rol: 'PACIENTE',
        // Creo la tabla Paciente
        paciente: {
          create: {
            fecha_nacimiento: dto.fechaNacimiento,
            tipo_plan: 'PARTICULAR'
          }
        }
      },
    });

    return { message: 'Registro exitoso' };
  }
}