import { apiFetch } from '@/lib/api'

export type MetodoPagoPresencial = 'EFECTIVO' | 'TARJETA'

export interface RegistrarPagoInput {
  reserva_id: number
  metodo: MetodoPagoPresencial
}

export async function registrarPago(input: RegistrarPagoInput): Promise<{ message: string }> {
  return apiFetch('/pagos', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
