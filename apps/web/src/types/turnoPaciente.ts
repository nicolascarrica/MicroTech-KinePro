export interface TurnoPacientePendiente {
  id: number
  fecha: string
  hora: string
  actividad: string
}

export interface TurnoPacientePasado {
  id: number
  fecha: string
  hora: string
  actividad: string
  asistio: boolean
}
