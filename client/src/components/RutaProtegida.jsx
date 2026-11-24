import { Navigate } from 'react-router'
import { useAuth } from '../context/useAuth.js'

export default function RutaProtegida({ children }) {
  const { token } = useAuth()

  if (!token) return <Navigate to="/login" replace />

  return children
}