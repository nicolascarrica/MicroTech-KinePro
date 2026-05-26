import { apiFetch } from '@/lib/api';
import type { TurnoPacientePasado, TurnoPacientePendiente } from '@/types/turnoPaciente'


export function adaptarReservaADto(reservaApi: any): TurnoPacientePendiente {
  // Formateos
  const fechaLimpia = reservaApi.turno.fecha.split('T')[0]; 
  const horaLimpia = reservaApi.turno.hora_inicio.substring(11, 16);

  // Retorno con el formato exacto que ustedes definieron
  return {
    id: reservaApi.id,
    fecha: fechaLimpia,
    hora: horaLimpia,
    actividad: reservaApi.turno.tipoActividad?.nombre || 'Sin actividad', // Fallback por las dudas
  
  };
}
export function adaptarReservaPasasdoADto(reservaApi: any): TurnoPacientePasado {
  // Formateos
  const fechaLimpia = reservaApi.turno.fecha.split('T')[0]; 
  const horaLimpia = reservaApi.turno.hora_inicio.substring(11, 16);

  // Retorno con el formato exacto que ustedes definieron
  return {
    id: reservaApi.id,
    fecha: fechaLimpia,
    hora: horaLimpia,
    actividad: reservaApi.turno.tipoActividad?.nombre || 'Sin actividad', // Fallback por las dudas
    asistio: reservaApi.asistio
  
  };
}

export async function obtenerMisReservas(estado?: string): Promise<TurnoPacientePendiente[]> {
  
  const endpoint = estado ? `/reserva/mis-reservas?estado=${estado}` : '/reserva/mis-reservas';
  const data = (await apiFetch(endpoint)) as any[];
  return data.map(adaptarReservaADto);
}
export async function obtenerMisReservasPasadas(estado?: string): Promise<TurnoPacientePasado[]> {
  
  const endpoint="/reserva" ;
  const data = (await apiFetch(endpoint)) as any[];
  return data.map(adaptarReservaPasasdoADto);
}




