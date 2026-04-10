import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react'

const API = 'http://localhost:8080/clientes'

const formVazio = {
  nome:      '',
  rg:        '',
  cpf:       '',
  endereco:  '',
  profissao: '',
}

const rendimentoVazio = { entidadeEmpregadora: '', valor: '' }

// Tela de auto cadastro — o próprio cliente se registra
export default function CadastroCliente() {
  const navigate = useNavigate()

  const [form, setForm]               = useState(formVazio)
  const [rendimentos, setRendimentos] = useState([{ ...rendimentoVazio }])
  const [erros, setErros]             = useState({})
  const [salvando, setSalvando]       = useState(false)
  const [erroApi, setErroApi]         = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
  }

  const handleRendimentoChange = (index, e) => {
    const { name, value } = e.target
    setRendimentos(prev =>
      prev.map((r, i) => i === index ? { ...r, [name]: value } : r)
    )
  }

  const adicionarRendimento = () => {
    if (rendimentos.length < 3)
      setRendimentos(prev => [...prev, { ...rendimentoVazio }])
  }

  const removerRendimento = (index) => {
    if (rendimentos.length === 1) setRendimentos([{ ...rendimentoVazio }])
    else setRendimentos(prev => prev.filter((_, i) => i !== index))
  }

  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório.'
    if (!form.cpf.trim())  novosErros.cpf  = 'CPF é obrigatório.'
    rendimentos.forEach((r, i) => {
      const temEntidade = r.entidadeEmpregadora.trim() !== ''
      const temValor    = r.valor !== '' && r.valor !== null
      if (temEntidade && !temValor)  novosErros[`rendimento_valor_${i}`]    = 'Informe o valor.'
      if (!temEntidade && temValor)  novosErros[`rendimento_entidade_${i}`] = 'Informe a entidade.'
    })
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSalvar = async () => {
    if (!validar()) return
    setSalvando(true)
    setErroApi('')

    const rendimentosValidos = rendimentos.filter(
      r => r.entidadeEmpregadora.trim() !== '' && r.valor !== ''
    )

    try {
      const response = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, rendimentos: rendimentosValidos }),
      })
      if (!response.ok) throw new Error(`Erro ao cadastrar: ${response.status} ${response.statusText}`)

      // Após cadastro, volta para o login
      navigate('/login')

    } catch (err) {
      setErroApi(err.message || 'Não foi possível conectar ao servidor.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="d-flex justify-content-center py-5 px-3" style={{ background: '#f4f5f9', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Cabeçalho */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => navigate('/login')} disabled={salvando}>
            <ArrowLeft size={14} /> Voltar ao login
          </button>
          <h4 className="mb-0 fw-semibold">Criar conta</h4>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="row g-3">

              <div className="col-12">
                <label className="form-label fw-medium">Nome completo <span className="text-danger">*</span></label>
                <input type="text" name="nome"
                  className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
                  placeholder="Ex: João da Silva" value={form.nome} onChange={handleChange} />
                {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">RG</label>
                <input type="text" name="rg" className="form-control"
                  placeholder="00.000.000-0" value={form.rg} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">CPF <span className="text-danger">*</span></label>
                <input type="text" name="cpf"
                  className={`form-control ${erros.cpf ? 'is-invalid' : ''}`}
                  placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} />
                {erros.cpf && <div className="invalid-feedback">{erros.cpf}</div>}
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Endereço</label>
                <input type="text" name="endereco" className="form-control"
                  placeholder="Ex: Rua Governador Valadares, 123"
                  value={form.endereco} onChange={handleChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Profissão</label>
                <input type="text" name="profissao" className="form-control"
                  placeholder="Ex: Engenheiro, Professor, Autônomo..."
                  value={form.profissao} onChange={handleChange} />
              </div>

              {/* Rendimentos */}
              <div className="col-12 mt-2">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="form-label fw-medium mb-0">
                    Rendimentos
                    <span className="text-muted fw-normal ms-1" style={{ fontSize: 12 }}>(máx. 3)</span>
                  </label>
                  {rendimentos.length < 3 && (
                    <button type="button" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                      onClick={adicionarRendimento}>
                      <Plus size={13} /> Adicionar
                    </button>
                  )}
                </div>
                <div className="d-flex flex-column gap-2">
                  {rendimentos.map((r, index) => (
                    <div key={index} className="border rounded p-3" style={{ background: '#f8f9fc' }}>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted" style={{ fontSize: 12, fontWeight: 500 }}>Rendimento {index + 1}</span>
                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2 d-flex align-items-center"
                          onClick={() => removerRendimento(index)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="row g-2">
                        <div className="col-md-7">
                          <input type="text" name="entidadeEmpregadora"
                            className={`form-control form-control-sm ${erros[`rendimento_entidade_${index}`] ? 'is-invalid' : ''}`}
                            placeholder="Entidade empregadora" value={r.entidadeEmpregadora}
                            onChange={e => handleRendimentoChange(index, e)} />
                          {erros[`rendimento_entidade_${index}`] &&
                            <div className="invalid-feedback">{erros[`rendimento_entidade_${index}`]}</div>}
                        </div>
                        <div className="col-md-5">
                          <input type="number" name="valor"
                            className={`form-control form-control-sm ${erros[`rendimento_valor_${index}`] ? 'is-invalid' : ''}`}
                            placeholder="Valor (R$)" min="0" step="0.01" value={r.valor}
                            onChange={e => handleRendimentoChange(index, e)} />
                          {erros[`rendimento_valor_${index}`] &&
                            <div className="invalid-feedback">{erros[`rendimento_valor_${index}`]}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {erroApi && <div className="alert alert-danger py-2 mt-3 mb-0">{erroApi}</div>}

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button className="btn btn-outline-secondary" onClick={() => navigate('/login')} disabled={salvando}>
                Cancelar
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleSalvar} disabled={salvando}>
                {salvando
                  ? <><span className="spinner-border spinner-border-sm" role="status" /> Salvando...</>
                  : <><Save size={15} /> Criar conta</>}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}