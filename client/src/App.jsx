import './App.css'
import { Routes, Route, Link, NavLink } from 'react-router'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import Perfil from './pages/Perfil'
import NuevaTarea from './pages/NuevaTarea'
import NoEncontrada from './pages/NoEncontrada'

function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">TODO or DIE</Link>

      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/tareas/nueva">Nueva Tarea</NavLink>
        <NavLink to="/registro">Registro</NavLink>
        <NavLink to="/perfil">Perfil</NavLink>
      </nav>
      </header>

      <Routes>
         <Route path="/" element={<Inicio />} />
         <Route path="/login" element={<Login />} />
         <Route path="/tareas/nueva" element={<NuevaTarea />} />
         <Route path="/registro" element={<Registro />} />
         <Route path="/perfil" element={<Perfil />} />
         <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </>
  )
}

export default App
