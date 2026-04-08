import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'

const API = 'http://localhost:8080/clientes'

const formVazio = {
  nome:      '',
  rg:        '',
  cpf:       '',
  endereco:  '',
  profissao: '',
}

export default function CadastroCliente() {
  const navigate = useNavigate()
  const { id }   = useParams()

  const [form, setForm]         = useState(formVazio)
  const [erros, setErros]       = useState({})
  const [salvando, setSalvando] = useState(false)
  const [erroApi, setErroApi]   = useState('')

  // ── GET /clientes/{id} — pré-preenche o formulário ao editar ─────
  useEffect(() => {
    if (!id) return

    const carregarCliente = async () => {
      try {
        const response = await fetch(`${API}/${id}`)
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`)
        const data = await response.json()
        setForm(data)
      } catch (err) {
        setErroApi(err.message || 'Não foi possível carregar os dados do cliente.')
      }
    }

    carregarCliente()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório.'
    if (!form.cpf.trim())  novosErros.cpf  = 'CPF é obrigatório.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSalvar = async () => {
    if (!validar()) return

    setSalvando(true)
    setErroApi('')

    try {
      if (id) {
        // ── PUT /clientes/{id} ──────────────────────────────────────
        const response = await fetch(`${API}/${id}`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        })
        if (!response.ok) throw new Error(`Erro ao atualizar: ${response.status} ${response.statusText}`)

      } else {
        // ── POST /clientes ──────────────────────────────────────────
        const response = await fetch(API, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        })
        if (!response.ok) throw new Error(`Erro ao cadastrar: ${response.status} ${response.statusText}`)
      }

      navigate('/dashboard')

    } catch (err) {
      setErroApi(err.message || 'Não foi possível conectar ao servidor.')
    } finally {
      setSalvando(false)
    }
  }

  const modoEdicao = Boolean(id)

  return (
    <div className="container py-4">

      {/* Cabeçalho */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate('/dashboard')}
          disabled={salvando}
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
            <div className="col-12">
              <label className="form-label fw-medium">
                Nome completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="nome"
                className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
                placeholder="Ex: João da Silva"
                value={form.nome}
                onChange={handleChange}
              />
              {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
            </div>

            {/* RG e CPF */}
            <div className="col-md-6">
              <label className="form-label fw-medium">RG</label>
              <input
                type="text"
                name="rg"
                className="form-control"
                placeholder="00.000.000-0"
                value={form.rg}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">
                CPF <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="cpf"
                className={`form-control ${erros.cpf ? 'is-invalid' : ''}`}
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={handleChange}
              />
              {erros.cpf && <div className="invalid-feedback">{erros.cpf}</div>}
            </div>

            {/* Endereço */}
            <div className="col-12">
              <label className="form-label fw-medium">Endereço</label>
              <input
                type="text"
                name="endereco"
                className="form-control"
                placeholder="Ex: Rua Governador Valadares, 123"
                value={form.endereco}
                onChange={handleChange}
              />
            </div>

            {/* Profissão */}
            <div className="col-12">
              <label className="form-label fw-medium">Profissão</label>
              <input
                type="text"
                name="profissao"
                className="form-control"
                placeholder="Ex: Engenheiro, Professor, Autônomo..."
                value={form.profissao}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Erro da API */}
          {erroApi && (
            <div className="alert alert-danger py-2 mt-3 mb-0" role="alert">
              {erroApi}
            </div>
          )}

          {/* Ações */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={15} />
                  {modoEdicao ? 'Salvar alterações' : 'Cadastrar cliente'}
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}