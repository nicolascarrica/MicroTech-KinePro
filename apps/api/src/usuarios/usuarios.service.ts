import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto, LogoutDto, LoginDto } from './usuarios.dto';
import { UpdateUsuarioDto, UpdateContraseñaDto } from './usuarios.dto';

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
    await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        dni: dto.dni,
        email: dto.email,
        telefono: dto.telefono,
        contrasena: dto.password, // Reemplazar por hashedPassword
        rol: 'PACIENTE',
        paciente: {
          create: {
            fecha_nacimiento: dto.fechaNacimiento,
            tipo_plan: 'PARTICULAR',
          },
        },
      },
    });

    return { message: 'Registro exitoso' };
  }

  async modificar(dto: UpdateUsuarioDto) {
    // Escenario 2: Fallido por dato/s ya registrado/s en el sistema.
    const emailExiste = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (emailExiste) {
      throw new BadRequestException('El email ya se encuentra registrado');
    }

    const telefonoExiste = await this.prisma.usuario.findUnique({
      where: { telefono: dto.telefono },
    });

    if (telefonoExiste) {
      throw new BadRequestException('El teléfono ya se encuentra registrado');
    }

    const dniExiste = await this.prisma.usuario.findUnique({
      where: { dni: dto.dni },
    });

    if (dniExiste) {
      throw new BadRequestException('El DNI ya se encuentra registrado');
    }

    // Escenario 1: Modificacion exitosa.
    // NOTA: el ID no debería venir del body sino extraerse del Token JWT en el Controller.
    await this.prisma.usuario.update({
      where: { id: dto.id },
      data: {
        email: dto.email,
        nombre: dto.nombre,
        apellido: dto.apellido,
        dni: dto.dni,
        telefono: dto.telefono,
      },
    });

    return { message: 'Modificacion de datos exitosa' };
  }

  async iniciarsesion(dto: LoginDto) {
    const usuarioIngresado = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // Escenario 2: Fallido por email inexistente
    if (!usuarioIngresado) {
      throw new BadRequestException('Datos incorrectos');
    }

    // Escenario 5: Fallido por cuenta bloqueada
    if (usuarioIngresado.bloqueado) {
      throw new BadRequestException('La cuenta fue bloqueada');
    }

    // Escenario 3 y 4: Fallido por contraseña incorrecta
    if (usuarioIngresado.contrasena !== dto.contrasena) {
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
          'Contraseña incorrecta. La cuenta fue bloqueada y se le envio un email al correo asociado para desbloquearla',
        );
        // Acá iría la acción que llama a la HU desbloquear cuenta.
      }

      throw new BadRequestException('Contraseña incorrecta, intente nuevamente.');
    }

    // Escenario 1: Exitoso
    await this.prisma.usuario.update({
      where: { id: usuarioIngresado.id },
      data: { intentosFallidos: 0 },
    });

    // NOTA: Para completar el inicio de sesión, acá deberías firmar y retornar un JWT Access Token.
    return { message: 'Inicio de sesión exitoso' };
  }

  async cerrarsesion(dto: LogoutDto) {
    const usuarioLogueado = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuarioLogueado) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // NOTA: Si manejás JWT, la lógica principal del logout suele resolverse en el Controller o el cliente.
    return { message: 'Sesión cerrada correctamente' };
  }

  async modificarcontraseña(dto: UpdateContraseñaDto) {
    const usuarioLog = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuarioLog) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Escenario 2: Fallido por contraseña actual incorrecta.
    if (usuarioLog.contrasena !== dto.contrasenaactual) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Escenario 3: Fallido por contraseña nueva igual a la actual.
    if (usuarioLog.contrasena === dto.contrasenanueva) {
      throw new BadRequestException('La contraseña nueva no puede ser igual a la actual');
    }

    // Escenario 4: Fallido por contraseña nueva menor a 8 caracteres.
    if (dto.contrasenanueva.length < 8) {
      throw new BadRequestException('La contraseña debe contener mínimo 8 caracteres');
    }

    await this.prisma.usuario.update({
      where: { email: dto.email },
      data: { contrasena: dto.contrasenanueva },
    });

    return { message: 'Contraseña modificada correctamente' };
  }

  async obtenerTodos() {
    const usuarios = await this.prisma.usuario.findMany({
      // Utilizo select para NO enviar la contraseña al frontend
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
      },
    });

    if (usuarios.length === 0) {
      return { message: 'No existen usuarios', data: [] };
    }

    return { data: usuarios };
  }

  async obtenerPorId(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        fecha_registro: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }

    return { data: usuario };
  }
}
