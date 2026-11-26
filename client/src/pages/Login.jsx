import { useState } from 'react';
import './Auth.css'
import { useAuth } from '../context/useAuth.js'
import { Link, useNavigate, Navigate } from 'react-router'

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const { login, token } = useAuth()
    const navigate = useNavigate()

    if (token) {
        return <Navigate to="/" replace />
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === "email") {
            setEmail(value)
        }

        if (name === "password") {
            setPassword(value)
        }

    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    };

    return (
        <main className="auth">
            <h1 className="auth-titulo">Login</h1>
            <form className="auth-form" onSubmit={handleLogin}>
                <label className="auth-campo">
                    Email
                    <input className="auth-input"
                        type='email'
                        name='email'
                        placeholder='tu@email.com'
                        value={email}
                        onChange={handleChange} />
                </label>
                <label className="auth-campo">
                    Contraseña
                    <input className="auth-input"
                        type='password'
                        name='password'
                        placeholder='Tu contraseña secreta!'
                        value={password}
                        onChange={handleChange} />
                </label>
                <button className="auth-boton" type='submit'>Entrar</button>

                {error && <p className="auth-error">{error}</p>}
              
            </form>
            <p className='login'>
                ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
            <p className='login'>
                ¿Has olvidado tu contraseña? <Link to="/recuperar">Recuperar</Link>
            </p>
        </main>
    )
}

export default Login;