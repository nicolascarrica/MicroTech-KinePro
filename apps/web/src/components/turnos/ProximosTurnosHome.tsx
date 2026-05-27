'use client'

import { useEffect, useState } from 'react'
import { getTurnosProximos } from '@/services/turnosService'
import type { TurnoResumenConFecha } from '@/types/turno'

function formatFecha(fecha: string) {
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

export default function ProximosTurnosHome() {
  const [turnos, setTurnos] = useState<TurnoResumenConFecha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let activo = true

    async function fetchTurnos() {
      try {
        const data = await getTurnosProximos(3, 14)
        if (!activo) return
        setTurnos(data)
      } catch (err: any) {
        if (!activo) return
        setError(err.message ?? 'No se pudieron cargar los turnos')
      } finally {
        if (!activo) return
        setLoading(false)
      }
    }

    fetchTurnos()

    return () => {
      activo = false
    }
  }, [])

  return (
    <section className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Próximos turnos</h2>
          <p className="text-sm text-slate-500">Los siguientes tres turnos a partir del día y horario actual.</p>
        </div>
      </div>

       {/* <div className="grid gap-4">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">Cargando turnos…</div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">{error}</div>
        ) : turnos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">No hay turnos próximos disponibles.</div>
        ) : (
          turnos.map((turno) => (
            <article key={turno.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">{formatFecha(turno.fecha)} · {turno.horario} hs</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{turno.actividad}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  turno.estado === 'DISPONIBLE'
                    ? 'bg-emerald-100 text-emerald-700'
                    : turno.estado === 'RESERVADO'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>{turno.estado === 'DISPONIBLE' ? 'Disponible' : turno.estado === 'RESERVADO' ? 'Reservado' : 'Cancelado'}</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-3 border border-slate-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Capacidad</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{turno.capacidad}</p>
                </div>
                <div className="rounded-2xl bg-white p-3 border border-slate-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reservas</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{turno.reservasActuales}</p>
                </div>
                <div className="rounded-2xl bg-white p-3 border border-slate-200">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Espacios libres</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{turno.espaciosLibres}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>*/}

      <div className="mt-6 rounded-3xl border border-teal-200 bg-teal-50 p-5 text-slate-800">
        <p className="text-base font-semibold">Próximamente módulo de asistencias</p>
        <p className="mt-1 text-sm text-slate-600">En breve podrás gestionar las asistencias de los turnos desde esta vista.</p>
      </div>
    </section>
  )
}
