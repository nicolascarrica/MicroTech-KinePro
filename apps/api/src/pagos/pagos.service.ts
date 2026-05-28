import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CrearPagoDto } from './pagos.dto'

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async registrar(dto: CrearPagoDto) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id: dto.reserva_id },
      include: { turno: { include: { tipoActividad: true } } },
    })
    if (!reserva) {
      throw new NotFoundException('La reserva no existe')
    }

    const pagoExistente = await this.prisma.pago.findFirst({
      where: { reserva_id: dto.reserva_id, estado: 'COMPLETADO' },
    })
    if (pagoExistente) {
      throw new BadRequestException('La reserva ya tiene un pago registrado')
    }

    const monto = reserva.turno.tipoActividad.precio

    await this.prisma.$transaction(async (tx) => {
      await tx.pago.create({
        data: {
          reserva_id: dto.reserva_id,
          monto,
          metodo: dto.metodo,
          estado: 'COMPLETADO',
          fecha_pago: new Date(),
        },
      })

      await tx.reserva.update({
        where: { id: dto.reserva_id },
        data: { estado: 'CONFIRMADA' },
      })
    })

    return { message: 'Pago registrado correctamente' }
  }
}
