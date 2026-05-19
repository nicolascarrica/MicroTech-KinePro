'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner'; // 👈 Importamos sonner
import { Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react'; 
import TablaGenerica, { Columna } from './TablaGenerica'; 

interface Usuario {
  id: number | string; 
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  rol: string;
  fecha_registro: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const respuesta = await fetch(`${API}/usuarios`);
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar los usuarios');
        }

        const json = await respuesta.json();
        setUsuarios(json.data || []);
        
      } catch (e: any) {
        setError(e.message);
        setUsuarios([]); 
        toast.error('Error de servidor', { description: e.message });
      } finally {
        setCargando(false); 
      }
    };
    cargarUsuarios();
  }, []);

  const handleModificar = (id: number | string) => {
    toast.info(`Modificar usuario`, {
      description: `Abriendo edición para el ID: ${id}`,
    });
  };

  const handleBaja = (id: number | string) => {
    if (confirm('¿Estás seguro de que deseas dar de baja a este usuario?')) {
      toast.success('Solicitud procesada', {
        description: `El usuario con ID ${id} fue dado de baja correctamente.`,
      });
    }
  };

  // Configuración de las columnas con los nuevos iconos vectoriales
  const columnasConfig: Columna<Usuario>[] = [
    { 
      encabezado: 'Nombre y Apellido', 
      render: (u) => <span className="font-medium text-slate-800">{u.nombre} {u.apellido}</span> 
    },
    { 
      encabezado: 'DNI', 
      render: (u) => <span className="text-slate-500 font-mono">{u.dni}</span> 
    },
    { 
      encabezado: 'Email', 
      accessor: 'email' 
    },
    { 
      encabezado: 'Teléfono', 
      render: (u) => <span className="text-slate-500">{u.telefono || '-'}</span> 
    },
    { 
      encabezado: 'Acciones', 
      render: (u) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleModificar(u.id)}
            className="bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 p-2 rounded-xl text-xs font-semibold transition-colors border border-slate-200 hover:border-teal-200 flex items-center gap-1.5"
            title="Modificar usuario"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Modificar</span>
          </button>
          <button
            onClick={() => handleBaja(u.id)}
            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl text-xs font-semibold transition-colors border border-red-100 flex items-center gap-1.5"
            title="Dar de baja"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Dar de Baja</span>
          </button>
        </div>
      )
    }
  ];

 
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3 w-full bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Cargando listado de usuarios...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-sm flex items-center gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <div>
          <span className="font-bold">Hubo un problema:</span> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Encabezado de la sección */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Listado de Usuarios</h2>
          <p className="text-xs text-slate-400 mt-0.5">Gestión y control de cuentas registradas</p>
        </div>
        <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-100">
          Total: {usuarios.length}
        </span>
      </div>

      {/* Componente Genérico */}
      <TablaGenerica 
        datos={usuarios} 
        columnas={columnasConfig} 
        mensajeVacio="No hay usuarios registrados en el sistema." 
      />
      
    </div>
  );
}