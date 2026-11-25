import { useState } from 'react';
import './Auth.css'

function Recuperar() {

    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("")
        setError("");
        
        try {
            const respuesta = await fetch('http://localhost:3000/api/users/recuperar',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({email}),
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                setError(data.errors?.join(', ') || data.message)
                return
            }
            setMessage(data.message)
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <main className="auth">
            <h1 className="auth-titulo">Recuperar Contraseña</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-campo">
                    Email
                    <input className="auth-input"
                        type='email'
                        name='email'
                        placeholder='tu@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </label>
                <button className="auth-boton" type='submit'>Recuperar</button>
                
                {message && <p className='auth-success'>{message}</p>}
                {error && <p className="auth-error">{error}</p>}
              
            </form>
        </main>
    )
}

export default Recuperar;