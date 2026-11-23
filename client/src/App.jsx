import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Inicio from "./pages/Inicio";
import NuevaTarea from "./pages/NuevaTarea";
import { Plus, User, X } from "lucide-react";

function App() {
  const [modalNuevaTarea, setModalNuevaTarea] = useState(false);
  


  useEffect(() => {
    if (!modalNuevaTarea) return;

    const cerrarConEscape = (e) => {
      if (e.key === "Escape") setModalNuevaTarea(false);
    };

    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, [modalNuevaTarea]);

  return (
    <div className="container">
      <div className="container-page">
        <header className="header">
          <div className="header-logo">
            <a href="/">TODO OR DIE</a>
          </div>
          <div className="header-login">
            <button>
              <User size={16} fill="white" strokeWidth={1.75} />
              Salir
            </button>
            
          </div>
        </header>

        <div className="btn-add-task">
          <button type="button" onClick={() => setModalNuevaTarea(true)}>
            <Plus size={16} strokeWidth={1.75} />
            <span>Nueva Tarea</span>
          </button>
        </div>
    
        <Routes>
          <Route path="/dashboard" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tareas/nueva" element={<NuevaTarea />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>

        {modalNuevaTarea && (
          <div
            className="modal-overlay"
            onClick={() => setModalNuevaTarea(false)}
          >
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-label="Nueva tarea"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-cerrar"
                title="Cerrar"
                onClick={() => setModalNuevaTarea(false)}
              >
                <X size={18} strokeWidth={1.75} />
              </button>
              <NuevaTarea />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
