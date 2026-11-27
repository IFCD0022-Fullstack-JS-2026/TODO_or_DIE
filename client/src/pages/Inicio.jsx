import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { Link } from 'react-router';
import './Inicio.css';

function Inicio() {
    const { token, usuario } = useAuth();
    const [tareasAPI, setTareasAPI] = useState([]);
    const [error, setError] = useState(null);

    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [filtros, setFiltros] = useState({ buscar: '', categoria: '' });

    const categorias = [];

    useEffect(() => {
        const cargarTareas = async () => {
            try {
                const params = [];
                if (filtros.buscar.trim() !== '') {
                    params.push(`buscar=${encodeURIComponent(filtros.buscar.trim())}`);
                }
                if (filtros.categoria !== '') {
                    params.push(`categoria=${encodeURIComponent(filtros.categoria)}`);
                }

                const query = params.length > 0 ? `?${params.join('&')}` : '';
                const res = await fetch(`http://localhost:3000/api/tasks${query}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const datos = await res.json();
                if (!res.ok) throw new Error(datos.message);
                setError(null);
                setTareasAPI(datos.data ?? []);
            } catch (err) {
                setError(err.message);
            }
        };
        cargarTareas();
    }, [token, filtros]);

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
        } catch (err) {
            console.error('Error al eliminar la tarea:', err);
            alert('No se pudo conectar con el servidor');
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            const tarea = tareasAPI.find((t) => t.id === id);

            if (!tarea || Boolean(tarea.completada) === nuevoEstado) return;

            const res = await fetch(`http://localhost:3000/api/tasks/${id}/completada`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });

            const datos = await res.json();

            if (res.ok) {
                setTareasAPI((prev) =>
                    prev.map((t) => (t.id === id ? datos.data : t))
                );
            } else {
                alert(datos.message || 'Error al actualizar la tarea');
            }
        } catch (err) {
            console.error('Error al cambiar el estado:', err);
            alert('No se pudo conectar con el servidor');
        }
    };

    const renderTarjeta = (tarea) => (
        <article
            key={tarea.id}
            className={`inicio-card ${tarea.completada ? 'inicio-card-hecha' : ''}`}
        >
            <div>
                <h3 className="inicio-card-titulo">{tarea.titulo}</h3>
                <p className="inicio-desc">{tarea.descripcion}</p>
            </div>

            <div className="inicio-propiedad">
                <span className="inicio-fecha">{tarea.fecha_hora}</span>
                <span className={`inicio-prioridad inicio-prioridad-${tarea.prioridad}`}>
                    {tarea.prioridad}
                </span>
                <span className="inicio-cat">{tarea.categoria}</span>
            </div>

            <div className="inicio-botones">
                <select
                    className={`inicio-estado ${tarea.completada ? 'inicio-estado-hecha' : 'inicio-estado-pendiente'}`}
                    value={tarea.completada ? 'hecha' : 'pendiente'}
                    onChange={(e) => cambiarEstado(tarea.id, e.target.value === 'hecha')}
                    aria-label="Estado de la tarea"
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="hecha">Hecha</option>
                </select>

                <div className="inicio-acciones">
                    <Link to={`/tareas/${tarea.id}/editar`} className="inicio-editar">
                        Editar
                    </Link>
                    <button className="inicio-borrar" onClick={() => eliminarTarea(tarea.id)}>
                        Borrar
                    </button>
                </div>
            </div>
        </article>
    );

    const handleBuscar = (e) => {
        e.preventDefault();
        setFiltros({
            buscar: textoBusqueda,
            categoria: categoriaSeleccionada
        });
    };

    return (
        <main className="inicio">
            <div className="inicio-cabecera">
                <p className="inicio-saludo">Hola, {usuario?.nombre ?? ''}</p>
                <Link to="/tareas/nueva" className="inicio-crear-btn">
                    <span className="inicio-crear-icono" aria-hidden="true">➕</span>
                    <span>Crear tarea</span>
                </Link>
            </div>

            <h1 className="inicio-titulo">Lista de tareas</h1>

            <form className="inicio-filtro-form" onSubmit={handleBuscar}>
                <div className="inicio-filtro-campo">
                    <label htmlFor="inicio-buscar" className="inicio-filtro-label">
                        Buscar
                    </label>
                    <input
                        id="inicio-buscar"
                        type="text"
                        className="inicio-filtro-input"
                        value={textoBusqueda}
                        onChange={(e) => setTextoBusqueda(e.target.value)}
                        placeholder="Buscar tareas..."
                    />
                </div>

                <div className="inicio-filtro-campo">
                    <label htmlFor="inicio-categoria" className="inicio-filtro-label">
                        Categoría
                    </label>
                    <select
                        id="inicio-categoria"
                        className="inicio-filtro-select"
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((cat) => (
                            <option key={cat.id ?? cat} value={cat.nombre ?? cat}>
                                {cat.nombre ?? cat}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="inicio-filtro-btn">
                    Buscar
                </button>
            </form>

            {tareasAPI.length === 0 ? (
                <p className="inicio-vacio">No hay tareas que coincidan</p>
            ) : (
                <>
                    <section className="inicio-grupo">
                        <h2 className="inicio-grupo-titulo">Prioridad Alta</h2>
                        <div className="inicio-cards">
                            {tareasAPI
                                .filter((t) => (t.prioridad ?? '').toLowerCase() === 'alta')
                                .map(renderTarjeta)}
                        </div>
                    </section>

                    <section className="inicio-grupo">
                        <h2 className="inicio-grupo-titulo">Prioridad Media</h2>
                        <div className="inicio-cards">
                            {tareasAPI
                                .filter((t) => (t.prioridad ?? '').toLowerCase() === 'media')
                                .map(renderTarjeta)}
                        </div>
                    </section>

                    <section className="inicio-grupo">
                        <h2 className="inicio-grupo-titulo">Prioridad Baja</h2>
                        <div className="inicio-cards">
                            {tareasAPI
                                .filter((t) => (t.prioridad ?? '').toLowerCase() === 'baja')
                                .map(renderTarjeta)}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}

export default Inicio;