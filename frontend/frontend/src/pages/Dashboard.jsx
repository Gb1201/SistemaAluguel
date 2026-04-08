import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, UserPlus, Search, Users } from 'lucide-react'

const API = 'http://localhost:8080/clientes'

export default function Dashboard() {
  const navigate = useNavigate()

  const [clientes, setClientes]   = useState([])
  const [busca, setBusca]         = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro]           = useState('')

  // ── GET /clientes/nomes ──────────────────────────────────────────
  const carregarClientes = async () => {
    setCarregando(true)
    setErro('')
    try {
      const response = await fetch(`${API}/nomes`)
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`)
      const data = await response.json()
      setClientes(data)
    } catch (err) {
      setErro(err.message || 'Não foi possível carregar os clientes.')
    } finally {
      setCarregando(false)
    }
  }

  // Carrega ao montar o componente
  useEffect(() => {
    carregarClientes()
  }, [])

  // ── DELETE /clientes/{id} ────────────────────────────────────────
  const handleDeletar = async (id) => {
    const confirmado = window.confirm('Deseja realmente excluir este cliente?')
    if (!confirmado) return

    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(`Erro ao deletar: ${response.status}`)
      // Atualiza a lista removendo o cliente sem precisar recarregar tudo
      setClientes(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(err.message || 'Não foi possível excluir o cliente.')
    }
  }

  const handleEditar = (id) => {
    navigate(`/cadastro-cliente/${id}`)
  }

  // Filtra pelo nome em tempo real
  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="container py-4">

      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold">
          <Users size={20} className="me-2 text-primary" />
          Clientes
        </h4>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => navigate('/cadastro-cliente')}
        >
          <UserPlus size={16} />
          Cadastrar cliente
        </button>
      </div>

      {/* Card principal */}
      <div className="card shadow-sm border-0">
        <div className="card-body">

          {/* Campo de busca */}
          <div className="input-group mb-3" style={{ maxWidth: 360 }}>
            <span className="input-group-text bg-white border-end-0">
              <Search size={15} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>

          {/* Estado: carregando */}
          {carregando && (
            <div className="text-center py-5 text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status" />
              Carregando clientes...
            </div>
          )}

          {/* Estado: erro de conexão */}
          {!carregando && erro && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{erro}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={carregarClientes}>
                Tentar novamente
              </button>
            </div>
          )}

          {/* Tabela */}
          {!carregando && !erro && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th>Nome</th>
                    <th style={{ width: 160 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  ) : (
                    clientesFiltrados.map((cliente, index) => (
                      <tr key={cliente.id}>
                        <td className="text-muted small">{index + 1}</td>
                        <td className="fw-medium">{cliente.nome}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                              onClick={() => handleEditar(cliente.id)}
                            >
                              <Pencil size={13} />
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              onClick={() => handleDeletar(cliente.id)}
                            >
                              <Trash2 size={13} />
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Rodapé */}
          {!carregando && !erro && (
            <div className="text-muted small mt-3">
              {clientesFiltrados.length} cliente(s) encontrado(s)
            </div>
          )}

        </div>
      </div>
    </div>
  )
}