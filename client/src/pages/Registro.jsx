import './Auth.css'
import { useState } from 'react'
import { NavLink } from 'react-router'

function Registro() {

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!nombre.trim() || !email.trim() || !password.trim()) {
            setError("Todos los campos deben estar rellenos");
            return
        }

        const res = await fetch('http://localhost:3000/api/users/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombre, email: email, password: password })
        })

        if (!res.ok) {
            switch (res.status) {
                case 400:
                    setError("Revisa los datos introducidos.");
                    break;
                case 409:
                    setError("Ya existe una cuenta registrada con ese correo.");
                    break;
                case 500:
                    setError("Error interno del servidor. Inténtalo de nuevo más tarde.");
                    break;
                default:
                    setError(`Error inesperado (código ${res.status}).`);
                    break;
            }
            return;
        }

        setMensaje("Cuenta creada")
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
                    <input className="auth-input" type='text' name='nombre' onChange={handleInputChange} placeholder='Tu nombre' />
                </label>
                <label className="auth-campo">
                    Email
                    <input className="auth-input" type='email' name='email' onChange={handleInputChange} placeholder='tu@email.com' />
                </label>
                <label className="auth-campo">
                    Contraseña
                    <input className="auth-input" type='password' name='password' onChange={handleInputChange} placeholder='Tu contraseña secreta!' />
                </label>
                {error && (
                    <div className='auth-error'>{error}</div>
                )}
                <button className="auth-boton" type='submit'>Crear cuenta</button>
            </form>
            {mensaje && (
                <div className="auth-success">
                    <p>{mensaje}</p>
                    <nav className='login'>
                        <NavLink to="/login">Login</NavLink>
                    </nav>
                </div>
            )}

        </main>
    )
}

export default Registro;