import { ChevronLeft, ChevronRight, CalendarDays, Loader2 } from 'lucide-react';

interface Props {
  modalidad: 'UNICO' | 'MENSUAL'; 
  mesActual: number;
  anioActual: number;
  diasSeleccionados: number[]; 
  setDiasSeleccionados: (dias: number[]) => void; 
  diasConCupo: number[];
  cargandoDias: boolean;
  mesAnterior: () => void;
  mesSiguiente: () => void;
  setRangoSeleccionado: (rango: any) => void;
  setActividadSeleccionada: (act: any) => void;
}

export default function GrillaCalendario({
  modalidad, mesActual, anioActual, diasSeleccionados, setDiasSeleccionados, 
  diasConCupo, cargandoDias, mesAnterior, mesSiguiente, 
  setRangoSeleccionado, setActividadSeleccionada
}: Props) {
  
  const hoy = new Date();
  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const primerDiaDelMes = new Date(anioActual, mesActual, 1).getDay();
  const totalDiasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const diasArr = Array.from({ length: totalDiasEnMes }, (_, i) => i + 1);
  const espaciosVacios = Array.from({ length: primerDiaDelMes }, (_, i) => i);

  return (
    <>
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
          
          // NUEVO: Nos fijamos si el día actual está adentro del array
          const esSeleccionado = diasSeleccionados.includes(dia);
          
          const tieneCupo = diasConCupo.includes(dia); 

          return (
            <button
              key={`dia-${dia}`}
              disabled={!tieneCupo || cargandoDias}
              onClick={() => {
                
                setDiasSeleccionados([dia]);
                setRangoSeleccionado(null);
                setActividadSeleccionada(null);
              }}
              className={`p-3 rounded-xl text-sm font-semibold transition-all flex flex-col items-center justify-center border aspect-square
                ${esSeleccionado 
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10 scale-[1.02]' 
                  : tieneCupo
                    ? 'border-transparent text-slate-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer'
                    : 'border-transparent text-slate-300 bg-slate-50/50 cursor-not-allowed' 
                }
                ${esHoy && !esSeleccionado && tieneCupo ? 'border-teal-500 bg-teal-50/40 text-teal-600' : ''}
              `}
            >
              {dia}
            </button>
          );
        })}
      </div>
    </>
  );
}