import './App.css'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import NuevaTarea from './pages/NuevaTarea'
import Perfil from './pages/Perfil'
import NoEncontrada from './pages/NoEncontrada'
import RutaProtegida from './components/RutaProtegida.jsx'
import { useAuth } from './context/useAuth.js'

function App() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();

  const logout = () => {
    setUsuario(null);
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">TODO or DIE</Link>

        <nav className="header-nav">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/tareas/nueva">Nueva Tarea</NavLink>
          {usuario ? (
            <div className='header-login'>
              <span>Hola, {usuario.nombre}</span>
              <button onClick={logout} className="btn-logout">
                Cerrar sesión
              </button>
            </div>
          ) : ( 
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/registro">Registro</NavLink>
          </>)
           
          }

        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          <RutaProtegida>
            <Inicio />
          </RutaProtegida>
        }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/tareas/nueva" element={
          <RutaProtegida>
            <NuevaTarea />
          </RutaProtegida>
        }
        />
        <Route path="/tareas/nueva" element={
          <RutaProtegida>
            <NuevaTarea />
          </RutaProtegida>
        }
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </>
  )
}

export default App
