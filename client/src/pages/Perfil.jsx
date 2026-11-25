import { useState } from 'react';
import './Perfil.css'
import { useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth'

function FormPerfil({ usuario, setUsuario, token, logout }) {
    const [nombre, setNombre] = useState(usuario.nombre);
    const [email, setEmail] = useState(usuario.email);

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const navigate = useNavigate();

    const handleGuardar = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        try{
            const actualizar = await fetch("http://localhost:3000/api/users/perfil", {
                method: "PUT",
                headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                body: JSON.stringify({ nombre, email }),
            })

            const datos = await actualizar.json();

            if (actualizar.status === 200) {
                setUsuario(datos.data)
                setMensaje("Perfil actualizado")
            }
            else if ((actualizar.status === 400 || actualizar.status === 409) && Array.isArray(datos.errors)) {
                setMensaje(datos.errors.join(", "));
            } else {
                setError(datos.message || "Error Servidor");
            }
                
        } catch {
            setError("Error Servidor")
        }
    }

    const handleBorrar = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        if (window.confirm("¿Quieres eliminar esta cuenta?")) {
            try{
            const borrar = await fetch("http://localhost:3000/api/users/perfil", {
                method: "DELETE",
                headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
            })

            const datos = await borrar.json();

            if (borrar.status === 200) {
                logout()
                navigate("/login", { replace: true})
            }
            else if ((borrar.status === 400 || borrar.status === 409) && Array.isArray(datos.errors)) {
                setMensaje(datos.errors.join(", "));
            } else {
                setError(datos.message || "Error Servidor");
            }
                
        } catch {
            setError("Error Servidor")
        }
        }

    };

    return (
        <main className="perfil">
            <h1 className="perfil-titulo">Mi Perfil</h1>
            <form className="perfil-form" onSubmit={handleGuardar}>
                <label className="perfil-campo">
                    Nombre
                    <input className="perfil-input" 
                    type='text'
                    value={nombre} 
                    name='nombre' 
                    placeholder='Escribe aquí tu nombre'
                    onChange={(e) => setNombre(e.target.value)} 
                    />
                </label>

                <label className="perfil-campo">
                    Email
                    <input className="perfil-input" 
                    type='email'
                    value={email} 
                    name='email' 
                    placeholder='Escribe aquí tu@email.com'
                    onChange={(e) => setEmail(e.target.value)}
                   />
                </label>
                {mensaje && <p className="perfil-exito">{mensaje}</p>}
                {error && <p className="perfil-error">{error}</p>}
                
                <button className="perfil-boton" type='submit'>Guardar</button>
                <button className="perfil-borrar" type='button' onClick={handleBorrar}>Borrar Cuenta</button>

            </form>
        </main>
    )
}

function Perfil() {
    const { usuario, setUsuario, token, logout } = useAuth();
    if (!usuario) return <p>Cargando...</p>;

    return (
        <main className="perfil">
            <h1 className="perfil-titulo">Mi Perfil</h1>
            <FormPerfil usuario={usuario}
             setUsuario={setUsuario}
             token={token}
             logout={logout} />
             
        
        </main>
    )
}

export default Perfil;