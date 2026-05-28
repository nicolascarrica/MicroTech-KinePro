import { IsEnum, IsInt } from 'class-validator'

export class CrearPagoDto {
  @IsInt()
  reserva_id!: number

  @IsEnum(['EFECTIVO', 'TARJETA'], {
    message: 'El método de pago debe ser EFECTIVO o TARJETA',
  })
  metodo!: 'EFECTIVO' | 'TARJETA'
}
