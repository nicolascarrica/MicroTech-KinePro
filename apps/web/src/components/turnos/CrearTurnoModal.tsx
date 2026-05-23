'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { crearTurno } from '@/services/turnosService'
import { getActividades } from '@/services/actividadesService'
import type { Actividad } from '@/types/actividad'

interface CrearTurnoModalProps {
  abierto: boolean
  fechaInicial: string | null
  onClose: () => void
  onCreado: () => void
}

// Slots válidos según el back: 07:00 a 20:00 (cierre 21:00, turnos de 60 min)
const HORARIOS = Array.from({ length: 14 }, (_, i) => {
  const h = (i + 7).toString().padStart(2, '0')
  return `${h}:00`
})

export default function CrearTurnoModal({ abierto, fechaInicial, onClose, onCreado }: CrearTurnoModalProps) {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [actividadId, setActividadId] = useState<string>('')
  const [fecha, setFecha] = useState<string>('')
  const [horaInicio, setHoraInicio] = useState<string>('')
  const [capacidad, setCapacidad] = useState<string>('')
  const [guardando, setGuardando] = useState(false)
  const [cargandoActividades, setCargandoActividades] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setCargandoActividades(true)
    getActividades()
      .then(setActividades)
      .catch((e: any) =>
        toast.error('No se pudieron cargar las actividades', { description: e.message }),
      )
      .finally(() => setCargandoActividades(false))
  }, [abierto])

  useEffect(() => {
    if (abierto) {
      setActividadId('')
      setFecha(fechaInicial ?? '')
      setHoraInicio('')
      setCapacidad('')
    }
  }, [abierto, fechaInicial])

  if (!abierto) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    try {
      const payload: {
        tipoActividad_id?: number
        fecha?: string
        hora_inicio?: string
        capacidad?: number
      } = {}
      if (actividadId !== '') payload.tipoActividad_id = Number(actividadId)
      if (fecha !== '') payload.fecha = fecha
      if (horaInicio !== '') payload.hora_inicio = horaInicio
      if (capacidad !== '') payload.capacidad = Number(capacidad)
      
      const res = await crearTurno(payload as any)
      toast.success(res.message)
      onCreado()
      onClose()
    } catch (err: any) {
      toast.error('Error', { description: err.message })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h3 className="mb-4 text-lg font-bold text-kine-blue">Crear turno</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Actividad</label>
            <select
              value={actividadId}
              onChange={(e) => setActividadId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kine-blue bg-white"
              disabled={cargandoActividades}
            >
              <option value="">
                {cargandoActividades ? 'Cargando…' : 'Seleccioná una actividad'}
              </option>
              {actividades.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kine-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Hora de inicio</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              step="3600"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kine-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Capacidad</label>
            <input
              type="number"
              min="1"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kine-blue"
              placeholder="Ej: 5"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-kine-blue text-white hover:bg-kine-blue-deep disabled:opacity-50 flex items-center gap-2"
            >
              {guardando && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear turno
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}