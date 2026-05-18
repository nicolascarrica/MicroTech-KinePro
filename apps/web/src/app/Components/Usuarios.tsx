import { useEffect, useState } from 'react';
interface Usuario{
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  password: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
export default function Usuarios (){
    const [usuario, setHealth] = useState<Usuario | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch(`${API}/usuarios/registro`)
          .then((r) => r.json())
          .then(setHealth)
          .catch((e) => setError(String(e)));
      }, []);


}