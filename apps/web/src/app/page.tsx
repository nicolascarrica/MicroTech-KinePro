// src/app/page.tsx
import Inicio from './Components/Inicio'; 
import ReservaTurnos from './reservas/ReservaTurnos';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Cartel de Bienvenida / Pasos y Auth */}
      <Inicio />

      {/* 2. El Calendario de turnos para reservar */}
      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Reserva tu Turno</h2>
        <ReservaTurnos />
      </div>
    </div>
  );
}