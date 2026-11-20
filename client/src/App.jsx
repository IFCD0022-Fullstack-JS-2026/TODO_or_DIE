import './App.css'
import { Routes, Route, NavLink } from 'react-router'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import NuevaTarea from './pages/NuevaTarea'
import NoEncontrada from './pages/NoEncontrada'
function App() {
  return (
    <>
      <h1 className='titulo 1'>TODO or DIE</h1>

      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/tareas/nueva">Nueva Tarea</NavLink>
        <NavLink to="/registro">Registro</NavLink>
      </nav>

      <Routes>
         <Route path="/" element={<Inicio />} />
         <Route path="/login" element={<Login />} />
         <Route path="/tareas/nueva" element={<NuevaTarea />} />
         <Route path="/registro" element={<Registro />} />
         <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </>
  )
}

export default App
