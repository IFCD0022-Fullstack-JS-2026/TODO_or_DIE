import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";
import "./Estadisticas.css";

function Estadisticas() {
  const { token } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {

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

  const categorias = estadisticas.porCategoria || [];

  const prioridadesBase = [
    { prioridad: "alta", clase: "estadisticas-alta" },
    { prioridad: "media", clase: "estadisticas-media" },
    { prioridad: "baja", clase: "estadisticas-baja" },
  ];

  const prioridadesCompletas = prioridadesBase.map((base) => {
    const encontrada = estadisticas.porPrioridad?.find(
      (p) => p.prioridad === base.prioridad
    );
    return {
      prioridad: base.prioridad,
      total: encontrada ? encontrada.total : 0,
      clase: base.clase,
    };
  });

  return (
    <main className="estadisticas">
      <h1 className="estadisticas-titulo">Estadísticas</h1>

      <section className="estadisticas-section">
        <div>
          <h2 className="estadisticas-subtitulo">Total de tareas</h2>
          <p className="estadisticas-total"><strong>{estadisticas.totalTareas}</strong></p>
        </div>

        <div>
          <h2 className="estadisticas-subtitulo">Por prioridad</h2>
          <ul className="estadisticas-lista">
            {prioridadesCompletas.map((p, i) => (
              <li key={i} >
                <span className={p.clase}>{p.prioridad}</span>: <strong>{p.total}</strong>
              </li>
            ))}
        
          </ul>
        </div>

        <div>
          <h2 className="estadisticas-subtitulo">Por categoría</h2>
          <ul className="estadisticas-lista">
            {categorias.map((item) => (
              <li
                key={item.categoria}
                className="estadisticas-item estadisticas-categoria"
              >
                <span>{item.categoria}</span>: <strong>{item.total}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Estadisticas;
