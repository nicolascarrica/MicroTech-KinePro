import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';



export const metadata: Metadata = {
  title: 'KinePro - Sistema de Kinesiología',
  description: 'Gestión de pacientes y turnos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen bg-light-bg text-gray-800">
          {/* Sidebar a la izquierda (fija) */}
          <Sidebar />
          
          {/* Contenedor derecho: Columna que agrupa Header y Contenido */}
          <div className="flex-1 flex flex-col">
            
            {/* Header arriba */}
            <Header />
            
            {/* Contenido principal abajo */}
            <main className="flex-1 p-8 overflow-y-auto">
              
              {children}

            </main>

          </div>
        </div>
      </body>
    </html>
  );
}