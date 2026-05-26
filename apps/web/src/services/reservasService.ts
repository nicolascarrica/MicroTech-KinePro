import { apiFetch } from "@/lib/api";
import { CrearReservaInput } from "@/types/reserva"

export async function crearReserva(input: CrearReservaInput): Promise<{ message: string }> {


  return apiFetch('/reserva/crear', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}