import { apiFetch } from "@/lib/api";
import { CrearReservaInput } from "@/types/reserva"



export function formatearFechas(fechasMensuales: Date[]): string[] {
  return fechasMensuales.map(fecha => {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    
    return `${año}-${mes}-${dia}`;
  });
}

export async function crearReservaFija(turnoBaseId: number, fechasMensuales: Date[]) {
    const respuesta = await apiFetch('/reserva/fija', {
       method: 'POST',
       body: JSON.stringify({ 
          turnoInicialId: turnoBaseId, 
          fechas: formatearFechas(fechasMensuales) 
       })
    });

    return respuesta; 
}

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