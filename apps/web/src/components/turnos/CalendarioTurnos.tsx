'use client'

import { useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateClickArg } from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

interface CalendarioTurnosProps {
  fechaSeleccionada: string | null
  onFechaSelect: (fecha: string) => void
}

function obtenerFechaHoy(): string {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = String(hoy.getMonth() + 1).padStart(2, '0')
  const day = String(hoy.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function CalendarioTurnos({ fechaSeleccionada, onFechaSelect }: CalendarioTurnosProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const fechaHoy = obtenerFechaHoy()

  function handleDateClick(arg: DateClickArg) {
    onFechaSelect(arg.dateStr)
  }

  function handleTodayClick() {
    calendarRef.current?.getApi().today()
    onFechaSelect(fechaHoy)
  }

  return (
    <div className="rounded-xl border border-neutral-bg bg-white p-4 shadow-sm [&_.fc-day-today]:bg-teal-accent/10 [&_.fc-daygrid-day.fc-day-selected]:bg-kineblue/10">
      <style>{`
        .fc-button-primary {
          background-color: #005C9C !important;
          border-color: #005C9C !important;
        }
        .fc-button-primary:hover {
          background-color: #002D4C !important;
          border-color: #002D4C !important;
        }
        .fc-day-today {
          background-color: rgba(41, 182, 182, 0.1) !important;
        }
        .fc-daygrid-day[data-date="${fechaSeleccionada}"] {
          background-color: rgba(0, 92, 156, 0.12) !important;
        }
        .fc-daygrid-day[data-date="${fechaSeleccionada}"] .fc-daygrid-day-number {
          color: #005C9C;
          font-weight: 700;
        }
        .fc-col-header-cell {
          background-color: #F1F1F1;
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        initialDate={fechaSeleccionada ?? fechaHoy}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev,next customToday',
          center: 'title',
          right: '',
        }}
        customButtons={{
          customToday: {
            text: 'Hoy',
            click: handleTodayClick,
          },
        }}
        height="auto"
        dayMaxEvents={false}
        selectable={false}
      />
    </div>
  )
}
