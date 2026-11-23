import "./Inicio.css";
import { Scheduler } from "calendarkit-pro";
import { useEffect, useState } from 'react'

function Inicio() {
    const [events, setEvents] = useState([]);
    return (
        
            <div className="inicio">
                <h1 className="inicio-title">Lista de tareas</h1>
                <div className="inicio-task">
                    <div className="inicio-cards">
                        <section className="inicio-card">
                            <div>
                                <h2>Maquetar el lista de tareas en inicio</h2>
                                <p className="inicio-desc">
                                    Maquetar el listado de tareas de client/src/pages/Inicio.jsx según
                                    el diseño (docs/diseno.png). Solo HTML y CSS, sin lógica: los
                                    datos de la API se cargarán en otra issue.
                                </p>
                            </div>
                            <div className="inicio-propiedad">
                                <div>
                                    <span className="inicio-fecha">19/11/2026</span>
                                    <span className="inicio-priori-hight">Alta</span>
                                    <span className="inicio-cat">Frontend</span>
                                </div>
                                <button className="inicio-borrar">Borrar</button>
                            </div>
                        </section>
                        <section className="inicio-card">
                            <div>
                                <h2>Limpiar y validar las rutas de tareas</h2>
                                <p className="inicio-desc">
                                    Limpiar y validar las rutas de server/routes/tasks.routes.js
                                </p>
                            </div>
                            <div className="inicio-propiedad">
                                <div>
                                    <span className="inicio-fecha">19/11/2026</span>
                                    <span className="inicio-priori-medium">Media</span>
                                    <span className="inicio-cat">Backend</span>
                                </div>
                                <button className="inicio-borrar">Borrar</button>
                            </div>
                        </section>
                        <section className="inicio-card">
                            <h2>Conectar el Registro con la API</h2>
                            <p className="inicio-desc">
                                En client/src/pages/Registro.jsx, enviar el formulario a POST
                                http://localhost:3000/api/users/register.
                            </p>
                            <div className="inicio-propiedad">
                                <div>
                                    <span className="inicio-fecha">19/11/2026</span>
                                    <span className="inicio-priori-low">Baja</span>
                                    <span className="inicio-cat">Backend</span>
                                </div>
                                <button className="inicio-borrar">Borrar</button>
                            </div>
                        </section>
                        <section className="inicio-card">
                            <h2>Conectar el Registro con la API</h2>
                            <p className="inicio-desc">
                                En client/src/pages/Registro.jsx, enviar el formulario a POST
                                http://localhost:3000/api/users/register.
                            </p>
                            <div className="inicio-propiedad">
                                <div>
                                    <span className="inicio-fecha">19/11/2026</span>
                                    <span className="inicio-priori-low">Baja</span>
                                    <span className="inicio-cat">Backend</span>
                                </div>
                                <button className="inicio-borrar">Borrar</button>
                            </div>
                        </section>
                    </div>
                    <div className="inicio-calendario">
                        <Scheduler
                            events={events}
                            onEventCreate={(event) =>
                                setEvents((list) => [
                                    ...list,
                                    { ...event, id: crypto.randomUUID() },
                                ])
                            }
                            onEventUpdate={(event) =>
                                setEvents((list) =>
                                    list.map((e) => (e.id === event.id ? event : e))
                                )
                            }
                            onEventDelete={(id) =>
                                setEvents((list) => list.filter((e) => e.id !== id))
                            }
                        />
                    </div>
                </div>

            </div>

     
    );
}

export default Inicio;