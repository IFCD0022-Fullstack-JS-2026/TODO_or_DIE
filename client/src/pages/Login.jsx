import './Auth.css'

function Login() {
    return (
        <main className="auth">
            <h1 className="auth-titulo">Login</h1>
            <form className="auth-form">
                <label className="auth-campo">
                    Email
                    <input className="auth-input" type='email' name='email' placeholder='tu@email.com' />
                </label>
                <label className="auth-campo">
                    Contraseña
                    <input className="auth-input" type='password' name='password' placeholder='Tu contraseña secreta!' />
                </label>
                <button className="auth-boton" type='submit'>Entrar</button>
            </form>
        </main>
    )
}

export default Login;