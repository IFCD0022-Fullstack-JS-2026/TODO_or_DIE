import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import NuevaTarea from './pages/NuevaTarea'

function App() {
  return (
    <>
      <h1 className='titulo 1'>TODO or DIE</h1>

      <nav className='rutas'>
        <a href='/login'>Login</a>
        <a href='/registro'>Registro</a>
        <a href='/#'>Inicio</a>
        <a href='/tareas/nueva'>Nueva Tarea</a>
      </nav>
    </>
  )
}

export default App
