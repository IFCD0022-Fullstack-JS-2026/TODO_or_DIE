import { useState } from "react";

const Inicial = {

    titulo: "",
    fechahora: "",
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

        setError({});

        console.log(form)
    };

    console.log(Inicial)

    return (
        <>
            <h1>Nueva Tarea</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="titulo">Titulo</label>
                <input type="text" id="titulo" name="titulo" placeholder="Añade aqui tu tarea..." value={form.titulo}
                    onChange={handleChange} className={error.titulo ? "input-error" : ""} />
                {error.titulo && <p style={{ color: "red" }}>{error.titulo}</p>}

                <label htmlFor="fechahora">Fecha y Hora</label>
                <input type="datetime-local" id="fechahora" name="fechahora" value={form.fechahora}
                    onChange={handleChange} />

                <label htmlFor="prioridad">Prioridad</label>
                <select id="prioridad" name="prioridad" value={form.prioridad}
                    onChange={handleChange} >
                    <option value="">-- Elije --</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>


                <label htmlFor="categoria">Categoria</label>
                <input type="text" id="categoria" name="categoria" value={form.categoria}
                    onChange={handleChange} />

                <label htmlFor="descripcion">Descripcion</label>
                <input type="text" id="descripcion" name="descripcion" value={form.descripcion}
                    onChange={handleChange} />

                <button type="submit">Guardar</button>

            </form>

        </>
    )
}

export default NuevaTarea;