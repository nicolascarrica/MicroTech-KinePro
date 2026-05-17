import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateActividadDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la actividad es obligatorio' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  nombre!: string;
}