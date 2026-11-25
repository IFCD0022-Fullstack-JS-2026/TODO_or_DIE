import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";
import "./Estadisticas.css";

function Estadisticas() {
  const { token } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!token) {
      setCargando(false);
      setError("No hay sesión activa");
      return;
    }
    const cargarEstadisiticas = async () => {
      setCargando(true);
      setError(null);

      try {
        const res = await fetch(
          "http://localhost:3000/api/tasks/estadisticas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const datos = await res.json();
        if (!res.ok) throw new Error(datos.message);
        setEstadisticas(datos.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargarEstadisiticas();
  }, [token]);

  if (cargando) {
    return (
      <div className="estadisticas">
        <p className="estadisticas-cargando">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estadisticas">
        <p className="estadisticas-error">{error}</p>
      </div>
    );
  }

  if (!estadisticas || estadisticas.totalTareas === 0) {
    return (
      <div className="estadisticas">
        <p className="estadisticas-vacio">Todavia no tienes tareas</p>
      </div>
    );
  }

  const prioridades = estadisticas.porPrioridad || [];
  const categorias = estadisticas.porCategoria || [];

  let alta = 0;
  let media = 0;
  let baja = 0;

  for (let i = 0; i < prioridades.length; i++) {
    const item = prioridades[i];
    if (item.prioridad === "alta") alta = item.total;
    if (item.prioridad === "media") media = item.total;
    if (item.prioridad === "baja") baja = item.total;
  }

  return (
    <main className="estadisticas">
      <h1 className="estadisticas-titulo">Estadísticas</h1>

      <section className="estadisticas-section">
        <h2 className="estadisticas-subtitulo">Total de tareas</h2>
        <p className="estadisticas-total">{estadisticas.totalTareas}</p>
      </section>

      <section className="estadisticas-section">
        <h2 className="estadisticas-subtitulo">Por prioridad</h2>
        <ul className="estadisticas-lista">
          <li className="estadisticas-alta">Alta: {alta}</li>
          <li className="estadisticas-media">Media: {media}</li>
          <li className="estadisticas-baja">Baja: {baja}</li>
        </ul>
      </section>

      <section className="estadisticas-section">
        <h2 className="estadisticas-subtitulo">Por categoría</h2>
        <ul className="estadisticas-lista">
          {categorias.map((item) => (
            <li
              key={item.categoria}
              className="estadisticas-item estadisticas-categoria"
            >
              {item.categoria}: {item.total}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Estadisticas;
