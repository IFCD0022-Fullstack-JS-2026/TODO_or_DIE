import './Perfil.css'

function Perfil() {

    return (
        <main className="perfil">
            <h1 className="perfil-titulo">Mi Perfil</h1>
            <form className="perfil-form">
                <label className="perfil-campo">
                    Nombre
                    <input className="perfil-input" 
                    type='text' 
                    name='nombre' 
                    placeholder='Escribe aquí tu nombre' 
                    />
                </label>
                <label className="perfil-campo">
                    Email
                    <input className="perfil-input" 
                    type='email' 
                    name='email' 
                    placeholder='Escribe aquí tu@email.com' 
                   />
                </label>
                
                <button className="perfil-boton" type='button'>Guardar</button>
                <button className="perfil-borrar" type='button'>Borrar Cuenta</button>

            </form>
        </main>
    )
}

export default Perfil;