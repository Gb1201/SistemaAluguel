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
  // Estado global do usuário logado (null = não autenticado)
  const [usuario, setUsuario] = useState(null)

  const handleLogin  = (user) => setUsuario(user)
  const handleLogout = () => setUsuario(null)

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
            !usuario          ? <Navigate to="/login"   replace /> :
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
