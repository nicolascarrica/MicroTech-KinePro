import { Type } from 'class-transformer';
import { IsString, IsEmail, IsDate, MinLength, IsInt } from 'class-validator';

// 1. EL DTO BASE
// (Solo los campos de la tabla Usuario, tanto para Paciente como Administrador)
export class BaseUsuarioDto {
  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsString()
  dni!: string;

  @IsEmail({}, { message: 'El formato del email no es válido' })
  email!: string;

  @IsString()
  telefono!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe contener mínimo 8 caracteres' })
  password!: string;
}

// 2. El DTO de la HU "Registrar usuario"
export class CreatePacienteDto extends BaseUsuarioDto {
  @IsDate({ message: 'El formato de la fecha de nacimiento no es válido' })
  @Type(() => Date)
  fechaNacimiento!: Date;
}

export class CreateAdminDto extends BaseUsuarioDto {
  // Como no hereda de CreatePacienteDto no pide fecha de nacimiento.
}

export class UpdateUsuarioDto {
  @IsInt()
  id!: number;

  @IsString()
  nombre?: string;

  @IsString()
  apellido?: string;

  @IsEmail({}, { message: 'El formato del email no es válido' })
  email?: string;

  @IsString()
  telefono?: string;

  @IsString()
  dni?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email!: string;

  @IsString()
  password!: string;
}
export class LogoutDto {
  email!: string;
}

export class UpdateContraseñaDto {
  @IsString()
  passwordActual!: string;

  @IsString()
  passwordNueva!: string;

  @IsEmail()
  email!: string;
}

 export class CallRestoreContraseñaDto {
  @IsEmail()
  email!: string;
}
 export class RestoreContraseñaNuevaDto {
  @IsEmail()
  token!: string;

  @IsString()
  passwordActual!: string;
  
  @IsString()
  passwordNueva!: string;
}
export class UnlockAccountDto {
  @IsString({ message: 'El token debe ser una cadena de texto' })
  token!: string;
}