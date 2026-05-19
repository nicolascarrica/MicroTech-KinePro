'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateClickArg } from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

interface CalendarioTurnosProps {
  fechaSeleccionada: string | null
  onFechaSelect: (fecha: string) => void
}

export default function CalendarioTurnos({ fechaSeleccionada, onFechaSelect }: CalendarioTurnosProps) {
  function handleDateClick(arg: DateClickArg) {
    onFechaSelect(arg.dateStr)
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
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
        dayMaxEvents={false}
        selectable={false}
      />
    </div>
  )
}
