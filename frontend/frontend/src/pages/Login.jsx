import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Car } from 'lucide-react'

export default function Login({ onLogin }) {
  const navigate = useNavigate()

  const [form, setForm]       = useState({ email: '', senha: '' })
  const [erro, setErro]       = useState('')
  const [loading, setLoading] = useState(false)

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

    setLoading(true)
    setErro('')

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email, senha: form.senha }),
      })

      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || 'Email ou senha inválidos.')
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
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">

        {/* LADO ESQUERDO - CARRO */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
             style={{ background: '#4f6ef7' }}>
          
          <div className="text-center text-white">
            <Car size={200} strokeWidth={1.5} />
            <h2 className="mt-3 fw-bold">AlugaFácil</h2>
            <p className="opacity-75">Seu sistema de aluguel de veículos</p>
          </div>

        </div>

        {/* LADO DIREITO - LOGIN */}
        <div className="col-md-6 d-flex align-items-center justify-content-center"
             style={{ background: '#f4f5f9' }}>
          
          <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 420 }}>
            <div className="card-body p-5">

              <div className="text-center mb-4">
                <h4 className="fw-semibold mb-1">Login</h4>
                <p className="text-muted small mb-0">
                  Entre com suas credenciais
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">E-mail</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Senha</label>
                <input
                  type="password"
                  name="senha"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {erro && (
                <div className="alert alert-danger py-2 small mb-3">
                  {erro}
                </div>
              )}

              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading
                  ? <span className="spinner-border spinner-border-sm" />
                  : <LogIn size={16} />}
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div className="text-center mt-3">
                <span className="text-muted small">Não tem conta? </span>
                <button
                  className="btn btn-link btn-sm p-0 small"
                  onClick={() => navigate('/cadastro')}
                >
                  Cadastre-se
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}