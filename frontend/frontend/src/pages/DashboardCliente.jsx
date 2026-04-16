import { useState, useEffect } from 'react'
import { Car, PlusCircle, ClipboardList, Search, CalendarDays, Clock, Fuel, Gauge, Zap } from 'lucide-react'

const API_CARROS  = 'http://localhost:8080/automoveis/disponiveis'
const API_PEDIDOS = 'http://localhost:8080/pedidos'

const STATUS_CONFIG = {
  Pendente:  { bg: 'rgba(232,164,59,0.1)',  color: '#e8a43b', dot: '#e8a43b', label: 'Pendente'  },
  Aprovado:  { bg: 'rgba(45,212,160,0.1)',  color: '#2dd4a0', dot: '#2dd4a0', label: 'Aprovado'  },
  Cancelado: { bg: 'rgba(245,84,106,0.1)',  color: '#f5546a', dot: '#f5546a', label: 'Cancelado' },
}

const CAR_PALETTES = [
  { top: 'linear-gradient(135deg,#0f1e3d,#1a3a6c)', accent: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
  { top: 'linear-gradient(135deg,#1a0e2e,#2d1a5e)', accent: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  { top: 'linear-gradient(135deg,#0c1f1a,#0f3326)', accent: '#34d399', glow: 'rgba(52,211,153,0.3)' },
  { top: 'linear-gradient(135deg,#1a1000,#3d2800)', accent: '#e8a43b', glow: 'rgba(232,164,59,0.3)' },
  { top: 'linear-gradient(135deg,#1f0e0e,#3d1515)', accent: '#f87171', glow: 'rgba(248,113,113,0.3)' },
  { top: 'linear-gradient(135deg,#0d1a26,#0f2d40)', accent: '#38bdf8', glow: 'rgba(56,189,248,0.3)' },
]

export default function DashboardCliente({ usuario }) {
  const [carros, setCarros]                     = useState([])
  const [busca, setBusca]                       = useState('')
  const [pedidos, setPedidos]                   = useState([])
  const [carroSelecionado, setCarroSelecionado] = useState(null)
  const [modalAberto, setModalAberto]           = useState(false)
  const [dataInicio, setDataInicio]             = useState('')
  const [dataFim, setDataFim]                   = useState('')
  const [erroModal, setErroModal]               = useState('')
  const [enviando, setEnviando]                 = useState(false)
  const [paletteIdx, setPaletteIdx]             = useState({})

  const clienteId = usuario?.id

  const calcularDias = (inicio, fim) => {
    const diff = new Date(fim) - new Date(inicio)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const carregarCarros = async () => {
    try {
      const res  = await fetch(API_CARROS)
      const data = await res.json()
      setCarros(data)
      const idx = {}
      data.forEach((c, i) => { idx[c.id] = i % CAR_PALETTES.length })
      setPaletteIdx(idx)
    } catch (err) { console.error(err) }
  }

  const carregarPedidos = async () => {
    try {
      const res  = await fetch(API_PEDIDOS)
      const data = await res.json()
      setPedidos(data
        .filter(p => p.cliente?.id === clienteId)
        .map(p => ({
          id:         p.id,
          carro:      `${p.automovel?.marca} ${p.automovel?.modelo}`,
          dataInicio: p.dataInicio,
          dataFim:    p.dataFim,
          dias:       calcularDias(p.dataInicio, p.dataFim),
          status: p.status === 'PENDENTE' ? 'Pendente' : p.status === 'APROVADO' ? 'Aprovado' : 'Cancelado',
        }))
      )
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (clienteId) { carregarCarros(); carregarPedidos() }
  }, [clienteId])

  const carrosFiltrados = carros.filter(c =>
    `${c.marca} ${c.modelo}`.toLowerCase().includes(busca.toLowerCase())
  )

  const abrirModal = (carro) => {
    setCarroSelecionado(carro)
    setDataInicio(''); setDataFim(''); setErroModal('')
    setModalAberto(true)
  }

  const fecharModal = () => { setModalAberto(false); setCarroSelecionado(null) }

  const handleSolicitarAluguel = async () => {
    if (!dataInicio || !dataFim) { setErroModal('Informe as datas de retirada e devolução.'); return }
    if (new Date(dataFim) <= new Date(dataInicio)) { setErroModal('A devolução deve ser após a retirada.'); return }
    setEnviando(true); setErroModal('')
    try {
      const res = await fetch(API_PEDIDOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId, automovelId: carroSelecionado.id, dataInicio, dataFim }),
      })
      if (!res.ok) throw new Error()
      await carregarPedidos(); await carregarCarros(); fecharModal()
    } catch { setErroModal('Erro ao enviar pedido. Tente novamente.') }
    finally { setEnviando(false) }
  }

  const dias = dataInicio && dataFim && new Date(dataFim) > new Date(dataInicio)
    ? calcularDias(dataInicio, dataFim) : 0

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Cliente'
  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .dcl-wrap { font-family: 'Sora', sans-serif; -webkit-font-smoothing: antialiased; }

        /* ── Hero ── */
        .dcl-hero {
          background: linear-gradient(135deg, #0d1018 0%, #111520 60%, #0a0e16 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .dcl-hero-orb1 {
          position: absolute; top: -50px; right: -20px;
          width: 260px; height: 200px;
          background: radial-gradient(ellipse, rgba(45,212,160,0.1) 0%, transparent 70%);
          pointer-events: none; border-radius: 50%;
        }
        .dcl-hero-orb2 {
          position: absolute; bottom: -60px; left: 30%;
          width: 200px; height: 160px;
          background: radial-gradient(ellipse, rgba(91,142,247,0.08) 0%, transparent 70%);
          pointer-events: none; border-radius: 50%;
        }
        .dcl-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(45,212,160,0.08);
          border: 1px solid rgba(45,212,160,0.2);
          color: #2dd4a0; font-size: 10.5px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px; margin-bottom: 10px;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .dcl-hero-sub  { font-size: 12.5px; color: #4a5270; margin: 0; }
        .dcl-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #f0f2f8; margin: 4px 0 24px; letter-spacing: -0.3px;
        }
        .dcl-stats { display: flex; gap: 14px; flex-wrap: wrap; }
        .dcl-stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 12px 20px; min-width: 100px;
        }
        .dcl-stat-val { font-size: 22px; font-weight: 700; color: #f0f2f8; line-height: 1; }
        .dcl-stat-label { font-size: 10.5px; color: #4a5270; margin-top: 3px; letter-spacing: 0.3px; }

        /* ── Section ── */
        .dcl-card {
          background: #0d1018;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.3);
          padding: 24px;
          margin-bottom: 20px;
        }
        .dcl-section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .dcl-section-left { display: flex; align-items: center; gap: 10px; }
        .dcl-section-icon {
          width: 30px; height: 30px;
          background: rgba(232,164,59,0.1);
          border: 1px solid rgba(232,164,59,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #e8a43b;
        }
        .dcl-section-title { font-size: 13px; font-weight: 700; color: #f0f2f8; }
        .dcl-section-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; color: #e8a43b;
          background: rgba(232,164,59,0.1);
          border: 1px solid rgba(232,164,59,0.2);
          padding: 1px 8px; border-radius: 20px;
        }

        /* ── Search ── */
        .dcl-search { position: relative; }
        .dcl-search-icon {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%); color: #4a5270; pointer-events: none;
        }
        .dcl-search-input {
          padding: 8px 14px 8px 34px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; font-size: 13px;
          color: #f0f2f8;
          font-family: 'Sora', sans-serif;
          width: 220px; outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .dcl-search-input::placeholder { color: #2e3450; }
        .dcl-search-input:focus {
          border-color: rgba(232,164,59,0.4);
          background: rgba(255,255,255,0.06);
        }

        /* ── Car cards ── */
        .dcl-car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }

        .dcl-car-card {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
        }
        .dcl-car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }

        .dcl-car-top {
          padding: 20px;
          position: relative;
          overflow: hidden;
          min-height: 130px;
        }
        .dcl-car-glow {
          position: absolute; top: -30px; right: -30px;
          width: 130px; height: 130px; border-radius: 50%;
          opacity: 0.35; pointer-events: none;
        }
        .dcl-car-plate {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; font-weight: 600;
          letter-spacing: 1.8px; text-transform: uppercase;
          padding: 2px 9px; border-radius: 4px;
          border: 1px solid;
          display: inline-block;
          margin-bottom: 14px;
          opacity: 0.7;
        }
        .dcl-car-brand { font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 2px; }
        .dcl-car-model { font-size: 12.5px; color: rgba(255,255,255,0.5); margin: 0; }
        .dcl-car-year {
          position: absolute; top: 16px; right: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .dcl-car-bottom {
          background: #111520;
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .dcl-car-meta {
          display: flex; gap: 14px; margin-bottom: 14px;
        }
        .dcl-car-meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #4a5270;
        }
        .dcl-btn-solicitar {
          width: 100%; padding: 10px;
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: opacity 0.15s, transform 0.1s;
          color: #000;
          letter-spacing: 0.2px;
        }
        .dcl-btn-solicitar:hover { opacity: 0.85; transform: scale(0.98); }

        /* ── Pedidos table ── */
        .dcl-status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 11px; border-radius: 20px;
          font-size: 11.5px; font-weight: 500;
        }
        .dcl-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* ── Modal ── */
        .dcl-modal-overlay {
          position: fixed; inset: 0; z-index: 1050;
          background: rgba(4,5,10,0.75);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
        }
        .dcl-modal {
          background: #0d1018;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          width: 100%; max-width: 430px;
          box-shadow: 0 28px 80px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .dcl-modal-header {
          padding: 24px 24px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .dcl-modal-car-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(232,164,59,0.08);
          border: 1px solid rgba(232,164,59,0.2);
          color: #e8a43b; font-size: 10.5px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px; margin-bottom: 8px;
          letter-spacing: 0.3px;
        }
        .dcl-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #f0f2f8; margin: 0;
        }
        .dcl-modal-close {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #8b94b0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; transition: all 0.15s;
        }
        .dcl-modal-close:hover {
          background: rgba(245,84,106,0.1); color: #f5546a;
          border-color: rgba(245,84,106,0.25);
        }
        .dcl-modal-body { padding: 22px 24px; }

        .dcl-date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .dcl-date-label {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.7px;
          color: #4a5270; margin-bottom: 7px; display: block;
        }
        .dcl-date-input {
          width: 100%; padding: 10px 12px;
          background: #111520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px;
          color: #f0f2f8;
          font-family: 'Sora', sans-serif;
          font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dcl-date-input:focus {
          border-color: rgba(232,164,59,0.45);
          box-shadow: 0 0 0 3px rgba(232,164,59,0.08);
        }

        .dcl-duration-card {
          margin-top: 16px;
          background: linear-gradient(135deg, rgba(232,164,59,0.12), rgba(194,127,34,0.08));
          border: 1px solid rgba(232,164,59,0.2);
          border-radius: 12px; padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dcl-dur-label { font-size: 11px; color: #8b7041; margin-bottom: 3px; }
        .dcl-dur-val { font-size: 20px; font-weight: 700; color: #e8a43b; }

        .dcl-modal-error {
          margin-top: 14px; padding: 11px 14px;
          background: rgba(245,84,106,0.08);
          border: 1px solid rgba(245,84,106,0.22);
          border-radius: 9px; font-size: 13px; color: #f9a0af;
        }

        .dcl-modal-footer {
          padding: 0 24px 24px;
          display: flex; gap: 10px; justify-content: flex-end;
        }
        .dcl-btn-cancel {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 500;
          color: #8b94b0; cursor: pointer;
          transition: all 0.15s;
        }
        .dcl-btn-cancel:hover { background: rgba(255,255,255,0.04); color: #f0f2f8; }
        .dcl-btn-confirm {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 24px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 700; color: #000;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(232,164,59,0.3);
          transition: all 0.2s; letter-spacing: 0.2px;
        }
        .dcl-btn-confirm:hover:not(:disabled) {
          box-shadow: 0 8px 26px rgba(232,164,59,0.5);
          transform: translateY(-1px);
        }
        .dcl-btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Table Dark Override (Cliente) ── */
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

        /* remove fundo branco interno do bootstrap */
        .table > :not(caption) > * > * {
          background-color: transparent !important;
        }

        /* zebra leve */
        .table tbody tr:nth-child(even) {
          background: rgba(255,255,255,0.015);
        }

        /* bordas arredondadas */
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

        /* container */
        .table-responsive {
          border-radius: 12px;
          overflow: hidden;
        }

        /* hover premium */
        .table tbody tr:hover td {
          color: #f0f2f8;
        }

        /* efeito glass leve */
        .table tbody tr {
          backdrop-filter: blur(6px);
        }
      `}</style>

      <div className="dcl-wrap">

        {/* Hero */}
        <div className="dcl-hero">
          <div className="dcl-hero-orb1" />
          <div className="dcl-hero-orb2" />
          <div className="dcl-hero-tag"><Car size={10} /> Painel do Cliente</div>
          <p className="dcl-hero-sub">{saudacao},</p>
          <h2 className="dcl-hero-title">{primeiroNome} 👋</h2>
          <div className="dcl-stats">
            {[
              { val: carros.length,                                       label: 'Disponíveis' },
              { val: pedidos.length,                                      label: 'Meus pedidos' },
              { val: pedidos.filter(p => p.status === 'Aprovado').length, label: 'Aprovados'   },
              { val: pedidos.filter(p => p.status === 'Pendente').length, label: 'Pendentes'   },
            ].map(s => (
              <div className="dcl-stat" key={s.label}>
                <div className="dcl-stat-val">{s.val}</div>
                <div className="dcl-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carros disponíveis */}
        <div className="dcl-card">
          <div className="dcl-section-header">
            <div className="dcl-section-left">
              <div className="dcl-section-icon"><Car size={14} /></div>
              <span className="dcl-section-title">Carros disponíveis</span>
              <span className="dcl-section-count">{carrosFiltrados.length}</span>
            </div>
            <div className="dcl-search">
              <Search size={13} className="dcl-search-icon" />
              <input className="dcl-search-input" placeholder="Buscar marca ou modelo..."
                value={busca} onChange={e => setBusca(e.target.value)} />
            </div>
          </div>

          {carrosFiltrados.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#4a5270', padding: '32px 0', margin: 0, fontSize: 13 }}>
              Nenhum carro disponível no momento.
            </p>
          ) : (
            <div className="dcl-car-grid">
              {carrosFiltrados.map(c => {
                const pal = CAR_PALETTES[paletteIdx[c.id] ?? 0]
                return (
                  <div className="dcl-car-card" key={c.id}>
                    <div className="dcl-car-top" style={{ background: pal.top }}>
                      <div className="dcl-car-glow"
                        style={{ background: `radial-gradient(circle, ${pal.glow}, transparent)` }} />
                      <div className="dcl-car-plate" style={{ color: pal.accent, borderColor: pal.accent }}>
                        {c.placa ?? '---'}
                      </div>
                      <p className="dcl-car-brand">{c.marca}</p>
                      <p className="dcl-car-model">{c.modelo}</p>
                      <span className="dcl-car-year" style={{ color: pal.accent }}>{c.ano}</span>
                    </div>
                    <div className="dcl-car-bottom">
                      <div className="dcl-car-meta">
                        <div className="dcl-car-meta-item"><Fuel size={11} color={pal.accent} /> Flex</div>
                        <div className="dcl-car-meta-item"><Gauge size={11} color={pal.accent} /> 0 km</div>
                        <div className="dcl-car-meta-item"><Zap size={11} color={pal.accent} /> Disponível</div>
                      </div>
                      <button className="dcl-btn-solicitar"
                        style={{ background: `linear-gradient(135deg, ${pal.accent}22, ${pal.accent}11)`, border: `1px solid ${pal.accent}44`, color: pal.accent }}
                        onClick={() => abrirModal(c)}>
                        <PlusCircle size={13} /> Solicitar aluguel
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Meus pedidos */}
        <div className="dcl-card">
          <div className="dcl-section-header">
            <div className="dcl-section-left">
              <div className="dcl-section-icon"><ClipboardList size={14} /></div>
              <span className="dcl-section-title">Meus pedidos</span>
              <span className="dcl-section-count">{pedidos.length}</span>
            </div>
          </div>

          {pedidos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#4a5270', padding: '32px 0', margin: 0, fontSize: 13 }}>
              Você ainda não fez nenhum pedido.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    {['Veículo', 'Retirada', 'Devolução', 'Duração', 'Status'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(p => {
                    const s = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.Cancelado
                    return (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.carro}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8b94b0', fontSize: 12.5 }}>
                            <CalendarDays size={11} color="#e8a43b" /> {p.dataInicio}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8b94b0', fontSize: 12.5 }}>
                            <CalendarDays size={11} color="#e8a43b" /> {p.dataFim}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8b94b0', fontSize: 12.5 }}>
                            <Clock size={11} color="#e8a43b" /> {p.dias}d
                          </div>
                        </td>
                        <td>
                          <span className="dcl-status-pill" style={{ background: s.bg, color: s.color }}>
                            <span className="dcl-status-dot" style={{ background: s.dot }} />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {modalAberto && (
          <div className="dcl-modal-overlay" onClick={fecharModal}>
            <div className="dcl-modal" onClick={e => e.stopPropagation()}>
              <div className="dcl-modal-header">
                <div>
                  <div className="dcl-modal-car-tag">
                    <Car size={10} /> {carroSelecionado?.marca} {carroSelecionado?.modelo}
                  </div>
                  <h5 className="dcl-modal-title">Solicitar aluguel</h5>
                </div>
                <button className="dcl-modal-close" onClick={fecharModal}>✕</button>
              </div>

              <div className="dcl-modal-body">
                <div className="dcl-date-row">
                  <div>
                    <span className="dcl-date-label">Retirada</span>
                    <input type="date" className="dcl-date-input"
                      value={dataInicio}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => { setDataInicio(e.target.value); setErroModal('') }} />
                  </div>
                  <div>
                    <span className="dcl-date-label">Devolução</span>
                    <input type="date" className="dcl-date-input"
                      value={dataFim}
                      min={dataInicio || new Date().toISOString().split('T')[0]}
                      onChange={e => { setDataFim(e.target.value); setErroModal('') }} />
                  </div>
                </div>

                {dias > 0 && (
                  <div className="dcl-duration-card">
                    <div>
                      <div className="dcl-dur-label">Duração do aluguel</div>
                      <div className="dcl-dur-val">{dias} dia{dias > 1 ? 's' : ''}</div>
                    </div>
                    <Clock size={26} color="rgba(232,164,59,0.3)" />
                  </div>
                )}

                {erroModal && <div className="dcl-modal-error">{erroModal}</div>}
              </div>

              <div className="dcl-modal-footer">
                <button className="dcl-btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button className="dcl-btn-confirm" onClick={handleSolicitarAluguel} disabled={enviando}>
                  {enviando
                    ? <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                    : <PlusCircle size={13} />}
                  {enviando ? 'Enviando...' : 'Confirmar pedido'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}