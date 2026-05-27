'use client';

// src/app/page.tsx
import Inicio from './Components/Inicio'; 
import ReservaTurnos from './reservas/ReservaTurnos';
import ProximosTurnosHome from '@/components/turnos/ProximosTurnosHome';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, rol, cargando } = useAuth();
  const puedeReservar = !cargando && isAuthenticated && rol === 'PACIENTE';
  const esAdminOwner = !cargando && isAuthenticated && (rol === 'ADMIN' || rol === 'OWNER');

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Cartel de Bienvenida / Pasos y Auth */}
      <Inicio />

      {/* 2. El Calendario de turnos para reservar */}
      {puedeReservar && (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Reserva tu turno</h2>
          <ReservaTurnos />
        </div>
      )}

      {/* 3. Vista de admin/owner para próximos turnos y asistencias */}
      {esAdminOwner && <ProximosTurnosHome />}
    </div>
  );
}