'use client'

import { CalendarClock, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import type { TurnoPacientePendiente } from '@/types/turnoPaciente'

function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

interface ListaTurnosPendientesProps {
  turnos: TurnoPacientePendiente[]
}

export default function ListaTurnosPendientes({ turnos }: ListaTurnosPendientesProps) {
  if (turnos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-600">Usted no posee turnos pendientes</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {turnos.map((turno) => (
        <li
          key={turno.id}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{turno.actividad}</p>
                <p className="text-sm text-slate-500">
                  {formatFecha(turno.fecha)} · {turno.hora} hs
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  toast.info('Reprogramar turno', {
                    description: `Turno #${turno.id} — próximamente conectado al backend.`,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-kine-blue px-3 py-1.5 text-xs font-semibold text-kine-blue hover:bg-kine-blue/5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reprogramar
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.info('Cancelar turno', {
                    description: `Turno #${turno.id} — próximamente conectado al backend.`,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
