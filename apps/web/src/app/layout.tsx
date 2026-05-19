// app/layout.tsx
import './globals.css'; // O donde tengas tus estilos globales
import Sidebar from './Components/Sidebar'; // Ajustá las rutas según tus carpetas
import Header from './Components/Header'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-100 min-h-screen flex">
        {/* Sidebar fija a la izquierda */}
        <Sidebar />

        {/* Contenedor principal de la derecha */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header arriba del todo */}
          <Header />

          {/* Área de contenido scrollable que inyecta cada página */}
          <main className="p-6 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}