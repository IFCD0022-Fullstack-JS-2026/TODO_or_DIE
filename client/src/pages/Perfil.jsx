import './Auth.css'
import './Perfil.css'

function Perfil() {

    return (
        <main className="auth">
            <h1 className="auth-titulo">Perfil</h1>
            <form className="auth-form">
                <label className="auth-campo">
                    Nombre
                    <input className="auth-input" 
                    type='text' 
                    name='nombre' 
                    placeholder='Escribe aquí tu nombre' 
                    />
                </label>
                <label className="auth-campo">
                    Email
                    <input className="auth-input" 
                    type='email' 
                    name='email' 
                    placeholder='Escribe aquí tu@email.com' 
                   />
                </label>
                
                <button className="auth-boton" type='submit'>Guardar</button>
                <button className="perfil-borrar" type='submit'>Borrar Cuenta</button>

            </form>
        </main>
    )
}

export default Perfil;