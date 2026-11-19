import './Inicio.css';


function Inicio() {
    return (
        <>
            <h1>Lista de tareas</h1>
                <div className='tarjetas'>
                    <section className='prioridad'>
                        <h2>Prioridad Alta</h2>
                        <div>
                            <h4>Titulo</h4>
                            <p>Fecha</p>
                            <p>Prioridad</p>
                            <p>Categoria</p>
                            <button>Borrar</button>
                        </div>
                    </section>
                    <section className='prioridad'>
                        <h2>Prioridad Media</h2>
                        <div>
                            <h4>Titulo</h4>
                            <p>Fecha</p>
                            <p>Prioridad</p>
                            <p>Categoria</p>
                            <button>Borrar</button>
                        </div>
                    </section>
                    <section className='prioridad'>
                        <h2>Prioridad Baja</h2>
                        <div>
                            <h4>Titulo</h4>
                            <p>Fecha</p>
                            <p>Prioridad</p>
                            <p>Categoria</p>
                            <button>Borrar</button>
                        </div>
                    </section>
                </div>

        </>
    )
}

export default Inicio;