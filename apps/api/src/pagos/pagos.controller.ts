import { Controller, Post, Body } from '@nestjs/common'
import { PagosService } from './pagos.service'
import { CrearPagoDto } from './pagos.dto'
import { Roles } from '@/auth/roles.decorator'

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Roles('OWNER', 'ADMIN')
  @Post()
  registrar(@Body() dto: CrearPagoDto) {
    return this.pagosService.registrar(dto)
  }
}
