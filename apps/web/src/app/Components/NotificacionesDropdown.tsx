"use client"; // Si usas Next.js App Router, mantené esta línea

import React, { useState } from 'react';

export default function NotificacionesDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Datos simulados (Mock data) para las notificaciones
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      titulo: 'Nuevo Turno Agendado',
      descripcion: 'Carlos Gómez reservó una sesión de Kinesiología para el 22/05 a las 16:00.',
      tiempo: 'Hace 5 min',
      leida: false,
      tipo: 'turno'
    },
    {
      id: 2,
      titulo: 'Turno Cancelado',
      descripcion: 'María Laura canceló su turno de descarga muscular de mañana.',
      tiempo: 'Hace 2 horas',
      leida: false,
      tipo: 'alerta'
    },
    {
      id: 3,
      titulo: 'Reporte Mensual Listo',
      descripcion: 'El balance de turnos del mes anterior ya está disponible para descargar.',
      tiempo: 'Ayer',
      leida: true,
      tipo: 'sistema'
    }
  ]);

  // Contamos cuántas no están leídas para mostrar en la campanita
  const noLeidasCount = notificaciones.filter(n => !n.leida).length;

  const marcarTodasComoLeidas = () => {
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
  };

  return (
    <div className="relative inline-block text-left">
      
      {/* Botón de la Campana con indicador de notificaciones no leídas */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        <span className="text-sm font-medium hidden md:inline">Notificaciones</span>
        
        {/* Píldora roja indicadora (solo si hay no leídas) */}
        {noLeidasCount > 0 && (
          <span className="absolute top-0 left-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white transform -translate-y-1">
            {noLeidasCount}
          </span>
        )}
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <>
          {/* Capa invisible para cerrar al hacer clic afuera */}
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>

          {/* Caja del menú (Ancho sugerido 380px para que entren bien los textos cortos) */}
          <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl border border-gray-100 z-30 rounded-lg overflow-hidden">
            
            {/* Cabecera del panel */}
            <div className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-100">
              <span className="font-semibold text-gray-800">Notificaciones</span>
              {noLeidasCount > 0 && (
                <button 
                  onClick={marcarTodasComoLeidas}
                  className="text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            {/* Lista de notificaciones */}
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {notificaciones.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400">
                  No tienes notificaciones pendientes
                </div>
              ) : (
                notificaciones.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 transition-colors flex gap-3 ${notif.leida ? 'bg-white' : 'bg-teal-50/30'}`}
                  >
                    {/* Indicador visual lateral según tipo si no está leída */}
                    {!notif.leida && (
                      <span className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notif.tipo === 'alerta' ? 'bg-red-500' : 'bg-teal-500'}`} />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className={`text-sm ${notif.leida ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                          {notif.titulo}
                        </h4>
                        <span className="text-[11px] text-gray-400 shrink-0">{notif.tiempo}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-normal">
                        {notif.descripcion}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer del panel */}
            <div className="border-t border-gray-100">
              <a 
                href="#todas-notificaciones" 
                className="block text-center p-3 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Ver todo el historial
              </a>
            </div>

          </div>
        </>
      )}
    </div>
  );
}