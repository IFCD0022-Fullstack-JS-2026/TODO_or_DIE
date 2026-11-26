import { useEffect, useState } from "react";
import { useAuth } from '../context/useAuth'
import './Inicio.css';
import './Perfil.css';

function Hoy() {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [tareas, setTareas] = useState([]);

    useEffect(() => {
        const CargarHoy = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/tasks/hoy', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });

                const datos = await res.json();

                if (!res.ok) throw new Error(datos.message);
                setTareas(datos.data || "Error interno del Sevidor ");
            } catch {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        CargarHoy();
    }, [token]);

    if (cargando) return <p>Cargando...</p>;
    if (error) return <p className="perfil-error">{error}</p>

    return (
        <main className="inicio">
            <h1 className="inicio-titulo">Para hoy</h1>

            {tareas.length === 0 ? (<p>No tienes tareas para hoy</p>) : (
                <div className="inicio-cards">
                    {tareas.map((tarea) => (
                        <div key={tarea.id} className="inicio-card">
                            <h3>{tarea.titulo}</h3>
                            <p>{tarea.descripcion}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Hoy;