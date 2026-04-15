import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import CadastroCliente from './pages/CadastroCliente'
import DashboardCliente from './pages/DashboardCliente'
import DashboardAgente from './pages/DashboardAgente'

function RotaProtegida({ usuario, tipo, children }) {
  if (!usuario) return <Navigate to="/login" replace />
  if (tipo && usuario.tipo !== tipo) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('usuario')
      return salvo ? JSON.parse(salvo) : null
    } catch { return null }
  })

  const handleLogin = (user) => {
    localStorage.setItem('usuario', JSON.stringify(user))
    setUsuario(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* PÚBLICAS (SEM SIDEBAR) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<CadastroCliente />} />

        {/* PRIVADAS (COM SIDEBAR) */}
        <Route element={<Layout usuario={usuario} onLogout={handleLogout} />}>

          <Route path="/cliente" element={
            <RotaProtegida usuario={usuario} tipo="cliente">
              <DashboardCliente usuario={usuario} />
            </RotaProtegida>
          } />

          <Route path="/agente" element={
            <RotaProtegida usuario={usuario} tipo="agente">
              <DashboardAgente usuario={usuario} />
            </RotaProtegida>
          } />

        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
