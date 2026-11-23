import { useState } from "react";
import './NuevaTarea.css';

const Inicial = {

    titulo: "",
    fecha_hora: "",
    prioridad: "",
    categoria: "",
    descripcion: ""
}

function NuevaTarea() {

    const [form, setForm] = useState(Inicial);
    const [error, setError] = useState({});
    const [mensaje, setMensaje] = useState("");


    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const valorFinal = type === "checkbox" ? checked : value;

        setForm({ ...form, [name]: valorFinal });

        setError({ ...error, [name]: "" });

        setMensaje("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.titulo.trim() === "") {
            setError({ titulo: "El Titulo es obligatorio" })
            return
        }

        if (form.prioridad.trim() === "") {
            setError({ prioridad: "Selecciona una prioridad" })
            return
        }

        if (form.categoria.trim() === "") {
            setError({ categoria: "La categoria es obligatoria" })
            return
        }

        setError({});
        setMensaje("");

        try {
            const tarea = await fetch("http://localhost:3000/api/tasks",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        titulo: form.titulo, fecha_hora: form.fecha_hora,
                        prioridad: form.prioridad, categoria: form.categoria, descripcion: form.descripcion, user_id: 1
                    })
                })

            const datos = await tarea.json();

            if (tarea.status === 201) {
                setMensaje(datos.message)
                setForm(Inicial)

            }
            else if (tarea.status === 400 && Array.isArray(datos.errors)) {
                setError({ api: datos.errors.join(", ") });
            } else {
                setError({ api: datos.message });
            }

        } catch (error) {
            setError({ api: error.message });
        }

    };

    return (
        <>
            <div className="contenedor">

                <h1 className="titulo2">NUEVA TAREA</h1>

                <form className="formulario" onSubmit={handleSubmit}>
                    <label htmlFor="titulo" className="campo">Titulo</label>
                    <input type="text" id="titulo" name="titulo" placeholder="Añade aqui tu tarea..." className="input" value={form.titulo}
                        onChange={handleChange} />
                    {error.titulo && <p className="mensaje-error">{error.titulo}</p>}

                    <label htmlFor="fecha_hora" className="campo">Fecha y Hora</label>
                    <input type="datetime-local" id="fecha_hora" name="fecha_hora" className="input" value={form.fecha_hora}
                        onChange={handleChange} />

                    <label htmlFor="prioridad" className="campo"  >Prioridad</label>
                    <select id="prioridad" name="prioridad" className="input" value={form.prioridad}
                        onChange={handleChange}>
                        <option value="">-- Elije --</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                    </select>
                    {error.prioridad && <p className="mensaje-error">{error.prioridad}</p>}


                    <label htmlFor="categoria" className="campo"  >Categoría</label>
                    <input type="text" id="categoria" name="categoria" placeholder="Añade aqui tu categoría..." className="input" value={form.categoria}
                        onChange={handleChange} />
                    {error.categoria && <p className="mensaje-error">{error.categoria}</p>}

                    <label htmlFor="descripcion" className="campo"  >Descripción</label>
                    <input type="text" id="descripcion" name="descripcion" placeholder="Añade aqui tu descripción..." className="input" value={form.descripcion}
                        onChange={handleChange} />

                    {mensaje && (<p className="mensaje-exito">{mensaje}</p>)}

                    {error.api && (<p className="mensaje-error">{error.api}</p>)}


                    <button type="submit" className="btn">Guardar</button>

                </form>
            </div>

        </>
    )
}

export default NuevaTarea;