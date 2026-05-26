import type { TurnoPacientePasado, TurnoPacientePendiente } from '@/types/turnoPaciente'



const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('kinepro_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; 
    } 
  }

  const finalHeaders = {
    ...headers,
    ...options?.headers,
  };

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: finalHeaders, 
  });

  const data = await res.json().catch(() => null);
  
  if (!res.ok) {
    const msg = data?.message ?? `Error ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
  }
  
  return data as T;
}

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
  const data = (await request(endpoint)) as any[];
  return data.map(adaptarReservaADto);
}
export async function obtenerMisReservasPasadas(estado?: string): Promise<TurnoPacientePasado[]> {
  
  const endpoint="/reserva" ;
  const data = (await request(endpoint)) as any[];
  return data.map(adaptarReservaPasasdoADto);
}




