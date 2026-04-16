import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Car, Eye, EyeOff } from 'lucide-react'

export default function Login({ onLogin }) {
  const navigate = useNavigate()

  const [form, setForm]         = useState({ email: '', senha: '' })
  const [erro, setErro]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erro) setErro('')
  }

  const handleLogin = async () => {
    if (!form.email.trim() || !form.senha.trim()) {
      setErro('Preencha e-mail e senha.')
      return
    }
    setLoading(true); setErro('')
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, senha: form.senha }),
      })
      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || 'E-mail ou senha inválidos.')
      }
      const data = await response.json()
      onLogin({ id: data.id, nome: data.nome, email: data.email, tipo: data.tipo })
      navigate(data.tipo === 'agente' ? '/agente' : '/cliente')
    } catch (err) {
      setErro(err.message || 'Não foi possível conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .lg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Sora', sans-serif;
          background: #06080e;
          overflow: hidden;
        }

        /* ── Left panel ── */
        .lg-left {
          flex: 1;
          background: linear-gradient(160deg, #0a0d14 0%, #0e1220 50%, #0a0d14 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Grid texture */
        .lg-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(232,164,59,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,164,59,0.035) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .lg-left-orb {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(232,164,59,0.1) 0%, transparent 65%);
          pointer-events: none;
          border-radius: 50%;
          animation: pulse 5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.7; transform: translate(-50%, -50%) scale(1.08); }
        }

        .lg-left-content {
          position: relative; z-index: 1;
          text-align: center;
          max-width: 400px;
          padding: 40px;
        }

        .lg-car-icon {
          width: 90px; height: 90px;
          background: linear-gradient(135deg, rgba(232,164,59,0.12), rgba(232,164,59,0.04));
          border: 1px solid rgba(232,164,59,0.25);
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px;
          box-shadow: 0 0 60px rgba(232,164,59,0.15);
        }

        .lg-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 600;
          color: #f0f2f8; line-height: 1.2;
          margin-bottom: 14px; letter-spacing: -0.5px;
        }
        .lg-hero-title em { font-style: italic; color: #e8a43b; }
        .lg-hero-sub {
          font-size: 13.5px; color: #4a5270;
          line-height: 1.7; font-weight: 300;
        }

        .lg-feat-list {
          list-style: none; padding: 0; margin: 32px 0 0;
          display: flex; flex-direction: column; gap: 10px;
          text-align: left;
        }
        .lg-feat-list li {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #8b94b0;
        }
        .lg-feat-dot {
          width: 6px; height: 6px; background: #e8a43b;
          border-radius: 50%; flex-shrink: 0;
        }

        /* ── Right panel ── */
        .lg-right {
          width: 460px;
          background: #06080e;
          border-left: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          padding: 40px;
          position: relative;
        }

        .lg-form-wrap { width: 100%; max-width: 360px; }

        .lg-logo-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 36px;
        }
        .lg-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(232,164,59,0.35);
        }
        .lg-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 600;
          color: #f0f2f8;
        }

        .lg-title {
          font-size: 22px; font-weight: 700;
          color: #f0f2f8; margin-bottom: 6px;
          letter-spacing: -0.3px;
        }
        .lg-subtitle {
          font-size: 13px; color: #4a5270;
          margin-bottom: 32px; font-weight: 300;
        }

        .lg-field { margin-bottom: 18px; }
        .lg-label {
          display: block;
          font-size: 12px; font-weight: 600;
          color: #8b94b0; margin-bottom: 7px;
          text-transform: uppercase; letter-spacing: 0.6px;
        }
        .lg-input-wrap { position: relative; }
        .lg-input {
          width: 100%;
          padding: 12px 16px;
          background: #0d1018;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #f0f2f8;
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .lg-input::placeholder { color: #2e3450; }
        .lg-input:focus {
          border-color: rgba(232,164,59,0.5);
          box-shadow: 0 0 0 3px rgba(232,164,59,0.1);
          background: #0f1420;
        }
        .lg-input-pr { padding-right: 44px !important; }

        .lg-eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: #4a5270; cursor: pointer;
          display: flex; align-items: center;
          transition: color 0.15s;
          padding: 0;
        }
        .lg-eye-btn:hover { color: #8b94b0; }

        .lg-error {
          padding: 11px 14px;
          background: rgba(245,84,106,0.08);
          border: 1px solid rgba(245,84,106,0.25);
          border-radius: 9px;
          font-size: 13px; color: #f9a0af;
          margin-bottom: 18px;
        }

        .lg-submit {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #000; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(232,164,59,0.3);
          transition: all 0.2s;
          letter-spacing: 0.2px;
        }
        .lg-submit:hover:not(:disabled) {
          box-shadow: 0 8px 30px rgba(232,164,59,0.5);
          transform: translateY(-1px);
        }
        .lg-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .lg-signup-row {
          text-align: center; margin-top: 24px;
          font-size: 13px; color: #4a5270;
        }
        .lg-signup-btn {
          background: none; border: none;
          color: #e8a43b; font-size: 13px; font-weight: 600;
          cursor: pointer; padding: 0;
          font-family: 'Sora', sans-serif;
          transition: color 0.15s;
        }
        .lg-signup-btn:hover { color: #f5b84a; text-decoration: underline; }

        .lg-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0;
        }
        .lg-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
        .lg-divider-text { font-size: 11px; color: #2e3450; }

        @media (max-width: 768px) {
          .lg-left { display: none; }
          .lg-right { width: 100%; }
        }
      `}</style>

      <div className="lg-root">
        {/* Left */}
        <div className="lg-left">
          <div className="lg-left-orb" />
          <div className="lg-left-content">
            <div className="lg-car-icon">
              <Car size={44} color="#e8a43b" strokeWidth={1.4} />
            </div>
            <h1 className="lg-hero-title">
              A locadora<br /><em>inteligente</em>
            </h1>
            <p className="lg-hero-sub">
              Gerencie pedidos, clientes e frota com eficiência em uma plataforma unificada.
            </p>
            <ul className="lg-feat-list">
              <li><span className="lg-feat-dot" /> Painel exclusivo para agentes</li>
              <li><span className="lg-feat-dot" /> Solicitação de aluguel em segundos</li>
              <li><span className="lg-feat-dot" /> Aprovação e controle em tempo real</li>
              <li><span className="lg-feat-dot" /> Gerenciamento completo da frota</li>
            </ul>
          </div>
        </div>

        {/* Right */}
        <div className="lg-right">
          <div className="lg-form-wrap">
            <div className="lg-logo-row">
              <div className="lg-logo-icon">
                <Car size={16} color="#000" strokeWidth={2.2} />
              </div>
              <span className="lg-logo-text">AlugaFácil</span>
            </div>

            <h2 className="lg-title">Bem-vindo de volta</h2>
            <p className="lg-subtitle">Entre com suas credenciais para continuar</p>

            <div className="lg-field">
              <label className="lg-label">E-mail</label>
              <input className="lg-input" type="email" name="email"
                placeholder="seu@email.com"
                value={form.email} onChange={handleChange}
                onKeyDown={handleKeyDown} autoFocus />
            </div>

            <div className="lg-field">
              <label className="lg-label">Senha</label>
              <div className="lg-input-wrap">
                <input className="lg-input lg-input-pr"
                  type={showPass ? 'text' : 'password'}
                  name="senha" placeholder="••••••••"
                  value={form.senha} onChange={handleChange}
                  onKeyDown={handleKeyDown} />
                <button className="lg-eye-btn" type="button"
                  onClick={() => setShowPass(p => !p)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {erro && <div className="lg-error">{erro}</div>}

            <button className="lg-submit" onClick={handleLogin} disabled={loading}>
              {loading
                ? <span className="spinner-border spinner-border-sm" style={{ width: 16, height: 16 }} />
                : <LogIn size={15} />}
              {loading ? 'Entrando...' : 'Entrar na plataforma'}
            </button>

            <div className="lg-divider">
              <span className="lg-divider-line" />
              <span className="lg-divider-text">OU</span>
              <span className="lg-divider-line" />
            </div>

            <div className="lg-signup-row">
              Não tem conta?{' '}
              <button className="lg-signup-btn" onClick={() => navigate('/cadastro')}>
                Criar conta grátis →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}