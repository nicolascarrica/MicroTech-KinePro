"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner'; // 👈 Importamos sonner
import { User, Settings, Calendar, LogOut, ChevronDown } from 'lucide-react'; // 👈 Importamos iconos pro

export default function PerfilDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nombre: string; apellido: string; email: string } | null>(null);

  useEffect(() => {
    const userStorage = localStorage.getItem('kinepro_user');
    if (userStorage) {
      setUsuario(JSON.parse(userStorage));
    }
  }, []);

  const Logout = () => {
    localStorage.removeItem('kinepro_token');
    localStorage.removeItem('kinepro_user');
    
    toast.success('Sesión cerrada correctamente');
    
    setIsOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Invitado';
  const emailUsuario = usuario ? usuario.email : 'sin-sesion@kinepro.com';
  const inicial = usuario ? usuario.nombre[0].toUpperCase() : 'I';

  return (
    <div className="relative inline-block text-left">
      
      {/* Botón Disparador */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
      >
        <div className="flex flex-col text-right  sm:flex">
          <span className="text-sm font-bold text-slate-700">{nombreCompleto}</span>
          <span className="text-xs text-slate-400 font-medium">
            {usuario ? 'Paciente' : 'Sin Sesión'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg border border-teal-100 shadow-sm">
          {inicial}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
         
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>

          {/* Caja del menú desplegable */}
          <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl border border-slate-100 z-30 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            
            {/* Cabecera interna del menú */}
            <div className="p-4 bg-slate-50/60 flex flex-col border-b border-slate-100">
              <span className="font-semibold text-slate-800 text-sm">{nombreCompleto}</span>
              <span className="text-xs text-slate-400 mt-0.5 truncate">{emailUsuario}</span>
            </div>
            
            {/* Opciones */}
            <div className="p-1.5 flex flex-col gap-0.5 text-sm text-slate-600">
              <a 
                href="#perfil" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2.5 font-medium"
              >
                <User className="w-4 h-4 text-slate-400" />
                Mi Perfil
              </a>
              <a 
                href="#config" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2.5 font-medium"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Configuración de la cuenta
              </a>
              <a 
                href="#turnos" 
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2.5 font-medium"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                Ver mis turnos
              </a>
            </div>

            <div className="border-t border-slate-100"></div>
            
            {/* Cerrar Sesión */}
            <div className="p-1.5">
              <button 
                onClick={Logout} 
                className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}