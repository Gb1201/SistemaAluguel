import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import Layout           from './components/Layout'
import Login            from './pages/Login'
import CadastroCliente  from './pages/CadastroCliente'
import DashboardCliente from './pages/DashboardCliente'
import DashboardAgente  from './pages/DashboardAgente'

// Rota protegida — redireciona para login se não autenticado
function RotaProtegida({ usuario, tipo, children }) {
  if (!usuario) return <Navigate to="/login" replace />
  if (tipo && usuario.tipo !== tipo) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  // Inicializa lendo do localStorage — persiste ao recarregar a página
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('usuario')
      return salvo ? JSON.parse(salvo) : null
    } catch {
      return null
    }
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
      <Layout usuario={usuario} onLogout={handleLogout}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login"    element={<Login onLogin={handleLogin} />} />
          <Route path="/cadastro" element={<CadastroCliente />} />

          {/* Rota do cliente */}
          <Route path="/cliente" element={
            <RotaProtegida usuario={usuario} tipo="cliente">
              <DashboardCliente usuario={usuario} />
            </RotaProtegida>
          } />

          {/* Rota do agente */}
          <Route path="/agente" element={
            <RotaProtegida usuario={usuario} tipo="agente">
              <DashboardAgente usuario={usuario} />
            </RotaProtegida>
          } />

          {/* Redireciona raiz conforme perfil */}
          <Route path="/" element={
            !usuario                  ? <Navigate to="/login"   replace /> :
            usuario.tipo === 'agente' ? <Navigate to="/agente"  replace /> :
                                        <Navigate to="/cliente" replace />
          } />

          {/* Qualquer rota desconhecida → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
