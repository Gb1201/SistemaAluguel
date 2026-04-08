import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, UserPlus, Search, Users } from 'lucide-react'
import { ClientesContext } from '../App'

export default function Dashboard() {
  const navigate = useNavigate()
  const { clientes, setClientes } = useContext(ClientesContext)

  // Estado para o campo de busca
  const [busca, setBusca] = useState('')

  // Filtra clientes em tempo real pelo nome (case insensitive)
  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  )

  // Remove um cliente pelo id, com confirmação do usuário
  const handleDeletar = (id) => {
    const confirmado = window.confirm('Deseja realmente excluir este cliente?')
    if (confirmado) {
      setClientes(prev => prev.filter(c => c.id !== id))
    }
  }

  // Navega para o formulário de edição passando o id na URL
  const handleEditar = (id) => {
    navigate(`/cadastro-cliente/${id}`)
  }

  return (
    <div className="container py-4">

      {/* Cabeçalho da página */}
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

          {/* Tabela de clientes */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: 50 }}>#</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ width: 140 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente, index) => (
                    <tr key={cliente.id}>
                      <td className="text-muted small">{index + 1}</td>
                      <td className="fw-medium">{cliente.nome}</td>
                      <td className="text-muted">{cliente.email}</td>
                      <td className="text-muted">{cliente.telefone}</td>
                      <td>
                        <span className={`badge rounded-pill ${
                          cliente.status === 'Ativo'
                            ? 'text-bg-success'
                            : 'text-bg-secondary'
                        }`}>
                          {cliente.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {/* Botão Editar */}
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            onClick={() => handleEditar(cliente.id)}
                            title="Editar cliente"
                          >
                            <Pencil size={13} />
                            Editar
                          </button>
                          {/* Botão Deletar */}
                          <button
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={() => handleDeletar(cliente.id)}
                            title="Deletar cliente"
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

          {/* Rodapé com total */}
          <div className="text-muted small mt-3">
            {clientesFiltrados.length} cliente(s) encontrado(s)
          </div>

        </div>
      </div>
    </div>
  )
}