import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KinePro - Gestion de turnos',
  description: 'Centro de atencion kinesiologica KinePro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
