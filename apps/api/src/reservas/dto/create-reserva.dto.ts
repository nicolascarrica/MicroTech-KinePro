import { IsInt, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { EstadoReserva } from '@prisma/client';

export class CreateReservaDto {
  @IsInt({ message: 'El id del turno debe ser un número entero' })
  @IsNotEmpty({ message: 'El id del turno es obligatorio' })
  turno_id!: number;

  @IsInt({ message: 'El id del paciente debe ser un número entero' })
  @IsNotEmpty({ message: 'El id del paciente es obligatorio' })
  paciente_id!: number;


  // depende de como se implemente el pago es que lo dejamos o no
  //@IsEnum(EstadoReserva, { message: 'El estado debe ser un valor válido' })
  //@IsOptional()
  //estado?: EstadoReserva;
}
