import './Auth.css'
import { NavLink } from 'react-router'

function Login() {
    return (
        <main className="auth">
            <h1 className="auth-titulo">Login</h1>
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <label className="auth-campo">
                    Email
                    <input className="auth-input" type='email' name='email' placeholder='tu@email.com' />
                </label>
                <label className="auth-campo">
                    Contraseña
                    <input className="auth-input" type='password' name='password' placeholder='Tu contraseña secreta!' />
                </label>
                <button className="auth-boton" type='submit'>Entrar</button>
            </form>
            <p className="auth-footer">
                ¿No tienes cuenta? <NavLink to="/registro" className="auth-link">Regístrate</NavLink>
            </p>
        </main>
    )
}

export default Login;