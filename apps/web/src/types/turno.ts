export type EstadoTurno = 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO'

export interface TurnoResumen {
  id: number
  horario: string
  actividad: string
  estado: EstadoTurno
  capacidad: number
  reservasActuales: number
  espaciosLibres: number
}

export interface TurnoDetalle {
  id: number
  horario: string
  actividad: string
  reservasActuales: number
  espaciosLibres: number
}

export interface TurnoResumenConFecha extends TurnoResumen {
  fecha: string
}

export interface CrearTurnoInput {
  tipoActividad_id: number
  fecha: string         // formato YYYY-MM-DD
  hora_inicio: string   // formato HH:MM
  capacidad: number
}


export interface Actividad {
  id: number;
  nombre: string;
  cuposTotales: number;
  cuposDisponibles: number;
}

export interface RangoHorarioBackend {
  idTurno: number;
  desde: string;
  hasta: string;
  actividades: Actividad[];
}