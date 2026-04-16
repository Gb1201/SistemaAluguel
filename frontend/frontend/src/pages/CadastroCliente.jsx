import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Plus, Trash2, Car, DollarSign } from 'lucide-react'

const API = 'http://localhost:8080/clientes'
const formVazio = { nome: '', email: '', senha: '', rg: '', cpf: '', endereco: '', profissao: '' }
const rendimentoVazio = { entidadeEmpregadora: '', valor: '' }

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
    setRendimentos(prev => prev.map((r, i) => i === index ? { ...r, [name]: value } : r))
  }

  const adicionarRendimento = () => {
    if (rendimentos.length < 3) setRendimentos(prev => [...prev, { ...rendimentoVazio }])
  }

  const removerRendimento = (index) => {
    if (rendimentos.length === 1) setRendimentos([{ ...rendimentoVazio }])
    else setRendimentos(prev => prev.filter((_, i) => i !== index))
  }

  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim())  novosErros.nome  = 'Nome é obrigatório.'
    if (!form.email.trim()) novosErros.email = 'E-mail é obrigatório.'
    if (!form.senha.trim()) novosErros.senha = 'Senha é obrigatória.'
    if (form.senha.length > 0 && form.senha.length < 6)
      novosErros.senha = 'Mínimo 6 caracteres.'
    if (!form.cpf.trim()) novosErros.cpf = 'CPF é obrigatório.'
    rendimentos.forEach((r, i) => {
      const temE = r.entidadeEmpregadora.trim() !== ''
      const temV = r.valor !== '' && r.valor !== null
      if (temE && !temV)  novosErros[`rendimento_valor_${i}`]    = 'Informe o valor.'
      if (!temE && temV)  novosErros[`rendimento_entidade_${i}`] = 'Informe a entidade.'
    })
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSalvar = async () => {
    if (!validar()) return
    setSalvando(true); setErroApi('')
    const rendimentosValidos = rendimentos.filter(
      r => r.entidadeEmpregadora.trim() !== '' && r.valor !== ''
    )
    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rendimentos: rendimentosValidos }),
      })
      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || `Erro ${response.status}`)
      }
      navigate('/login')
    } catch (err) {
      setErroApi(err.message || 'Não foi possível conectar ao servidor.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .cc-root {
          min-height: 100vh;
          background: #06080e;
          font-family: 'Sora', sans-serif;
          color: #f0f2f8;
          padding: 48px 24px;
          -webkit-font-smoothing: antialiased;
        }

        .cc-wrap { max-width: 680px; margin: 0 auto; }

        .cc-top {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 36px;
        }
        .cc-back-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          color: #8b94b0; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'Sora', sans-serif;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .cc-back-btn:hover {
          background: rgba(232,164,59,0.06);
          border-color: rgba(232,164,59,0.2);
          color: #e8a43b;
        }
        .cc-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #f0f2f8; letter-spacing: -0.3px;
        }

        .cc-card {
          background: #0d1018;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 40px rgba(0,0,0,0.4);
        }

        .cc-section-header {
          padding: 22px 28px 0;
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px;
        }
        .cc-section-icon {
          width: 30px; height: 30px;
          background: rgba(232,164,59,0.1);
          border: 1px solid rgba(232,164,59,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #e8a43b;
        }
        .cc-section-title {
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: #4a5270;
        }

        .cc-body { padding: 0 28px 28px; }

        .cc-grid { display: grid; gap: 16px; }
        .cc-grid-2 { grid-template-columns: 1fr 1fr; }
        .cc-grid-1 { grid-template-columns: 1fr; }

        .cc-field {}
        .cc-label {
          display: block;
          font-size: 11.5px; font-weight: 600;
          color: #8b94b0; margin-bottom: 7px;
          text-transform: uppercase; letter-spacing: 0.7px;
        }
        .cc-label-req { color: #e8a43b; margin-left: 3px; }

        .cc-input {
          width: 100%; padding: 11px 14px;
          background: #111520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px;
          color: #f0f2f8;
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .cc-input::placeholder { color: #2e3450; }
        .cc-input:focus {
          border-color: rgba(232,164,59,0.45);
          box-shadow: 0 0 0 3px rgba(232,164,59,0.08);
          background: #131826;
        }
        .cc-input-error { border-color: rgba(245,84,106,0.5) !important; }
        .cc-err-msg { font-size: 11.5px; color: #f9a0af; margin-top: 5px; }

        /* ── Divider ── */
        .cc-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 24px 0;
        }

        /* ── Rendimentos ── */
        .cc-rend-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .cc-rend-label {
          display: flex; align-items: center; gap: 8px;
        }
        .cc-rend-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #4a5270; }
        .cc-rend-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #e8a43b;
          background: rgba(232,164,59,0.1);
          border: 1px solid rgba(232,164,59,0.2);
          padding: 1px 7px; border-radius: 20px;
        }
        .cc-add-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: rgba(232,164,59,0.08);
          border: 1px solid rgba(232,164,59,0.2);
          border-radius: 8px;
          color: #e8a43b; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: 'Sora', sans-serif;
          transition: all 0.15s;
        }
        .cc-add-btn:hover {
          background: rgba(232,164,59,0.14);
          border-color: rgba(232,164,59,0.35);
        }

        .cc-rend-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 10px;
          position: relative;
        }
        .cc-rend-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .cc-rend-card-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; color: #4a5270; font-weight: 500;
          letter-spacing: 0.5px;
        }
        .cc-del-btn {
          display: flex; align-items: center;
          background: rgba(245,84,106,0.08);
          border: 1px solid rgba(245,84,106,0.2);
          border-radius: 7px;
          color: #f5546a; padding: 4px 8px;
          cursor: pointer; transition: all 0.15s;
        }
        .cc-del-btn:hover {
          background: rgba(245,84,106,0.14);
          border-color: rgba(245,84,106,0.4);
        }

        /* ── Error banner ── */
        .cc-api-error {
          margin: 0 28px 20px;
          padding: 12px 16px;
          background: rgba(245,84,106,0.08);
          border: 1px solid rgba(245,84,106,0.25);
          border-radius: 10px;
          font-size: 13px; color: #f9a0af;
        }

        /* ── Footer ── */
        .cc-footer {
          padding: 20px 28px 28px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }

        .cc-cancel-btn {
          padding: 11px 22px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          color: #8b94b0; font-size: 13.5px; font-weight: 500;
          cursor: pointer; font-family: 'Sora', sans-serif;
          transition: all 0.15s;
        }
        .cc-cancel-btn:hover {
          background: rgba(255,255,255,0.04);
          color: #f0f2f8;
        }

        .cc-submit-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 28px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border: none; border-radius: 9px;
          color: #000; font-size: 13.5px; font-weight: 700;
          cursor: pointer; font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 18px rgba(232,164,59,0.28);
          transition: all 0.2s;
          letter-spacing: 0.2px;
        }
        .cc-submit-btn:hover:not(:disabled) {
          box-shadow: 0 8px 28px rgba(232,164,59,0.45);
          transform: translateY(-1px);
        }
        .cc-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 600px) {
          .cc-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cc-root">
        <div className="cc-wrap">
          {/* Top nav */}
          <div className="cc-top">
            <button className="cc-back-btn" onClick={() => navigate('/login')} disabled={salvando}>
              <ArrowLeft size={14} /> Voltar
            </button>
            <h1 className="cc-page-title">Criar conta</h1>
          </div>

          <div className="cc-card">
            {/* Section: Dados pessoais */}
            <div className="cc-section-header">
              <div className="cc-section-icon"><Car size={14} /></div>
              <span className="cc-section-title">Dados pessoais</span>
            </div>

            <div className="cc-body">
              <div className="cc-grid cc-grid-1" style={{ marginBottom: 16 }}>
                <div className="cc-field">
                  <label className="cc-label">Nome completo<span className="cc-label-req">*</span></label>
                  <input className={`cc-input ${erros.nome ? 'cc-input-error' : ''}`}
                    type="text" name="nome" placeholder="Ex: João da Silva"
                    value={form.nome} onChange={handleChange} />
                  {erros.nome && <p className="cc-err-msg">{erros.nome}</p>}
                </div>
              </div>

              <div className="cc-grid cc-grid-2" style={{ marginBottom: 16 }}>
                <div className="cc-field">
                  <label className="cc-label">E-mail<span className="cc-label-req">*</span></label>
                  <input className={`cc-input ${erros.email ? 'cc-input-error' : ''}`}
                    type="email" name="email" placeholder="seu@email.com"
                    value={form.email} onChange={handleChange} />
                  {erros.email && <p className="cc-err-msg">{erros.email}</p>}
                </div>
                <div className="cc-field">
                  <label className="cc-label">Senha<span className="cc-label-req">*</span></label>
                  <input className={`cc-input ${erros.senha ? 'cc-input-error' : ''}`}
                    type="password" name="senha" placeholder="Mínimo 6 caracteres"
                    value={form.senha} onChange={handleChange} />
                  {erros.senha && <p className="cc-err-msg">{erros.senha}</p>}
                </div>
              </div>

              <div className="cc-grid cc-grid-2" style={{ marginBottom: 16 }}>
                <div className="cc-field">
                  <label className="cc-label">RG</label>
                  <input className="cc-input" type="text" name="rg"
                    placeholder="00.000.000-0" value={form.rg} onChange={handleChange} />
                </div>
                <div className="cc-field">
                  <label className="cc-label">CPF<span className="cc-label-req">*</span></label>
                  <input className={`cc-input ${erros.cpf ? 'cc-input-error' : ''}`}
                    type="text" name="cpf" placeholder="000.000.000-00"
                    value={form.cpf} onChange={handleChange} />
                  {erros.cpf && <p className="cc-err-msg">{erros.cpf}</p>}
                </div>
              </div>

              <div className="cc-grid cc-grid-1" style={{ marginBottom: 16 }}>
                <div className="cc-field">
                  <label className="cc-label">Endereço</label>
                  <input className="cc-input" type="text" name="endereco"
                    placeholder="Ex: Rua Governador Valadares, 123"
                    value={form.endereco} onChange={handleChange} />
                </div>
              </div>

              <div className="cc-grid cc-grid-1">
                <div className="cc-field">
                  <label className="cc-label">Profissão</label>
                  <input className="cc-input" type="text" name="profissao"
                    placeholder="Ex: Engenheiro, Professor, Autônomo..."
                    value={form.profissao} onChange={handleChange} />
                </div>
              </div>

              {/* Divider */}
              <div className="cc-divider" />

              {/* Rendimentos */}
              <div className="cc-rend-header">
                <div className="cc-rend-label">
                  <div className="cc-section-icon" style={{ width: 28, height: 28 }}>
                    <DollarSign size={13} />
                  </div>
                  <span className="cc-rend-title">Rendimentos</span>
                  <span className="cc-rend-count">{rendimentos.length}/3</span>
                </div>
                {rendimentos.length < 3 && (
                  <button className="cc-add-btn" onClick={adicionarRendimento}>
                    <Plus size={12} /> Adicionar
                  </button>
                )}
              </div>

              {rendimentos.map((r, index) => (
                <div key={index} className="cc-rend-card">
                  <div className="cc-rend-card-header">
                    <span className="cc-rend-card-title">RENDIMENTO 0{index + 1}</span>
                    <button className="cc-del-btn" onClick={() => removerRendimento(index)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="cc-grid cc-grid-2">
                    <div className="cc-field">
                      <input
                        className={`cc-input ${erros[`rendimento_entidade_${index}`] ? 'cc-input-error' : ''}`}
                        type="text" name="entidadeEmpregadora"
                        placeholder="Entidade empregadora"
                        value={r.entidadeEmpregadora}
                        onChange={e => handleRendimentoChange(index, e)} />
                      {erros[`rendimento_entidade_${index}`] &&
                        <p className="cc-err-msg">{erros[`rendimento_entidade_${index}`]}</p>}
                    </div>
                    <div className="cc-field">
                      <input
                        className={`cc-input ${erros[`rendimento_valor_${index}`] ? 'cc-input-error' : ''}`}
                        type="number" name="valor" placeholder="Valor (R$)"
                        min="0" step="0.01" value={r.valor}
                        onChange={e => handleRendimentoChange(index, e)} />
                      {erros[`rendimento_valor_${index}`] &&
                        <p className="cc-err-msg">{erros[`rendimento_valor_${index}`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {erroApi && <div className="cc-api-error">{erroApi}</div>}

            <div className="cc-footer">
              <button className="cc-cancel-btn" onClick={() => navigate('/login')} disabled={salvando}>
                Cancelar
              </button>
              <button className="cc-submit-btn" onClick={handleSalvar} disabled={salvando}>
                {salvando
                  ? <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} />
                  : <Save size={14} />}
                {salvando ? 'Salvando...' : 'Criar conta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}