import { IsInt, IsDateString, IsString, Matches, Min } from 'class-validator';

export class CreateTurnoDto {
  @IsInt({ message: 'tipoActividad_id debe ser un número entero' })
  tipoActividad_id!: number;

  @IsDateString({}, { message: 'La fecha debe estar en formato YYYY-MM-DD' })
  fecha!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe estar en formato HH:MM (ej: "10:00")',
  })
  hora_inicio!: string;

  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @Min(1, { message: 'La capacidad debe ser mayor a 0' })
  capacidad!: number;
}