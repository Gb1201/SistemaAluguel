import { useState, useEffect } from 'react'
import {
  CheckCircle, XCircle, PlusCircle,
  ClipboardList, Users, Car, Pencil, Trash2
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend
} from 'recharts'

const API_AUTOMOVEIS = 'http://localhost:8080/automoveis'
const API_PEDIDOS    = 'http://localhost:8080/pedidos'
const API_CLIENTES   = 'http://localhost:8080/clientes/nomes'

const carroVazio = { marca: '', modelo: '', ano: '', placa: '' }

const STATUS_CONFIG = {
  Pendente:  { badge: 'badge-pendente',  label: 'Pendente'  },
  Aprovado:  { badge: 'badge-aprovado',  label: 'Aprovado'  },
  Reprovado: { badge: 'badge-cancelado', label: 'Reprovado' },
}

const CORES_PIZZA = ['#f59e0b', '#22c55e', '#ef4444']

export default function DashboardAgente({ usuario }) {
  const [pedidos, setPedidos]         = useState([])
  const [carros, setCarros]           = useState([])
  const [clientes, setClientes]       = useState([])
  const [processando, setProcessando] = useState(null)

  // Modal carro (cadastro e edição)
  const [modalCarro, setModalCarro]   = useState(false)
  const [formCarro, setFormCarro]     = useState(carroVazio)
  const [editandoId, setEditandoId]   = useState(null) // null = cadastro, número = edição
  const [salvandoCarro, setSalvandoCarro] = useState(false)
  const [erroCarro, setErroCarro]     = useState('')

  //  Loaders 
  const carregarPedidos = async () => {
    try {
      const res  = await fetch(API_PEDIDOS)
      const data = await res.json()
      setPedidos(data.map(p => ({
        id:         p.id,
        cliente:    p.cliente?.nome,
        carro:      `${p.automovel?.marca} ${p.automovel?.modelo}`,
        dataInicio: p.dataInicio,
        dataFim:    p.dataFim,
        status:
          p.status === 'PENDENTE' ? 'Pendente' :
          p.status === 'APROVADO' ? 'Aprovado' : 'Reprovado',
      })))
    } catch { console.error('Erro ao carregar pedidos') }
  }

  const carregarAutomoveis = async () => {
    try {
      const res = await fetch(API_AUTOMOVEIS)
      setCarros(await res.json())
    } catch { console.error('Erro ao carregar automóveis') }
  }

  const carregarClientes = async () => {
    try {
      const res = await fetch(API_CLIENTES)
      setClientes(await res.json())
    } catch { console.error('Erro ao carregar clientes') }
  }

  useEffect(() => {
    carregarPedidos()
    carregarAutomoveis()
    carregarClientes()
  }, [])

  //  Pedidos 
  const atualizarStatus = async (id, status) => {
    setProcessando(id)
    try {
      await fetch(`${API_PEDIDOS}/${id}/status?status=${status}`, { method: 'PUT' })
      await carregarPedidos()
    } catch { alert('Erro ao atualizar pedido.') }
    finally { setProcessando(null) }
  }

  //  Automóvel: abrir modal 
  const abrirModalCadastro = () => {
    setEditandoId(null)
    setFormCarro(carroVazio)
    setErroCarro('')
    setModalCarro(true)
  }

  const abrirModalEdicao = (carro) => {
    setEditandoId(carro.id)
    setFormCarro({ marca: carro.marca, modelo: carro.modelo, ano: carro.ano, placa: carro.placa })
    setErroCarro('')
    setModalCarro(true)
  }

  const fecharModalCarro = () => {
    setModalCarro(false)
    setFormCarro(carroVazio)
    setEditandoId(null)
    setErroCarro('')
  }

  const handleCarroChange = (e) => {
    const { name, value } = e.target
    setFormCarro(prev => ({ ...prev, [name]: value }))
  }

  // POST ou PUT automóvel 
  const handleSalvarCarro = async () => {
    if (!formCarro.marca || !formCarro.modelo || !formCarro.ano || !formCarro.placa) {
      setErroCarro('Preencha todos os campos.'); return
    }
    setSalvandoCarro(true); setErroCarro('')
    try {
      const url    = editandoId ? `${API_AUTOMOVEIS}/${editandoId}` : API_AUTOMOVEIS
      const method = editandoId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formCarro, ano: Number(formCarro.ano) }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `Erro ${res.status}`)
      }
      fecharModalCarro()
      carregarAutomoveis()
    } catch (err) {
      setErroCarro(err.message || 'Não foi possível salvar.')
    } finally { setSalvandoCarro(false) }
  }

  //  DELETE automóvel ─
  const handleDeletarCarro = async (id, placa) => {
    if (!window.confirm(`Deletar o automóvel de placa ${placa}?`)) return

    try {
      const res = await fetch(`${API_AUTOMOVEIS}/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const mensagem = await res.text() 
        throw new Error(mensagem)
      }

      setCarros(prev => prev.filter(c => c.id !== id))
      alert('Automóvel deletado com sucesso')

    } catch (err) {
      alert(err.message || 'Não foi possível deletar o automóvel.')
    }
  }

  //  Dados para gráficos 
  const pendentes  = pedidos.filter(p => p.status === 'Pendente').length
  const aprovados  = pedidos.filter(p => p.status === 'Aprovado').length
  const reprovados = pedidos.filter(p => p.status === 'Reprovado').length

  const dadosPizza = [
    { name: 'Pendentes',  value: pendentes  },
    { name: 'Aprovados',  value: aprovados  },
    { name: 'Reprovados', value: reprovados },
  ]

  const dadosBar = [
    { name: 'Clientes',   valor: clientes.length },
    { name: 'Automóveis', valor: carros.length   },
    { name: 'Pedidos',    valor: pedidos.length  },
  ]

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Agente'
  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <>
      <style>{`
        .da-hero {
          background: linear-gradient(135deg, #1e2540 0%, #0f1117 100%);
          border-radius: 16px;
          padding: 28px 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .da-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(79,110,247,0.3) 0%, transparent 70%);
          border-radius: 50%;
        }
        .da-hero-sub  { font-size: 13px; color: #8b92a8; margin: 0; }
        .da-hero-title{ font-size: 22px; font-weight: 600; color: #fff; margin: 4px 0 0; }
        .da-stat {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 16px;
          min-width: 90px;
        }
        .da-stat-val   { font-size: 20px; font-weight: 600; color: #fff; line-height: 1; }
        .da-stat-label { font-size: 11px; color: #8b92a8; margin-top: 3px; }
        .section-title {
          font-size: 14px; font-weight: 600; color: #1a1d2e;
          display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
        }
        .section-title svg { color: #4f6ef7; }
        .badge-pendente  { background:#fff8e1; color:#b45309; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:500; }
        .badge-aprovado  { background:#e8f5e9; color:#2e7d32; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:500; }
        .badge-cancelado { background:#fce4e4; color:#b91c1c; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:500; }
        .table-hover tbody tr:hover { background: #fafbff; }
        .btn-icon-edit {
          border: 1px solid #c5cffa; background: #eef1ff; color: #4f6ef7;
          border-radius: 7px; padding: 4px 8px; cursor: pointer;
          display:inline-flex; align-items:center; gap:4px; font-size:12px;
          transition: background 0.15s;
        }
        .btn-icon-edit:hover { background: #dce3ff; }
        .btn-icon-del {
          border: 1px solid #fca5a5; background: #fef2f2; color: #ef4444;
          border-radius: 7px; padding: 4px 8px; cursor: pointer;
          display:inline-flex; align-items:center; gap:4px; font-size:12px;
          transition: background 0.15s;
        }
        .btn-icon-del:hover { background: #fee2e2; }
      `}</style>

      <div className="container py-4">

        {/*  Hero */}
        <div className="da-hero">
          <p className="da-hero-sub">{saudacao},</p>
          <h2 className="da-hero-title">{primeiroNome} 👋</h2>
          <div className="d-flex gap-3 mt-3 flex-wrap">
            {[
              { val: pedidos.length,   label: 'Pedidos'    },
              { val: clientes.length,  label: 'Clientes'   },
              { val: carros.length,    label: 'Automóveis' },
              { val: pendentes,        label: 'Pendentes'  },
            ].map(s => (
              <div className="da-stat" key={s.label}>
                <div className="da-stat-val">{s.val}</div>
                <div className="da-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão novo automóvel*/}
        <div className="d-flex justify-content-end mb-4">
          <button className="btn btn-primary d-flex align-items-center gap-2"
            onClick={abrirModalCadastro}>
            <PlusCircle size={15} /> Novo Automóvel
          </button>
        </div>

        {/* Gráficos */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="section-title">Visão geral</div>
            <div className="row g-4">

              {/* Pizza — status dos pedidos */}
              <div className="col-md-6">
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  Status dos pedidos
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={dadosPizza} dataKey="value" cx="50%" cy="50%"
                      outerRadius={80} innerRadius={40} paddingAngle={3}>
                      {dadosPizza.map((_, i) => (
                        <Cell key={i} fill={CORES_PIZZA[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                    <Legend iconType="circle" iconSize={10}
                      formatter={v => <span style={{ fontSize: 12 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Barras — totais gerais */}
              <div className="col-md-6">
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  Totais do sistema
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dadosBar} barSize={36}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f0f4ff' }} />
                    <Bar dataKey="valor" fill="#4f6ef7" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        </div>

        {/* Clientes */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="section-title"><Users size={15} /> Clientes</div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 70 }}>ID</th>
                    <th>Nome</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr><td colSpan={2} className="text-center text-muted py-4">Nenhum cliente.</td></tr>
                  ) : clientes.map(c => (
                    <tr key={c.id}>
                      <td className="text-muted small">#{c.id}</td>
                      <td className="fw-medium">{c.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pedidos  */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="section-title"><ClipboardList size={15} /> Pedidos</div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr><th>Cliente</th><th>Carro</th><th>Período</th><th>Status</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">Nenhum pedido.</td></tr>
                  ) : pedidos.map(p => (
                    <tr key={p.id}>
                      <td className="fw-medium">{p.cliente}</td>
                      <td>{p.carro}</td>
                      <td className="text-muted small">{p.dataInicio} → {p.dataFim}</td>
                      <td><span className={STATUS_CONFIG[p.status]?.badge}>{p.status}</span></td>
                      <td>
                        {p.status === 'Pendente' && (
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                              onClick={() => atualizarStatus(p.id, 'APROVADO')} disabled={processando === p.id}>
                              {processando === p.id
                                ? <span className="spinner-border spinner-border-sm" />
                                : <CheckCircle size={13} />} Aprovar
                            </button>
                            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              onClick={() => atualizarStatus(p.id, 'CANCELADO')} disabled={processando === p.id}>
                              <XCircle size={13} /> Reprovar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/*  Automóveis */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="section-title"><Car size={15} /> Automóveis cadastrados</div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr><th>Marca</th><th>Modelo</th><th>Ano</th><th>Placa</th><th style={{ width: 120 }}>Ações</th></tr>
                </thead>
                <tbody>
                  {carros.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-4">Nenhum automóvel.</td></tr>
                  ) : carros.map(c => (
                    <tr key={c.id}>
                      <td className="fw-medium">{c.marca}</td>
                      <td>{c.modelo}</td>
                      <td className="text-muted">{c.ano}</td>
                      <td><span className="badge text-bg-secondary">{c.placa}</span></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn-icon-edit" onClick={() => abrirModalEdicao(c)} title="Editar">
                            <Pencil size={12} /> Editar
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Cadastro / Edição de Automóvel */}
        {modalCarro && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>
                <div className="modal-header border-0 pt-4 px-4 pb-0">
                  <h5 className="modal-title fw-semibold">
                    {editandoId ? 'Editar Automóvel' : 'Cadastrar Automóvel'}
                  </h5>
                  <button className="btn-close" onClick={fecharModalCarro} />
                </div>
                <div className="modal-body px-4">
                  <div className="row g-3">
                    {[
                      { name: 'marca',  label: 'Marca',  placeholder: 'Ex: Toyota', type: 'text'   },
                      { name: 'modelo', label: 'Modelo', placeholder: 'Ex: Corolla',type: 'text'   },
                      { name: 'ano',    label: 'Ano',    placeholder: 'Ex: 2023',   type: 'number' },
                      { name: 'placa',  label: 'Placa',  placeholder: 'Ex: ABC-1234',type: 'text'  },
                    ].map(f => (
                      <div className="col-md-6" key={f.name}>
                        <label className="form-label fw-medium small">{f.label}</label>
                        <input type={f.type} name={f.name} className="form-control"
                          placeholder={f.placeholder} value={formCarro[f.name]}
                          onChange={handleCarroChange} />
                      </div>
                    ))}
                  </div>
                  {erroCarro && <div className="alert alert-danger py-2 small mt-3 mb-0">{erroCarro}</div>}
                </div>
                <div className="modal-footer border-0 px-4 pb-4 pt-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={fecharModalCarro}>Cancelar</button>
                  <button className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                    onClick={handleSalvarCarro} disabled={salvandoCarro}>
                    {salvandoCarro
                      ? <span className="spinner-border spinner-border-sm" />
                      : <PlusCircle size={13} />}
                    {salvandoCarro ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Cadastrar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}