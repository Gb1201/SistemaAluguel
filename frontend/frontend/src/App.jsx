import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext } from 'react'
import Dashboard from './pages/Dashboard'
import CadastroCliente from './pages/CadastroCliente'
import Layout from './components/Layout'

// Dados mockados iniciais
const clientesIniciais = [
  { id: 1, nome: 'Ana Souza',      email: 'ana@email.com',      telefone: '(11) 91111-1111', status: 'Ativo'   },
  { id: 2, nome: 'Carlos Lima',    email: 'carlos@email.com',   telefone: '(21) 92222-2222', status: 'Ativo'   },
  { id: 3, nome: 'Fernanda Rocha', email: 'fernanda@email.com', telefone: '(31) 93333-3333', status: 'Inativo' },
]

export const ClientesContext = createContext()

export default function App() {
  const [clientes, setClientes] = useState(clientesIniciais)

  return (
    <ClientesContext.Provider value={{ clientes, setClientes }}>
      <BrowserRouter>
        {/* Layout envolve todas as rotas — sidebar e topbar aparecem em todas as páginas */}
        <Layout>
          <Routes>
            <Route path="/"                       element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"              element={<Dashboard />} />
            <Route path="/cadastro-cliente"       element={<CadastroCliente />} />
            <Route path="/cadastro-cliente/:id"   element={<CadastroCliente />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ClientesContext.Provider>
  )
}
