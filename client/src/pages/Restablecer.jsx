import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './Auth.css'

function Restablecer() {

    const { token } = useParams();
    const navigate = useNavigate();

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
            const respuesta = await fetch('http://localhost:3000/api/users/restablecer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, nueva })
            });
            const data = await respuesta.json();
            if (!respuesta.ok) {
                setError(data.errors?.join(', ') || data.message)
                return;
            }
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