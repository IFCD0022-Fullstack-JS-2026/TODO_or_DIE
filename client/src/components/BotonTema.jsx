import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tema';

export default function BotonTema() {
    const [tema, setTema] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || 'light';
    });

    useEffect(() => {
        document.documentElement.dataset.tema = tema;
        localStorage.setItem(STORAGE_KEY, tema);
    }, [tema]);

    const alternarTema = () => {
        setTema((prevTema) => (prevTema === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            type="button"
            onClick={alternarTema}
            className="nav-link boton-tema"
            aria-label={tema === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            title={tema === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        >
            {tema === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
    );
}