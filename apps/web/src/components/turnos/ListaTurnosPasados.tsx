'use client'

import { CalendarCheck } from 'lucide-react'
import type { TurnoPacientePasado } from '@/types/turnoPaciente'

function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

interface ListaTurnosPasadosProps {
  turnos: TurnoPacientePasado[]
}

export default function ListaTurnosPasados({ turnos }: ListaTurnosPasadosProps) {
  if (turnos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-600">Usted no posee turnos pasados</p>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{turno.actividad}</p>
                <p className="text-sm text-slate-500">
                  {formatFecha(turno.fecha)} · {turno.hora} hs
                </p>
              </div>
            </div>
            <label className="flex cursor-default items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={turno.asistio}
                readOnly
                disabled
                className="h-4 w-4 rounded border-slate-300 text-teal-600"
              />
              <span className="font-medium text-slate-700">Asistió</span>
            </label>
          </div>
        </li>
      ))}
    </ul>
  )
}
