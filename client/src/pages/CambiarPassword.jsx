import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import './Auth.css';

function CambiarPassword() {
    const { token } = useAuth();
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [repetir, setRepetir] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (nueva !== repetir) {
            setError('La contraseña nueva y su repetición no coinciden');
            return;
        }

        if (nueva.length < 6) {
            setError('La contraseña nueva debe tener al menos 6 caracteres');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ actual, nueva }),
            });

            const datos = await res.json();

            if (res.ok) {
                setMensaje(datos.message || 'Contraseña actualizada');
                setActual('');
                setNueva('');
                setRepetir('');
            } else {
                if (res.status === 400 && Array.isArray(datos.errors)) {
                    setError(datos.errors.join(', '));
                } else {
                    setError(datos.message || 'Error al cambiar la contraseña');
                }
            }
        } catch (err) {
            setError(err.message || 'Error de conexión con el servidor');
        }
    };

    return (
        <main className="auth">
            <h1 className="auth-titulo">Cambiar contraseña</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-campo">
                    Contraseña actual
                    <input
                        className="auth-input"
                        type="password"
                        name="actual"
                        value={actual}
                        onChange={(e) => setActual(e.target.value)}
                        placeholder="Tu contraseña actual"
                        required
                    />
                </label>

                <label className="auth-campo">
                    Contraseña nueva
                    <input
                        className="auth-input"
                        type="password"
                        name="nueva"
                        value={nueva}
                        onChange={(e) => setNueva(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                </label>

                <label className="auth-campo">
                    Repetir contraseña nueva
                    <input
                        className="auth-input"
                        type="password"
                        name="repetir"
                        value={repetir}
                        onChange={(e) => setRepetir(e.target.value)}
                        placeholder="Repite la nueva contraseña"
                        required
                    />
                </label>

                {error && <div className="auth-error">{error}</div>}
                {mensaje && <div className="auth-success">{mensaje}</div>}

                <button className="auth-boton" type="submit">
                    Cambiar contraseña
                </button>
            </form>
        </main>
    );
}

export default CambiarPassword;