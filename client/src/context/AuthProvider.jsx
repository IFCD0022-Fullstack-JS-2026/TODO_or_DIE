import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext.js"


export function AuthProvider({ children }) {
  
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    if (!token) return

    fetch('http://localhost:3000/api/users/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token no válido')
        return res.json()
      })
      .then(datos => setUsuario(datos))
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
        setUsuario(null)
      })
  }, [token])

  async function login(email, password) {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const datos = await res.json()
    if (!res.ok) throw new Error(datos.errors.join(", "))


    localStorage.setItem('token', datos.data.token)
    setToken(datos.data.token)
    alert(datos.message);
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUsuario(null)
  }

  return <AuthContext value={{ token, usuario, setUsuario, login, logout }}>{children}</AuthContext>
}

