import './Auth.css'

function Registro() {
    return (
        <main className="auth">
            <h1 className="auth-titulo">Registro</h1>
            <form className="auth-form">
                <label className="auth-campo">
                    Nombre
                    <input className="auth-input" type='text' name='nombre' placeholder='Tu nombre' />
                </label>
                <label className="auth-campo">
                    Email
                    <input className="auth-input" type='email' name='email' placeholder='tu@email.com' />
                </label>
                <label className="auth-campo">
                    Contraseña
                    <input className="auth-input" type='password' name='password' placeholder='Tu contraseña secreta!' />
                </label>
                <button className="auth-boton" type='submit'>Crear cuenta</button>
            </form>
        </main>
    )
}

export default Registro;