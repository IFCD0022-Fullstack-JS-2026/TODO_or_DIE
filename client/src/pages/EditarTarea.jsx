import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import './NuevaTarea.css';

const Inicial = {
    titulo: '',
    fecha_hora: '',
    prioridad: '',
    categoria: '',
    descripcion: '',
};

function EditarTarea() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(Inicial);
    const [error, setError] = useState({});
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarTarea = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const datos = await res.json();
                if (!res.ok) {
                    throw new Error(datos.message || 'Error al cargar la tarea');
                }
                const tarea = datos.data;
                setForm({
                    titulo: tarea.titulo ?? '',
                    fecha_hora: tarea.fecha_hora
                        ? tarea.fecha_hora.slice(0, 16).replace(' ', 'T')
                        : '',
                    prioridad: tarea.prioridad ?? '',
                    categoria: tarea.categoria ?? '',
                    descripcion: tarea.descripcion ?? '',
                });
            } catch (err) {
                setError({ api: err.message });
            } finally {
                setCargando(false);
            }
        };
        cargarTarea();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError({ ...error, [name]: '' });
        setMensaje('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.titulo.trim() === '') {
            setError({ titulo: 'El título es obligatorio' });
            return;
        }
        if (form.prioridad.trim() === '') {
            setError({ prioridad: 'Selecciona una prioridad' });
            return;
        }
        if (form.categoria.trim() === '') {
            setError({ categoria: 'La categoría es obligatoria' });
            return;
        }

        setError({});
        setMensaje('');

        try {
            const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    titulo: form.titulo,
                    fecha_hora: form.fecha_hora,
                    prioridad: form.prioridad,
                    categoria: form.categoria,
                    descripcion: form.descripcion,
                }),
            });

            const datos = await res.json();

            if (res.ok) {
                setMensaje(datos.message || 'Tarea actualizada');
                navigate('/');
            } else if (res.status === 400 && Array.isArray(datos.errors)) {
                setError({ api: datos.errors.join(', ') });
            } else {
                setError({ api: datos.message || 'Error al actualizar la tarea' });
            }
        } catch (err) {
            setError({ api: err.message });
        }
    };

    if (cargando) return <p>Cargando tarea…</p>;

    if (error.api && form.titulo === '') {
        return <p className="error">{error.api}</p>;
    }

    return (
        <main className="contenedor">
            <h1 className="titulo2">Editar Tarea</h1>
            <form className="formulario" onSubmit={handleSubmit}>
                <label className="campo" htmlFor="titulo">Título</label>
                <input
                    className="input"
                    id="titulo"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Escribe aquí el título"
                />
                {error.titulo && <p className="mensaje-error">{error.titulo}</p>}

                <label className="campo" htmlFor="fecha_hora">Fecha y Hora</label>
                <input
                    className="input"
                    id="fecha_hora"
                    name="fecha_hora"
                    type="datetime-local"
                    value={form.fecha_hora}
                    onChange={handleChange}
                />

                <label className="campo" htmlFor="prioridad">Prioridad</label>
                <select
                    className="input"
                    id="prioridad"
                    name="prioridad"
                    value={form.prioridad}
                    onChange={handleChange}
                >
                    <option value="">--Elige--</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>
                {error.prioridad && <p className="mensaje-error">{error.prioridad}</p>}

                <label className="campo" htmlFor="categoria">Categoría</label>
                <input
                    className="input"
                    id="categoria"
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    placeholder="Escribe aquí la categoría"
                />
                {error.categoria && <p className="mensaje-error">{error.categoria}</p>}

                <label className="campo" htmlFor="descripcion">Descripción</label>
                <textarea
                    className="input"
                    id="descripcion"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Escribe aquí la descripción"
                />

                {mensaje && <p className="mensaje-exito">{mensaje}</p>}
                {error.api && <p className="mensaje-error">{error.api}</p>}

                <button className="btn" type="submit">Guardar cambios</button>
            </form>
        </main>
    );
}

export default EditarTarea;