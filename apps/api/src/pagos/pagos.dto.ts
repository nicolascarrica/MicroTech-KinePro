import { IsEnum, IsInt } from 'class-validator'

export class CrearPagoDto {
  @IsInt()
  reserva_id!: number

  @IsEnum(['EFECTIVO', 'TARJETA'], {
    message: 'Debe seleccionar un método de pago para continuar',
  })
  metodo!: 'EFECTIVO' | 'TARJETA'
}