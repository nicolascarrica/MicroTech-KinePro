import { IsString, IsNotEmpty, MaxLength, IsNumber, Min, IsDefined } from 'class-validator';

export class CreateActividadDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la actividad es obligatorio' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  nombre!: string;

  @IsDefined({ message: 'El precio es obligatorio' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con hasta 2 decimales' },
  )
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio!: number;
}

export class ModificarActividadDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la actividad es obligatorio' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  nombre!: string;

  @IsDefined({ message: 'El precio es obligatorio' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con hasta 2 decimales' },
  )
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio!: number;
}