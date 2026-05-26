"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner'; 
import { ChevronLeft, ChevronRight, CalendarDays, Clock, CheckCircle2, ClipboardList, Loader2 } from 'lucide-react';
import { getDiasDisponiblesDelMes, getHorariosTurnos } from '@/services/turnosService';
import { Actividad, RangoHorarioBackend } from '@/types/turno';
import { CrearReservaInput } from '@/types/reserva';
import { crearReserva } from '@/services/reservasService';




export default function CalendarioTurnos() {
  const hoy = new Date();
  
  // Estados del calendario
  const [mesActual, setMesActual] = useState<number>(hoy.getMonth());
  const [anioActual, setAnioActual] = useState<number>(hoy.getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  
  // Estados de datos del backend
  const [diasConCupo, setDiasConCupo] = useState<number[]>([]);
  const [horariosDelDia, setHorariosDelDia] = useState<RangoHorarioBackend[]>([]);
  
  // Estados de selección
  const [rangoSeleccionado, setRangoSeleccionado] = useState<RangoHorarioBackend | null>(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
  
  // Estados de UI (Cargas)
  const [cargandoDias, setCargandoDias] = useState<boolean>(false);
  const [cargandoHorarios, setCargandoHorarios] = useState<boolean>(false);

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const primerDiaDelMes = new Date(anioActual, mesActual, 1).getDay();
  const totalDiasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const diasArr = Array.from({ length: totalDiasEnMes }, (_, i) => i + 1);
  const espaciosVacios = Array.from({ length: primerDiaDelMes }, (_, i) => i);



  // buscamos todos los turnos con capacidad para ponerlos en el calendario
  useEffect(() => {
    const fetchDiasDisponibles = async () => {
      try {
    
        setCargandoDias(true);
        const diasConLugar = await getDiasDisponiblesDelMes(mesActual + 1, anioActual);
        setDiasConCupo(diasConLugar);
        
      } catch (error) {
        toast.error('Error al cargar el calendario', {
          description: 'No pudimos conectarnos con el servidor. Por favor, intentá de nuevo en unos minutos.',
          duration: 4000,
        });
        setDiasConCupo([]);
      } finally {
        
        setCargandoDias(false);
      }
    };

    fetchDiasDisponibles();
    resetSeleccion();
  }, [mesActual, anioActual]);

  //Buscamos de dia que selecciono, el horario y las actividades disponibles para el mismo
  useEffect(() => {
    const fetchHorarios = async () => {
      if (!diaSeleccionado) return;
      
      try {
        setCargandoHorarios(true);
        
        // Formateamos la fecha a YYYY-MM-DD
        const mesFormateado = String(mesActual + 1).padStart(2, '0');
        const diaFormateado = String(diaSeleccionado).padStart(2, '0');
        const fechaConsulta = `${anioActual}-${mesFormateado}-${diaFormateado}`;

        const turnosAgrupados = await getHorariosTurnos(fechaConsulta);

        setHorariosDelDia(turnosAgrupados);

      } catch (error) {
        setHorariosDelDia([]);
        toast.error('Error al cargar los horarios', {
          description: 'No pudimos obtener las actividades de este día. Intentá nuevamente.',
          duration: 4000,
        });
      } finally {
        setCargandoHorarios(false);
      }
    };

    fetchHorarios();
  }, [diaSeleccionado, mesActual, anioActual]);

 // esto son para manejar el front y que se vea lindo

  const mesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual(anioActual - 1);
    } else {
      setMesActual(mesActual - 1);
    }
  };

  const mesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual(anioActual + 1);
    } else {
      setMesActual(mesActual + 1);
    }
  };

  const resetSeleccion = () => {
    setDiaSeleccionado(null);
    setRangoSeleccionado(null);
    setActividadSeleccionada(null);
    setHorariosDelDia([]);
  };

  const handleSeleccionarHorario = (rango: RangoHorarioBackend) => {
    setRangoSeleccionado(rango);
    setActividadSeleccionada(null); 
  };

const handleConfirmarTurno = async () => {
  if (!diaSeleccionado || !rangoSeleccionado || !actividadSeleccionada) return;
  try {

    const inputReserva: CrearReservaInput = {
      turno_id: rangoSeleccionado.idTurno,
    };

    await crearReserva(inputReserva);
    const mesFormateado = String(mesActual + 1).padStart(2, '0');
    const diaFormateado = String(diaSeleccionado).padStart(2, '0');

    toast.success('¡Turno reservado con éxito!', {
      description: `${actividadSeleccionada.nombre} el ${diaFormateado}/${mesFormateado} de ${rangoSeleccionado.desde} a ${rangoSeleccionado.hasta} hs.`,
      duration: 4000,
    });
  } catch (error: any) {
    
    toast.error('No pudimos registrar tu reserva', {
      description: error.message || 'Ocurrió un problema de conexión. Intentá de nuevo.',
      duration: 5000,
    });
  }
};

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ================= SECCIÓN DEL CALENDARIO ================= */}
        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-teal-600" />
              {nombresMeses[mesActual]} {anioActual}
              {cargandoDias && <Loader2 className="w-4 h-4 text-teal-600 animate-spin ml-2" />}
            </h3>
            <div className="flex gap-1.5">
              <button onClick={mesAnterior} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={mesSiguiente} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
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
              const tieneCupo = diasConCupo.includes(dia); // Verificamos si el backend dijo que hay cupo

              return (
                <button
                  key={`dia-${dia}`}
                  disabled={!tieneCupo || cargandoDias}
                  onClick={() => {
                    setDiaSeleccionado(dia);
                    setRangoSeleccionado(null);
                    setActividadSeleccionada(null);
                  }}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all flex flex-col items-center justify-center border aspect-square
                    ${esSeleccionado 
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10 scale-[1.02]' 
                      : tieneCupo
                        ? 'border-transparent text-slate-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer'
                        : 'border-transparent text-slate-300 bg-slate-50/50 cursor-not-allowed' // Estilo para días sin cupo
                    }
                    ${esHoy && !esSeleccionado && tieneCupo ? 'border-teal-500 bg-teal-50/40 text-teal-600' : ''}
                  `}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= SECCIÓN DE HORARIOS Y ACTIVIDADES ================= */}
        <div className="flex flex-col h-full min-h-[380px]">
        
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              {diaSeleccionado ? `Horarios del ${diaSeleccionado}` : "Selecciona un día"}
              {cargandoHorarios && <Loader2 className="w-4 h-4 text-teal-600 animate-spin ml-auto" />}
            </h3>

            {!diaSeleccionado ? (
              <div className="text-xs text-slate-400 bg-slate-50/60 rounded-2xl p-6 text-center border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 min-h-[120px]">
                <CalendarDays className="w-6 h-6 text-slate-300 stroke-[1.5]" />
                <span>Elige una fecha para ver horarios.</span>
              </div>
            ) : horariosDelDia.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {horariosDelDia.map((rango, idx) => {
                  const esHoraSeleccionada = rangoSeleccionado?.desde === rango.desde;
                  return (
                    <button
                      key={`rango-${idx}`}
                      onClick={() => handleSeleccionarHorario(rango)}
                      className={`py-2 px-3 text-center border text-xs rounded-xl font-semibold transition-all
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
            ) : !cargandoHorarios ? (
               <div className="text-xs text-slate-500 text-center py-4">No hay horarios disponibles este día.</div>
            ):null}
          </div>

          {/* Bloque de Actividades (Aparece al seleccionar horario) */}
          <div className="flex-1">
             <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 transition-opacity ${rangoSeleccionado ? 'text-slate-800 opacity-100' : 'text-slate-300 opacity-50'}`}>
                <ClipboardList className="w-5 h-5 text-teal-600" />
                Actividades
             </h3>

             {rangoSeleccionado && (
                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                  {rangoSeleccionado.actividades.map((act) => {
                    const sinCupo = act.cuposDisponibles === 0;
                    const esActividadSeleccionada = actividadSeleccionada?.id === act.id;

                    return (
                      <button
                        key={`act-${act.id}`}
                        disabled={sinCupo}
                        onClick={() => setActividadSeleccionada(act)}
                        className={`text-left p-3 border rounded-xl text-sm transition-all flex justify-between items-center
                          ${sinCupo 
                            ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' 
                            : esActividadSeleccionada
                              ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-600/20'
                              : 'border-slate-200 text-slate-700 hover:border-teal-400 hover:shadow-sm'
                          }
                        `}
                      >
                        <span className="font-semibold">{act.nombre}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold ${sinCupo ? 'bg-slate-200 text-slate-500' : 'bg-teal-100 text-teal-700'}`}>
                          {sinCupo ? 'Agotado' : `${act.cuposDisponibles} cupos`}
                        </span>
                      </button>
                    )
                  })}
                </div>
             )}
          </div>

          {/* Botón de Confirmación */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleConfirmarTurno}
              disabled={!diaSeleccionado || !rangoSeleccionado || !actividadSeleccionada}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2
                ${diaSeleccionado && rangoSeleccionado && actividadSeleccionada
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
