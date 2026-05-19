"use client";

import React, { useState } from 'react';
import { toast } from 'sonner'; 
import { ChevronLeft, ChevronRight, CalendarDays, Clock, CheckCircle2 } from 'lucide-react'; // 👈 Iconos vectoriales

interface RangoHorario {
  desde: string;
  hasta: string;
}

interface PayloadTurno {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  timestampInicio: string;
}

export default function CalendarioTurnos() {
  const hoy = new Date();
  
  const [mesActual, setMesActual] = useState<number>(hoy.getMonth());
  const [anioActual, setAnioActual] = useState<number>(hoy.getFullYear());
  
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [rangoHorarioSeleccionado, setRangoHorarioSeleccionado] = useState<RangoHorario | null>(null);

  const HORA_INICIO_LABORAL = 8;
  const HORA_FIN_LABORAL = 20;

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const primerDiaDelMes = new Date(anioActual, mesActual, 1).getDay();
  const totalDiasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  const diasArr = Array.from({ length: totalDiasEnMes }, (_, i) => i + 1);
  const espaciosVacios = Array.from({ length: primerDiaDelMes }, (_, i) => i);

  const generarRangosHorarios = (): RangoHorario[] => {
    const rangos: RangoHorario[] = [];
    for (let h = HORA_INICIO_LABORAL; h < HORA_FIN_LABORAL; h++) {
      const desde = `${String(h).padStart(2, '0')}:00`;
      const hasta = `${String(h + 1).padStart(2, '0')}:00`;
      rangos.push({ desde, hasta });
    }
    return rangos;
  };
  
  const rangosHorarios = generarRangosHorarios();

  const mesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual(anioActual - 1);
    } else {
      setMesActual(mesActual - 1);
    }
    resetSeleccion();
  };

  const mesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual(anioActual + 1);
    } else {
      setMesActual(mesActual + 1);
    }
    resetSeleccion();
  };

  const resetSeleccion = () => {
    setDiaSeleccionado(null);
    setRangoHorarioSeleccionado(null);
  };

  const handleConfirmarTurno = () => {
    if (!diaSeleccionado || !rangoHorarioSeleccionado) return;

    const mesFormateado = String(mesActual + 1).padStart(2, '0');
    const diaFormateado = String(diaSeleccionado).padStart(2, '0');
    
    const payloadTurno: PayloadTurno = {
      fecha: `${anioActual}-${mesFormateado}-${diaFormateado}`,
      horaInicio: rangoHorarioSeleccionado.desde,
      horaFin: rangoHorarioSeleccionado.hasta,
      timestampInicio: `${anioActual}-${mesFormateado}-${diaFormateado}T${rangoHorarioSeleccionado.desde}:00Z`
    };

    console.log("Payload para el backend:", payloadTurno);

    toast.success('¡Turno reservado con éxito!', {
      description: `Agendado para el ${diaFormateado}/${mesFormateado} de ${payloadTurno.horaInicio} a ${payloadTurno.horaFin} hs.`,
      duration: 4000,
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* SECCIÓN DEL CALENDARIO */}
        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-teal-600" />
              {nombresMeses[mesActual]} {anioActual}
            </h3>
            <div className="flex gap-1.5">
              <button 
                onClick={mesAnterior} 
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                title="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={mesSiguiente} 
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                title="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
            {diasSemana.map(d => <div key={d} className="py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {espaciosVacios.map(e => <div key={`vacio-${e}`} className="p-3"></div>)}

            {diasArr.map((dia) => {
              const esHoy = hoy.getDate() === dia && hoy.getMonth() === mesActual && hoy.getFullYear() === anioActual;
              const esSeleccionado = diaSeleccionado === dia;

              return (
                <button
                  key={`dia-${dia}`}
                  onClick={() => {
                    setDiaSeleccionado(dia);
                    setRangoHorarioSeleccionado(null);
                  }}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all flex flex-col items-center justify-center border aspect-square
                    ${esSeleccionado 
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10 scale-[1.02]' 
                      : 'border-transparent text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                    }
                    ${esHoy && !esSeleccionado ? 'border-teal-500 bg-teal-50/40 text-teal-600' : ''}
                  `}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN DE HORARIOS */}
        <div className="flex flex-col justify-between h-full min-h-[380px]">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              {diaSeleccionado 
                ? `Horarios: ${diaSeleccionado}/${mesActual + 1}` 
                : "Selecciona un día"}
            </h3>

            {diaSeleccionado ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {rangosHorarios.map((rango, idx) => {
                  const esHoraSeleccionada = rangoHorarioSeleccionado?.desde === rango.desde;
                  return (
                    <button
                      key={`rango-${idx}`}
                      onClick={() => setRangoHorarioSeleccionado(rango)}
                      className={`py-2.5 px-3 text-center border text-xs rounded-xl font-semibold transition-all
                        ${esHoraSeleccionada 
                          ? 'border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-600/10' 
                          : 'border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-600 hover:bg-slate-50/50'
                        }
                      `}
                    >
                      {rango.desde} - {rango.hasta}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-50/60 rounded-2xl p-6 text-center border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 min-h-[200px]">
                <CalendarDays className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <span>Elige una fecha del calendario para ver las horas de atención disponibles.</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={handleConfirmarTurno}
              disabled={!diaSeleccionado || !rangoHorarioSeleccionado}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2
                ${diaSeleccionado && rangoHorarioSeleccionado
                  ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }
              `}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Reserva</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}