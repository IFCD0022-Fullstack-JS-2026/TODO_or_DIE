import { useEffect, useState } from 'react'
import './Inicio.css';

function Inicio() {

    const [tareasAPI, setTareasAPI] = useState([]);
    const [error, setError] = useState(null)

    useEffect(() => {
        const cargarTareas = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/tasks');
                const datos = await res.json();
                if (!res.ok) throw new Error(datos.message);
                setTareasAPI(datos.data);
            } catch (err) {
                setError(err.message);
                }
            };
            cargarTareas();
    }, []);

    if (error) return <p className="error">No se han podido cargar las tareas: {error}</p>

    const eliminarTarea = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (res.ok) {
                setTareasAPI((prev) => prev.filter((tarea)=> tarea.id !== id));
                alert(data.message);
            } else {
                alert(data.message || "Error al eliminar la tarea");
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
            alert ("No se pudo conectar con el servidor");
        }
    }


    return (
        <>
            <h1 className="tituloInic">Lista de tareas</h1>
            <div className="tarjetas">
                <h2>Prioridad Alta</h2>
                {tareasAPI.filter((tarea) => (tarea.prioridad ?? '').toLowerCase() === 'alta').map((tarea) => (
                    <section key={tarea.id} className="card">
                        <div>
                            <h4>{tarea.title ?? tarea.titulo}</h4>
                            <p className="desc">{tarea.descripcion}</p>
                            <p className="fecha">{tarea.fecha_hora}</p>
                            <p className="priori">{tarea.prioridad}</p>
                            <p className="cat">{tarea.categoria}</p>
                            <button className="borrar" onClick={() => eliminarTarea(tarea.id)}>Borrar</button>
                        </div>
                    </section>
                ))}
            </div>

            <div className="tarjetas">
                <h2>Prioridad Media</h2>
                {tareasAPI.filter((tarea) => (tarea.prioridad ?? '').toLowerCase() === 'media').map((tarea) => (
                    <section key={tarea.id} className="card">
                        <div>
                            <h4>{tarea.title ?? tarea.titulo}</h4>
                            <p className="desc">{tarea.descripcion}</p>
                            <p className="fecha">{tarea.fecha_hora}</p>
                            <p className="priori">{tarea.prioridad}</p>
                            <p className="cat">{tarea.categoria}</p>
                            <button className="borrar" onClick={() => eliminarTarea(tarea.id)}>Borrar</button>
                        </div>
                    </section>
                ))}
            </div>

            <div className="tarjetas">
                <h2>Prioridad Baja</h2>
                {tareasAPI.filter((tarea) => (tarea.prioridad ?? '').toLowerCase() === 'baja').map((tarea) => (
                    <section key={tarea.id} className="card">
                        <div>
                            <h4>{tarea.title ?? tarea.titulo}</h4>
                            <p className="desc">{tarea.descripcion}</p>
                            <p className="fecha">{tarea.fecha_hora}</p>
                            <p className="priori">{tarea.prioridad}</p>
                            <p className="cat">{tarea.categoria}</p>
                            <button className="borrar" onClick={() => eliminarTarea(tarea.id)}>Borrar</button>
                        </div>
                    </section>
                ))}
            </div>
        </>
    )
}

export default Inicio;