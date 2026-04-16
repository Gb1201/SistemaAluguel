import { useState, useEffect } from 'react'
import {
  CheckCircle, XCircle, PlusCircle,
  ClipboardList, Users, Car, Pencil, Trash2,
  TrendingUp, Activity
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
  Pendente:  { label: 'Pendente',  bg: 'rgba(232,164,59,0.1)',   color: '#e8a43b', dot: '#e8a43b'   },
  Aprovado:  { label: 'Aprovado',  bg: 'rgba(45,212,160,0.1)',   color: '#2dd4a0', dot: '#2dd4a0'   },
  Reprovado: { label: 'Reprovado', bg: 'rgba(245,84,106,0.1)',   color: '#f5546a', dot: '#f5546a'   },
}

const CORES_PIZZA = ['#e8a43b', '#2dd4a0', '#f5546a']

export default function DashboardAgente({ usuario }) {
  const [pedidos, setPedidos]             = useState([])
  const [carros, setCarros]               = useState([])
  const [clientes, setClientes]           = useState([])
  const [processando, setProcessando]     = useState(null)
  const [modalCarro, setModalCarro]       = useState(false)
  const [formCarro, setFormCarro]         = useState(carroVazio)
  const [editandoId, setEditandoId]       = useState(null)
  const [salvandoCarro, setSalvandoCarro] = useState(false)
  const [erroCarro, setErroCarro]         = useState('')

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
    carregarPedidos(); carregarAutomoveis(); carregarClientes()
  }, [])

  const atualizarStatus = async (id, status) => {
    setProcessando(id)
    try {
      await fetch(`${API_PEDIDOS}/${id}/status?status=${status}`, { method: 'PUT' })
      await carregarPedidos()
    } catch { alert('Erro ao atualizar pedido.') }
    finally { setProcessando(null) }
  }

  const abrirModalCadastro = () => {
    setEditandoId(null); setFormCarro(carroVazio); setErroCarro(''); setModalCarro(true)
  }

  const abrirModalEdicao = (carro) => {
    setEditandoId(carro.id)
    setFormCarro({ marca: carro.marca, modelo: carro.modelo, ano: carro.ano, placa: carro.placa })
    setErroCarro(''); setModalCarro(true)
  }

  const fecharModalCarro = () => {
    setModalCarro(false); setFormCarro(carroVazio); setEditandoId(null); setErroCarro('')
  }

  const handleCarroChange = (e) => {
    const { name, value } = e.target
    setFormCarro(prev => ({ ...prev, [name]: value }))
  }

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
      if (!res.ok) throw new Error(await res.text() || `Erro ${res.status}`)
      fecharModalCarro(); carregarAutomoveis()
    } catch (err) {
      setErroCarro(err.message || 'Não foi possível salvar.')
    } finally { setSalvandoCarro(false) }
  }

  const handleDeletarCarro = async (id, placa) => {
    if (!window.confirm(`Deletar o automóvel de placa ${placa}?`)) return
    try {
      const res = await fetch(`${API_AUTOMOVEIS}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      setCarros(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(err.message || 'Não foi possível deletar.')
    }
  }

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

  const statCards = [
    { val: pedidos.length,  label: 'Pedidos',    icon: <ClipboardList size={14} />, color: '#5b8ef7' },
    { val: clientes.length, label: 'Clientes',   icon: <Users size={14} />,         color: '#2dd4a0' },
    { val: carros.length,   label: 'Automóveis', icon: <Car size={14} />,           color: '#e8a43b' },
    { val: pendentes,       label: 'Pendentes',  icon: <Activity size={14} />,      color: '#f5546a' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .da-wrap { font-family: 'Sora', sans-serif; -webkit-font-smoothing: antialiased; }

        /* ── Hero ── */
        .da-hero {
          background: linear-gradient(135deg, #0d1018 0%, #111520 60%, #0a0e16 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .da-hero-orb1 {
          position: absolute; top: -60px; right: -30px;
          width: 280px; height: 220px;
          background: radial-gradient(ellipse, rgba(232,164,59,0.12) 0%, transparent 70%);
          pointer-events: none; border-radius: 50%;
        }
        .da-hero-orb2 {
          position: absolute; bottom: -40px; left: 40%;
          width: 200px; height: 150px;
          background: radial-gradient(ellipse, rgba(91,142,247,0.08) 0%, transparent 70%);
          pointer-events: none; border-radius: 50%;
        }
        .da-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(232,164,59,0.08);
          border: 1px solid rgba(232,164,59,0.2);
          color: #e8a43b; font-size: 10.5px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px; margin-bottom: 10px;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .da-hero-sub  { font-size: 12.5px; color: #4a5270; margin: 0; }
        .da-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #f0f2f8; margin: 4px 0 24px;
          letter-spacing: -0.3px;
        }

        .da-stats { display: flex; gap: 14px; flex-wrap: wrap; }
        .da-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 12px 18px;
          min-width: 100px;
          display: flex; align-items: center; gap: 12px;
          transition: border-color 0.2s;
        }
        .da-stat:hover { border-color: rgba(255,255,255,0.12); }
        .da-stat-icon {
          width: 28px; height: 28px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }
        .da-stat-val   { font-size: 20px; font-weight: 700; color: #f0f2f8; line-height: 1; }
        .da-stat-label { font-size: 10.5px; color: #4a5270; margin-top: 2px; letter-spacing: 0.3px; }

        /* ── Sections ── */
        .da-section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 18px;
        }
        .da-section-icon {
          width: 30px; height: 30px;
          background: rgba(232,164,59,0.1);
          border: 1px solid rgba(232,164,59,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #e8a43b;
        }
        .da-section-title {
          font-size: 13px; font-weight: 700;
          color: #f0f2f8; letter-spacing: 0.1px;
        }

        /* ── Badges ── */
        .da-status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 11px; border-radius: 20px;
          font-size: 11.5px; font-weight: 500;
        }
        .da-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* ── Chart area ── */
        .da-chart-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; font-weight: 500; letter-spacing: 1.2px;
          text-transform: uppercase; color: #4a5270; margin-bottom: 10px;
        }

        /* ── Buttons ── */
        .da-btn-new {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border: none; border-radius: 10px;
          color: #000; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 16px rgba(232,164,59,0.28);
          transition: all 0.2s; letter-spacing: 0.2px;
        }
        .da-btn-new:hover {
          box-shadow: 0 6px 24px rgba(232,164,59,0.45);
          transform: translateY(-1px);
        }

        .da-btn-edit {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px;
          background: rgba(91,142,247,0.08);
          border: 1px solid rgba(91,142,247,0.25);
          border-radius: 7px;
          color: #5b8ef7; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .da-btn-edit:hover {
          background: rgba(91,142,247,0.14);
          border-color: rgba(91,142,247,0.4);
        }

        .da-btn-del {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px;
          background: rgba(245,84,106,0.08);
          border: 1px solid rgba(245,84,106,0.22);
          border-radius: 7px;
          color: #f5546a; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .da-btn-del:hover {
          background: rgba(245,84,106,0.14);
          border-color: rgba(245,84,106,0.4);
        }

        /* ── Card override ── */
        .da-card {
          background: #0d1018;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.3);
          padding: 24px;
          margin-bottom: 20px;
        }

        /* ── Modal ── */
        .da-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(4,5,10,0.75);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
        }
        .da-modal {
          background: #0d1018;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          width: 100%; max-width: 480px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .da-modal-header {
          padding: 24px 24px 0;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 18px;
        }
        .da-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #f0f2f8;
        }
        .da-modal-close {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #8b94b0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all 0.15s;
        }
        .da-modal-close:hover {
          background: rgba(245,84,106,0.1);
          color: #f5546a;
          border-color: rgba(245,84,106,0.25);
        }
        .da-modal-body { padding: 24px; }
        .da-modal-footer {
          padding: 0 24px 24px;
          display: flex; gap: 10px; justify-content: flex-end;
        }

        .da-field-label {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.8px;
          color: #4a5270; margin-bottom: 7px; display: block;
        }
        .da-field-input {
          width: 100%; padding: 10px 14px;
          background: #111520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px;
          color: #f0f2f8;
          font-family: 'Sora', sans-serif;
          font-size: 13.5px; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .da-field-input::placeholder { color: #2e3450; }
        .da-field-input:focus {
          border-color: rgba(232,164,59,0.45);
          box-shadow: 0 0 0 3px rgba(232,164,59,0.08);
        }
        .da-modal-error {
          padding: 10px 14px;
          background: rgba(245,84,106,0.08);
          border: 1px solid rgba(245,84,106,0.25);
          border-radius: 9px;
          font-size: 13px; color: #f9a0af;
          margin-bottom: 0; margin-top: 8px;
        }
        .da-modal-cancel {
          padding: 9px 20px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          color: #8b94b0; font-size: 13px;
          cursor: pointer; font-family: 'Sora', sans-serif;
          transition: all 0.15s;
        }
        .da-modal-cancel:hover { background: rgba(255,255,255,0.04); color: #f0f2f8; }
        .da-modal-save {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 22px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border: none; border-radius: 9px;
          color: #000; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 14px rgba(232,164,59,0.25);
          transition: all 0.18s;
        }
        .da-modal-save:hover:not(:disabled) {
          box-shadow: 0 6px 22px rgba(232,164,59,0.45);
          transform: translateY(-1px);
        }
        .da-modal-save:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Recharts overrides */
        .recharts-text { fill: #4a5270 !important; font-family: 'Sora', sans-serif !important; }
        .recharts-tooltip-wrapper .recharts-default-tooltip {
          background: #0d1018 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
        }


        /* ── Table Dark Override ── */
        .table {
          background: transparent !important;
          color: #f0f2f8 !important;
          margin-bottom: 0;
          border-collapse: separate;
          border-spacing: 0;
        }

        .table thead {
          background: transparent !important;
        }

        .table thead th {
          color: #4a5270 !important;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 600;
          padding: 14px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        }

        .table tbody tr {
          background: transparent !important;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s ease;
        }

        .table tbody tr:hover {
          background: rgba(255,255,255,0.03) !important;
        }

        .table td {
          border: none !important;
          padding: 14px 12px;
          color: #d4d8e5;
          vertical-align: middle;
        }

        /* Remove fundo branco do Bootstrap */
        .table > :not(caption) > * > * {
          background-color: transparent !important;
        }

        /* Zebra leve (opcional, fica bonito) */
        .table tbody tr:nth-child(even) {
          background: rgba(255,255,255,0.015);
        }

        /* Bordas arredondadas estilo SaaS */
        .table thead tr th:first-child {
          border-top-left-radius: 10px;
        }
        .table thead tr th:last-child {
          border-top-right-radius: 10px;
        }
        .table tbody tr:last-child td:first-child {
          border-bottom-left-radius: 10px;
        }
        .table tbody tr:last-child td:last-child {
          border-bottom-right-radius: 10px;
        }

        /* Scroll container mais bonito */
        .table-responsive {
          border-radius: 12px;
          overflow: hidden;
        }

        /* Pequeno glow ao passar mouse (premium) */
        .table tbody tr:hover td {
          color: #f0f2f8;
        }

        /* Opcional: efeito glass */
        .table tbody tr {
          backdrop-filter: blur(6px);
        }
      `}</style>

      <div className="da-wrap">

        {/* Hero */}
        <div className="da-hero">
          <div className="da-hero-orb1" />
          <div className="da-hero-orb2" />
          <div className="da-hero-tag"><TrendingUp size={10} /> Painel do Agente</div>
          <p className="da-hero-sub">{saudacao},</p>
          <h2 className="da-hero-title">{primeiroNome} 👋</h2>
          <div className="da-stats">
            {statCards.map(s => (
              <div className="da-stat" key={s.label}>
                <div className="da-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div className="da-stat-val">{s.val}</div>
                  <div className="da-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Novo automóvel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button className="da-btn-new" onClick={abrirModalCadastro}>
            <PlusCircle size={14} /> Novo Automóvel
          </button>
        </div>

        {/* Charts */}
        <div className="da-card">
          <div className="da-section-header">
            <div className="da-section-icon"><Activity size={14} /></div>
            <span className="da-section-title">Visão geral</span>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <p className="da-chart-label">Status dos pedidos</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dadosPizza} dataKey="value" cx="50%" cy="50%"
                    outerRadius={82} innerRadius={44} paddingAngle={4}>
                    {dadosPizza.map((_, i) => (
                      <Cell key={i} fill={CORES_PIZZA[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0d1018', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f2f8', fontSize: 12 }}
                    formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-md-6">
              <p className="da-chart-label">Totais do sistema</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dadosBar} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4a5270' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#4a5270' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(232,164,59,0.06)' }}
                    contentStyle={{ background: '#0d1018', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f2f8', fontSize: 12 }} />
                  <Bar dataKey="valor" fill="#e8a43b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Clientes */}
        <div className="da-card">
          <div className="da-section-header">
            <div className="da-section-icon"><Users size={14} /></div>
            <span className="da-section-title">Clientes</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr><th>ID</th><th>Nome</th></tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr><td colSpan={2} style={{ textAlign: 'center', color: '#4a5270', padding: '24px' }}>Nenhum cliente cadastrado.</td></tr>
                ) : clientes.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: '#4a5270', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>#{c.id}</td>
                    <td style={{ fontWeight: 500 }}>{c.nome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pedidos */}
        <div className="da-card">
          <div className="da-section-header">
            <div className="da-section-icon"><ClipboardList size={14} /></div>
            <span className="da-section-title">Pedidos</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr><th>Cliente</th><th>Carro</th><th>Período</th><th>Status</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#4a5270', padding: '24px' }}>Nenhum pedido encontrado.</td></tr>
                ) : pedidos.map(p => {
                  const s = STATUS_CONFIG[p.status] || STATUS_CONFIG.Pendente
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.cliente}</td>
                      <td style={{ color: '#8b94b0' }}>{p.carro}</td>
                      <td style={{ color: '#4a5270', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                        {p.dataInicio} → {p.dataFim}
                      </td>
                      <td>
                        <span className="da-status-pill" style={{ background: s.bg, color: s.color }}>
                          <span className="da-status-dot" style={{ background: s.dot }} />
                          {s.label}
                        </span>
                      </td>
                      <td>
                        {p.status === 'Pendente' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                              onClick={() => atualizarStatus(p.id, 'APROVADO')} disabled={processando === p.id}>
                              {processando === p.id
                                ? <span className="spinner-border spinner-border-sm" />
                                : <CheckCircle size={12} />} Aprovar
                            </button>
                            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              onClick={() => atualizarStatus(p.id, 'CANCELADO')} disabled={processando === p.id}>
                              <XCircle size={12} /> Reprovar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Automóveis */}
        <div className="da-card">
          <div className="da-section-header">
            <div className="da-section-icon"><Car size={14} /></div>
            <span className="da-section-title">Automóveis cadastrados</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr><th>Marca</th><th>Modelo</th><th>Ano</th><th>Placa</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {carros.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#4a5270', padding: '24px' }}>Nenhum automóvel cadastrado.</td></tr>
                ) : carros.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.marca}</td>
                    <td style={{ color: '#8b94b0' }}>{c.modelo}</td>
                    <td style={{ color: '#4a5270', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{c.ano}</td>
                    <td>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2px 8px', borderRadius: 5, color: '#8b94b0', letterSpacing: 1
                      }}>{c.placa}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="da-btn-edit" onClick={() => abrirModalEdicao(c)}>
                          <Pencil size={11} /> Editar
                        </button>
                        <button className="da-btn-del" onClick={() => handleDeletarCarro(c.id, c.placa)}>
                          <Trash2 size={11} /> Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalCarro && (
          <div className="da-modal-overlay" onClick={fecharModalCarro}>
            <div className="da-modal" onClick={e => e.stopPropagation()}>
              <div className="da-modal-header">
                <h5 className="da-modal-title">
                  {editandoId ? 'Editar Automóvel' : 'Cadastrar Automóvel'}
                </h5>
                <button className="da-modal-close" onClick={fecharModalCarro}>✕</button>
              </div>
              <div className="da-modal-body">
                <div className="row g-3">
                  {[
                    { name: 'marca',  label: 'Marca',  placeholder: 'Ex: Toyota',   type: 'text'   },
                    { name: 'modelo', label: 'Modelo', placeholder: 'Ex: Corolla',  type: 'text'   },
                    { name: 'ano',    label: 'Ano',    placeholder: 'Ex: 2023',     type: 'number' },
                    { name: 'placa',  label: 'Placa',  placeholder: 'Ex: ABC-1234', type: 'text'   },
                  ].map(f => (
                    <div className="col-md-6" key={f.name}>
                      <label className="da-field-label">{f.label}</label>
                      <input type={f.type} name={f.name}
                        className="da-field-input"
                        placeholder={f.placeholder}
                        value={formCarro[f.name]}
                        onChange={handleCarroChange} />
                    </div>
                  ))}
                </div>
                {erroCarro && <div className="da-modal-error">{erroCarro}</div>}
              </div>
              <div className="da-modal-footer">
                <button className="da-modal-cancel" onClick={fecharModalCarro}>Cancelar</button>
                <button className="da-modal-save" onClick={handleSalvarCarro} disabled={salvandoCarro}>
                  {salvandoCarro
                    ? <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                    : <PlusCircle size={13} />}
                  {salvandoCarro ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}