import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './Auth.css'
import { useAuth } from '../context/useAuth.js'

function Restablecer() {

    const { token } = useParams();
    const navigate = useNavigate();
    const { restablecer } = useAuth();

    const [nueva, setNueva] = useState("");
    const [repetir, setRepetir] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (nueva !== repetir) {
            setError(["Las contraseñas no coinciden"]);
            return;
        }

        try {
            await restablecer({ token, nueva });
            navigate('/login');
        } catch (err) {
            setError(err.message)
        }
    };

    return (
        <main className="auth">
            <h1 className="auth-titulo">Restablecer Contraseña</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-campo">
                    Nueva contraseña
                    <input className="auth-input"
                        type='password'
                        name='nueva'
                        placeholder='Tu contraseña nueva secreta!'
                        value={nueva}
                        onChange={(e) => setNueva(e.target.value)} />
                </label>
                <label className="auth-campo">
                    Repetir contraseña
                    <input className="auth-input"
                        type='password'
                        name='repetir'
                        placeholder='Repite tu nueva contraseña secreta!'
                        value={repetir}
                        onChange={(e) => setRepetir(e.target.value)} />
                </label>
                <button className="auth-boton" type='submit'>Restablecer</button>
                
                {error && <p className="auth-error">{error}</p>}
              
            </form>
        </main>
    )
}

export default Restablecer;