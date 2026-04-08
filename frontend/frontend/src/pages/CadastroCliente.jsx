import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { ClientesContext } from '../App'

// Estado inicial/vazio do formulário
const formVazio = {
  nome:     '',
  email:    '',
  telefone: '',
  cpf:      '',
  endereco: '',
  status:   'Ativo',
}

export default function CadastroCliente() {
  const navigate = useNavigate()
  const { id } = useParams() // presente quando é edição
  const { clientes, setClientes } = useContext(ClientesContext)

  const [form, setForm] = useState(formVazio)
  const [erros, setErros] = useState({})

  // Se há um id na URL, pré-preenche o formulário para edição
  useEffect(() => {
    if (id) {
      const cliente = clientes.find(c => c.id === Number(id))
      if (cliente) setForm(cliente)
    }
  }, [id, clientes])

  // Atualiza um campo específico do formulário
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Limpa o erro do campo ao editar
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
  }

  // Validação simples dos campos obrigatórios
  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim())  novosErros.nome  = 'Nome é obrigatório.'
    if (!form.email.trim()) novosErros.email = 'Email é obrigatório.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSalvar = () => {
    if (!validar()) return

    if (id) {
      // Modo edição: atualiza o cliente existente
      setClientes(prev =>
        prev.map(c => c.id === Number(id) ? { ...form, id: Number(id) } : c)
      )
    } else {
      // Modo criação: gera novo id e adiciona à lista
      const novoId = clientes.length > 0
        ? Math.max(...clientes.map(c => c.id)) + 1
        : 1
      setClientes(prev => [...prev, { ...form, id: novoId }])
    }

    navigate('/dashboard')
  }

  const modoEdicao = Boolean(id)

  return (
    <div className="container py-4">

      {/* Cabeçalho */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={14} />
          Voltar
        </button>
        <h4 className="mb-0 fw-semibold">
          {modoEdicao ? 'Editar cliente' : 'Cadastrar cliente'}
        </h4>
      </div>

      {/* Card do formulário */}
      <div className="card shadow-sm border-0" style={{ maxWidth: 640 }}>
        <div className="card-body p-4">

          <div className="row g-3">

            {/* Nome */}
            <div className="col-md-6">
              <label className="form-label fw-medium">Nome <span className="text-danger">*</span></label>
              <input
                type="text"
                name="nome"
                className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
                placeholder="Nome completo"
                value={form.nome}
                onChange={handleChange}
              />
              {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
              <input
                type="email"
                name="email"
                className={`form-control ${erros.email ? 'is-invalid' : ''}`}
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={handleChange}
              />
              {erros.email && <div className="invalid-feedback">{erros.email}</div>}
            </div>

            {/* Telefone */}
            <div className="col-md-6">
              <label className="form-label fw-medium">Telefone</label>
              <input
                type="text"
                name="telefone"
                className="form-control"
                placeholder="(11) 99999-0000"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            {/* CPF */}
            <div className="col-md-6">
              <label className="form-label fw-medium">CPF</label>
              <input
                type="text"
                name="cpf"
                className="form-control"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={handleChange}
              />
            </div>

            {/* Endereço */}
            <div className="col-12">
              <label className="form-label fw-medium">Endereço</label>
              <input
                type="text"
                name="endereco"
                className="form-control"
                placeholder="Rua, número, complemento"
                value={form.endereco}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="col-md-6">
              <label className="form-label fw-medium">Status</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

          </div>

          {/* Ações do formulário */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleSalvar}
            >
              <Save size={15} />
              {modoEdicao ? 'Salvar alterações' : 'Cadastrar cliente'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}