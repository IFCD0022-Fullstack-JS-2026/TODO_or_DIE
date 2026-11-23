import { useState } from 'react';
import './Auth.css'

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")


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
       setSuccess("");

        try{
            const respuesta = await fetch("http://localhost:3000/api/users/login", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password})
                })
            
            const data = await respuesta.json();

            if (respuesta.status === 200) {
                setSuccess(`Hola, ${data.data.nombre}`)

             }
            else if (respuesta.status === 400 && Array.isArray(data.errors))
             { setError(data.errors.join(", "));
            } else {
                setError(data.message);
            }
        
        } catch (err) {
            setError(err.message);

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
                    value= {email}
                    onChange={handleChange}/>
                </label>
                <label className="auth-campo">
                    Contraseña
                    <input className="auth-input" 
                    type='password' 
                    name='password' 
                    placeholder='Tu contraseña secreta!' 
                    value={password}
                    onChange={handleChange}/>
                </label>
                <button className="auth-boton" type='submit'>Entrar</button>

                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}
            </form>
        </main>
    )
}

export default Login;