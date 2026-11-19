import './Inicio.css';


function Inicio() {
    return (
        <>
            <h1 className='tituloInic'>Lista de tareas</h1>
                <div className='tarjetas'>
                    <h2>Prioridad Alta</h2>
                    <section className='card'>
                        <div>
                            <h4>Maquetar el lista de tareas en inicio</h4>
                            <p className='desc'>Maquetar el listado de tareas de client/src/pages/Inicio.jsx según el diseño (docs/diseno.png). Solo HTML y CSS, sin lógica: los datos de la API se cargarán en otra issue.</p>
                            <p className='fecha'>19/11/2026</p>
                            <p className='priori'>Alta</p>
                            <p className='cat'>Frontend</p>
                            <button className='borrar'>Borrar</button>
                        </div>
                    </section>
                    <h2>Prioridad Media</h2>
                    <section className='card'>
                        <div>
                            <h4>Limpiar y validar las rutas de tareas</h4>
                            <p className='desc'>Limpiar y validar las rutas de server/routes/tasks.routes.js</p>
                            <p className='fecha'>19/11/2026</p>
                            <p className='priori'>Media</p>
                            <p className='cat'>Backend</p>
                            <button className='borrar'>Borrar</button>
                        </div>
                    </section>
                    <h2>Prioridad Baja</h2>
                    <section className='card'>
                        <div>
                            <h4>Conectar el Registro con la API</h4>
                            <p className='desc'>En client/src/pages/Registro.jsx, enviar el formulario a POST http://localhost:3000/api/users/register.</p>
                            <p className='fecha'>19/11/2026</p>
                            <p className='priori'>Baja</p>
                            <p className='cat'>Backend</p>
                            <button className='borrar'>Borrar</button>
                        </div>
                    </section>
                </div>

        </>
    )
}

export default Inicio;