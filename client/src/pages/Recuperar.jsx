import { useState } from 'react';
import './Auth.css'
import { useAuth } from '../context/useAuth.js'

function Recuperar() {

    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const {recuperar} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("")
        setError("");
        
        try {
            const respuesta = await recuperar(email)
            if (respuesta?.message) {
                setMessage(respuesta.message)
            }
        } catch (err) {
            setError(err.message)
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