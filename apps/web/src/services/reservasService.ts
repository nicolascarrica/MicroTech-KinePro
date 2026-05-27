import { apiFetch } from "@/lib/api";
import { CrearReservaInput } from "@/types/reserva"

export async function crearReserva(input: CrearReservaInput): Promise<{ message: string }> {


  return apiFetch('/reserva/crear', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function cancelarReserva(
  reservaId: number,
): Promise<{ message: string; puedeReprogramar?: boolean }> {
  return apiFetch(`/reserva/${reservaId}`, {
    method: 'DELETE',
  })
}

export async function reprogramarReserva(
  reservaId: number,
  turno_id: number,
): Promise<{ message: string; cantReprogramaciones?: number; pierdeDescuento?: boolean }> {
  return apiFetch(`/reserva/${reservaId}`, {
    method: 'PATCH',
    body: JSON.stringify({ turno_id }),
  })
}