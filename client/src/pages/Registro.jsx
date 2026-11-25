import './Auth.css'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { Link, useNavigate, Navigate } from 'react-router'

function Registro() {

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const {login, token} = useAuth()
    const navigate = useNavigate()

    if (token) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!nombre.trim() || !email.trim() || !password.trim()) {
            setError("Todos los campos deben estar rellenos");
            return
        }
        try {
            const res = await fetch('http://localhost:3000/api/users/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: nombre, email: email, password: password })
            })

            const datos = await res.json();
            if (!res.ok) {
                if (datos.errors) {
                    setError(datos.errors.join(", "));
                } else {
                    setError(datos.message);
                }
                return;
            }
            if (res.status === 201) {
                await login(email, password);
                navigate("/")
            }
        } catch {
            setError("Error de conexión con el servidor")
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "nombre") setNombre(value);
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);

        setError("");
    };


    return (
        <main className="auth">
            <h1 className="auth-titulo">Registro</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-campo">
                    Nombre
                    <input className="auth-input" type='text' name='nombre' value={nombre} onChange={handleInputChange} placeholder='Tu nombre' />
                </label>
                <label className="auth-campo">
                    Email
                    <input className="auth-input" type='email' name='email' value={email} onChange={handleInputChange} placeholder='tu@email.com' />
                </label>
                <label className="auth-campo">
                    Contraseña
                    <input className="auth-input" type='password' name='password' value={password} onChange={handleInputChange} placeholder='Tu contraseña secreta!' />
                </label>
                {error && (
                    <div className='auth-error'>{error}</div>
                )}
                <button className="auth-boton" type='submit'>Crear cuenta</button>
            </form>
            <p className='login'>
                ¿Ya tienes cuenta? <Link to="/login">Entra</Link>
            </p>
        </main>
    )
}

export default Registro;