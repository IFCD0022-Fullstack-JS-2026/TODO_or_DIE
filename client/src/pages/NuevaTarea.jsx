import { useState } from "react";

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


    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const valorFinal = type === "checkbox" ? checked : value;

        setForm({ ...form, [name]: valorFinal });

        setError({ ...error, [name]: "" });
    };

    const handleSubmit = (e) => {
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

        console.log(form)
    };

    return (
        <>
            <h1>Nueva Tarea</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="titulo">Titulo</label>
                <input type="text" id="titulo" name="titulo" placeholder="Añade aqui tu tarea..." value={form.titulo}
                    onChange={handleChange} />
                {error.titulo && <p style={{ color:"var(--color-primario)" }}>{error.titulo}</p>}

                <label htmlFor="fecha_hora">Fecha y Hora</label>
                <input type="datetime-local" id="fecha_hora" name="fecha_hora" value={form.fecha_hora}
                    onChange={handleChange} />

                <label htmlFor="prioridad">Prioridad</label>
                <select id="prioridad" name="prioridad" value={form.prioridad}
                    onChange={handleChange}>
                    <option value="">-- Elije --</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>
                {error.prioridad && <p style={{ color:"var(--color-primario)" }}>{error.prioridad}</p>}


                <label htmlFor="categoria">Categoria</label>
                <input type="text" id="categoria" name="categoria" value={form.categoria}
                    onChange={handleChange}/>
                {error.categoria && <p style={{ color:"var(--color-primario)" }}>{error.categoria}</p>}

                <label htmlFor="descripcion">Descripcion</label>
                <input type="text" id="descripcion" name="descripcion" value={form.descripcion}
                    onChange={handleChange} />

                <button type="submit">Guardar</button>

            </form>

        </>
    )
}

export default NuevaTarea;