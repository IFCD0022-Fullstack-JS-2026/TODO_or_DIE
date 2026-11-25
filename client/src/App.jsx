import './App.css'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import NuevaTarea from './pages/NuevaTarea'
import Perfil from './pages/Perfil'
import EditarTarea from './pages/EditarTarea'
import NoEncontrada from './pages/NoEncontrada'
import RutaProtegida from './components/RutaProtegida.jsx'
import Recuperar from './pages/Recuperar.jsx'
import Restablecer from './pages/Restablecer.jsx'
import { useAuth } from './context/useAuth.js'
import BotonTema from './components/BotonTema';
import CambiarPassword from './pages/CambiarPassword';

function App() {
  const navigate = useNavigate();
  const { logout, usuario } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">TODO or DIE</Link>

        <nav className="header-nav">
          <BotonTema />
          {usuario ? (
            <>
              <NavLink to="/">Inicio</NavLink>
              <NavLink to="/tareas/nueva">Nueva Tarea</NavLink>
              <NavLink to="/perfil">Mi perfil</NavLink>
              <div className='header-login'>
                <span>Hola, {usuario.nombre}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/registro">Registro</NavLink>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={
          <RutaProtegida>
            <Inicio />
          </RutaProtegida>
        } />

        <Route path="/login" element={<Login />} />

        <Route path="/tareas/nueva" element={
          <RutaProtegida>
            <NuevaTarea />
          </RutaProtegida>
        } />

        <Route path="/registro" element={<Registro />} />

        <Route path="/perfil" element={
          <RutaProtegida>
            <Perfil />
          </RutaProtegida>
        } />

        <Route path="/perfil/password" element={
          <RutaProtegida>
            <CambiarPassword />
          </RutaProtegida>
        } />

        <Route path="/tareas/:id/editar" element={
          <RutaProtegida>
            <EditarTarea />
          </RutaProtegida>
        } />

        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/restablecer/:token" element={<Restablecer />} />

        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </>
  )
}

export default App