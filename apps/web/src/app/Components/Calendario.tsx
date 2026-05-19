"use client";

import React, { useState } from 'react';

// 1. Definimos la estructura que va a tener el rango horario
interface RangoHorario {
  desde: string;
  hasta: string;
}

// 2. Definimos la estructura del objeto final que vas a mandar a Postgres/.NET
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
  
  // Tipamos los estados que pueden empezar en null
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

  // Especificamos que esta función devuelve un array de RangoHorario
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
    // Al poner esta validación, TS ya sabe que acá abajo "diaSeleccionado" y "rangoHorarioSeleccionado" NO son null
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
    alert(`Turno: ${payloadTurno.fecha} de ${payloadTurno.horaInicio} a ${payloadTurno.horaFin}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Agendar Nuevo Turno</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CALENDARIO */}
        <div className="md:col-span-2 border-r border-gray-100 pr-0 md:pr-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-700">
              {nombresMeses[mesActual]} {anioActual}
            </h3>
            <div className="flex gap-2">
              <button onClick={mesAnterior} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                ⬅️
              </button>
              <button onClick={mesSiguiente} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                ➡️
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 mb-2">
            {diasSemana.map(d => <div key={d} className="py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
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
                  className={`p-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center
                    ${esSeleccionado 
                      ? 'bg-teal-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                    }
                    ${esHoy && !esSeleccionado ? 'border border-teal-500 text-teal-600' : ''}
                  `}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DE HORARIOS */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              {diaSeleccionado 
                ? `Horarios para el ${diaSeleccionado}/${mesActual + 1}` 
                : "Selecciona un día"}
            </h3>

            {diaSeleccionado ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {rangosHorarios.map((rango, idx) => {
                  // Agregamos el encadenamiento opcional (?.) para máxima seguridad en TS
                  const esHoraSeleccionada = rangoHorarioSeleccionado?.desde === rango.desde;
                  return (
                    <button
                      key={`rango-${idx}`}
                      onClick={() => setRangoHorarioSeleccionado(rango)}
                      className={`py-2 px-3 text-center border text-sm rounded-lg font-medium transition-all
                        ${esHoraSeleccionada 
                          ? 'border-teal-600 bg-teal-50 text-teal-700 font-bold ring-2 ring-teal-600/20' 
                          : 'border-gray-200 text-gray-600 hover:border-teal-600 hover:text-teal-600'
                        }
                      `}
                    >
                      {rango.desde} - {rango.hasta}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-200">
                Elige una fecha del calendario para ver los rangos de atención disponibles.
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-0">
            <button
              onClick={handleConfirmarTurno}
              disabled={!diaSeleccionado || !rangoHorarioSeleccionado}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm shadow transition-all text-center
                ${diaSeleccionado && rangoHorarioSeleccionado
                  ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Confirmar Reserva
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}