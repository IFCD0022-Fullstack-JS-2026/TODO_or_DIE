import { NavLink } from 'react-router'
import './NoEncontrada.css'

function NoEncontrada() {
    return (
        <main className="notfound-page">
            <div className="notfound-card">
                <p className="notfound-code" aria-hidden="true">404</p>
                <h1 className="notfound-title">Página no encontrada</h1>
                <p className="notfound-text">
                    La página que buscas no existe o ha cambiado de sitio.
                </p>
                <NavLink to="/" className="notfound-link">
                    Volver al inicio
                </NavLink>
            </div>
        </main>
    )
}

export default NoEncontrada