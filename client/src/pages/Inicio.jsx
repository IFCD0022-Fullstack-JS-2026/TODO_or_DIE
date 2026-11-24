import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { Link } from 'react-router';
import './Inicio.css';

function Inicio() {
    const { token } = useAuth();
    const [tareasAPI, setTareasAPI] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarTareas = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/tasks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const datos = await res.json();
                if (!res.ok) throw new Error(datos.message);
                setTareasAPI(datos.data);
            } catch (err) {
                setError(err.message);
            }
        };
        cargarTareas();
    }, [token]);

    if (error) return <p className="inicio-error">No se han podido cargar las tareas: {error}</p>;

    const eliminarTarea = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setTareasAPI((prev) => prev.filter((tarea) => tarea.id !== id));
                alert(data.message);
            } else {
                alert(data.message || 'Error al eliminar la tarea');
            }
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            alert('No se pudo conectar con el servidor');
        }
    };

    return (
        <main className="inicio">
            <h1 className="inicio-titulo">Lista de tareas</h1>

            <section className="inicio-grupo">
                <h2 className="inicio-grupo-titulo">Prioridad Alta</h2>
                <div className="inicio-cards">
                    {tareasAPI.filter((tarea) => (tarea.prioridad ?? '').toLowerCase() === 'alta').map((tarea) => (
                        <article key={tarea.id} className="inicio-card">
                            <div>
                                <h3 className="inicio-card-titulo">{tarea.title ?? tarea.titulo}</h3>
                                <p className="inicio-desc">{tarea.descripcion}</p>
                            </div>
                            <div className="inicio-propiedad">
                                <span className="inicio-fecha">{tarea.fecha_hora}</span>
                                <span className="inicio-prioridad inicio-prioridad-alta">{tarea.prioridad}</span>
                                <span className="inicio-cat">{tarea.categoria}</span>

                                <div className="inicio-acciones">
                                    <Link to={`/tareas/${tarea.id}/editar`} className="inicio-editar">
                                        Editar
                                    </Link>
                                    <button className="inicio-borrar" onClick={() => eliminarTarea(tarea.id)}>Borrar</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="inicio-grupo">
                <h2 className="inicio-grupo-titulo">Prioridad Media</h2>
                <div className="inicio-cards">
                    {tareasAPI.filter((tarea) => (tarea.prioridad ?? '').toLowerCase() === 'media').map((tarea) => (
                        <article key={tarea.id} className="inicio-card">
                            <div>
                                <h3 className="inicio-card-titulo">{tarea.title ?? tarea.titulo}</h3>
                                <p className="inicio-desc">{tarea.descripcion}</p>
                            </div>
                            <div className="inicio-propiedad">
                                <span className="inicio-fecha">{tarea.fecha_hora}</span>
                                <span className="inicio-prioridad inicio-prioridad-media">{tarea.prioridad}</span>
                                <span className="inicio-cat">{tarea.categoria}</span>

                                <div className="inicio-acciones">
                                    <Link to={`/tareas/${tarea.id}/editar`} className="inicio-editar">
                                        Editar
                                    </Link>
                                    <button className="inicio-borrar" onClick={() => eliminarTarea(tarea.id)}>Borrar</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="inicio-grupo">
                <h2 className="inicio-grupo-titulo">Prioridad Baja</h2>
                <div className="inicio-cards">
                    {tareasAPI.filter((tarea) => (tarea.prioridad ?? '').toLowerCase() === 'baja').map((tarea) => (
                        <article key={tarea.id} className="inicio-card">
                            <div>
                                <h3 className="inicio-card-titulo">{tarea.title ?? tarea.titulo}</h3>
                                <p className="inicio-desc">{tarea.descripcion}</p>
                            </div>
                            <div className="inicio-propiedad">
                                <span className="inicio-fecha">{tarea.fecha_hora}</span>
                                <span className="inicio-prioridad inicio-prioridad-baja">{tarea.prioridad}</span>
                                <span className="inicio-cat">{tarea.categoria}</span>

                                <div className="inicio-acciones">
                                    <Link to={`/tareas/${tarea.id}/editar`} className="inicio-editar">
                                        Editar
                                    </Link>
                                    <button className="inicio-borrar" onClick={() => eliminarTarea(tarea.id)}>Borrar</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Inicio;
