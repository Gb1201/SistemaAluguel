import { useState, useEffect } from 'react'
import { Car, PlusCircle, ClipboardList, Search, CalendarDays, Clock, Fuel, Gauge } from 'lucide-react'

const API_CARROS  = 'http://localhost:8080/automoveis/disponiveis'
const API_PEDIDOS = 'http://localhost:8080/pedidos'

const STATUS_CONFIG = {
  Pendente:  { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', label: 'Pendente'  },
  Aprovado:  { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e', label: 'Aprovado'  },
  Cancelado: { bg: '#fff1f2', color: '#e11d48', dot: '#f43f5e', label: 'Cancelado' },
}

// Cores para cada card de carro (cicla entre elas)
const CAR_PALETTES = [
  { from: '#1e3a5f', to: '#2d6a9f', accent: '#60a5fa' },
  { from: '#1a1a2e', to: '#16213e', accent: '#818cf8' },
  { from: '#0f3460', to: '#533483', accent: '#a78bfa' },
  { from: '#1b2838', to: '#2a475e', accent: '#38bdf8' },
  { from: '#0d2137', to: '#1a3a5c', accent: '#34d399' },
  { from: '#1e1e2e', to: '#313244', accent: '#f5c2e7' },
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
      // Atribui paleta fixa para cada carro
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
    if (!dataInicio || !dataFim) { setErroModal('Informe as datas.'); return }
    if (new Date(dataFim) <= new Date(dataInicio)) { setErroModal('Data de devolução deve ser após a retirada.'); return }
    setEnviando(true); setErroModal('')
    try {
      const res = await fetch(API_PEDIDOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId, automovelId: carroSelecionado.id, dataInicio, dataFim }),
      })
      if (!res.ok) throw new Error()
      await carregarPedidos(); await carregarCarros(); fecharModal()
    } catch { setErroModal('Erro ao enviar pedido.') }
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .dc-wrap { font-family: 'DM Sans', sans-serif; }

        /* ── Hero ── */
        .dc-hero {
          background: linear-gradient(135deg, #0f1117 0%, #1e2540 60%, #162048 100%);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .dc-hero-glow1 {
          position: absolute; top: -60px; right: -20px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .dc-hero-glow2 {
          position: absolute; bottom: -80px; right: 140px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .dc-hero-glow3 {
          position: absolute; top: 10px; left: 40%;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .dc-hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc; font-size: 11px; font-weight: 500;
          padding: 3px 10px; border-radius: 20px; margin-bottom: 10px;
          letter-spacing: 0.3px;
        }
        .dc-hero-saudacao { font-size: 13px; color: #94a3b8; margin: 0; }
        .dc-hero-nome { font-size: 26px; font-weight: 700; color: #fff; margin: 2px 0 20px; letter-spacing: -0.5px; }
        .dc-hero-stats { display: flex; gap: 12px; flex-wrap: wrap; }
        .dc-stat {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 18px;
          min-width: 100px;
          backdrop-filter: blur(4px);
        }
        .dc-stat-val { font-size: 22px; font-weight: 700; color: #fff; line-height: 1; }
        .dc-stat-label { font-size: 11px; color: #64748b; margin-top: 4px; letter-spacing: 0.3px; }

        /* ── Section header ── */
        .dc-sh {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .dc-sh-left { display: flex; align-items: center; gap: 8px; }
        .dc-sh-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          display: flex; align-items: center; justify-content: center;
        }
        .dc-sh-title { font-size: 15px; font-weight: 600; color: #0f172a; }
        .dc-sh-count {
          font-size: 11px; font-weight: 600; color: #6366f1;
          background: #eef2ff; border-radius: 20px; padding: 2px 8px;
        }

        /* ── Search ── */
        .dc-search {
          position: relative;
        }
        .dc-search svg {
          position: absolute; left: 10px; top: 50%;
          transform: translateY(-50%); color: #94a3b8; pointer-events: none;
        }
        .dc-search input {
          padding: 7px 12px 7px 32px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-size: 13px;
          width: 220px; outline: none;
          background: #f8fafc;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .dc-search input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          background: #fff;
        }

        /* ── Car cards ── */
        .car-card-outer {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: transform 0.22s, box-shadow 0.22s;
          cursor: default;
        }
        .car-card-outer:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.18);
        }
        .car-card-top {
          padding: 20px 20px 16px;
          position: relative;
          overflow: hidden;
          min-height: 110px;
        }
        .car-card-top-glow {
          position: absolute; top: -30px; right: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          opacity: 0.25;
          pointer-events: none;
        }
        .car-plate {
          display: inline-block;
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 2px 8px; border-radius: 4px;
          border: 1px solid;
          margin-bottom: 10px;
          opacity: 0.7;
        }
        .car-name { font-size: 16px; font-weight: 700; color: #fff; margin: 0 0 2px; }
        .car-sub  { font-size: 12px; color: rgba(255,255,255,0.55); margin: 0; }
        .car-year-pill {
          position: absolute; top: 16px; right: 16px;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .car-card-bottom {
          padding: 14px 16px;
          background: #fff;
          border-top: none;
        }
        .car-meta {
          display: flex; gap: 12px; margin-bottom: 12px;
        }
        .car-meta-item {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: #94a3b8;
        }
        .btn-solicitar {
          width: 100%;
          padding: 9px;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.15s, transform 0.1s;
          color: #fff;
        }
        .btn-solicitar:hover { opacity: 0.88; transform: scale(0.98); }

        /* ── Pedidos table ── */
        .dc-table-wrap { overflow: hidden; border-radius: 12px; border: 1.5px solid #f1f5f9; }
        .dc-table { width: 100%; border-collapse: collapse; }
        .dc-table th {
          font-size: 10.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.6px; color: #94a3b8;
          padding: 10px 16px; background: #f8fafc;
          border-bottom: 1.5px solid #f1f5f9; text-align: left;
        }
        .dc-table td {
          padding: 13px 16px; font-size: 13px; color: #334155;
          border-bottom: 1px solid #f8fafc;
        }
        .dc-table tbody tr:last-child td { border-bottom: none; }
        .dc-table tbody tr { transition: background 0.12s; }
        .dc-table tbody tr:hover td { background: #fafbff; }
        .dc-status-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .dc-status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 500;
        }

        /* ── Modal ── */
        .dc-modal-overlay {
          position: fixed; inset: 0; z-index: 1050;
          background: rgba(15,17,23,0.65);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
        }
        .dc-modal {
          background: #fff; border-radius: 20px;
          width: 100%; max-width: 420px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .dc-modal-header {
          padding: 24px 24px 0;
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .dc-modal-car-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eef2ff; color: #6366f1;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px; margin-bottom: 6px;
        }
        .dc-modal-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
        .dc-modal-close {
          background: #f1f5f9; border: none; border-radius: 8px;
          width: 30px; height: 30px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; font-size: 16px; transition: background 0.15s;
        }
        .dc-modal-close:hover { background: #e2e8f0; }
        .dc-modal-body { padding: 20px 24px; }
        .dc-date-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .dc-date-label { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 5px; }
        .dc-date-input {
          width: 100%; padding: 9px 12px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dc-date-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .dc-duration-card {
          margin-top: 16px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border-radius: 12px; padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dc-duration-label { font-size: 12px; color: rgba(255,255,255,0.7); }
        .dc-duration-val { font-size: 18px; font-weight: 700; color: #fff; }
        .dc-modal-footer {
          padding: 0 24px 24px;
          display: flex; gap: 10px; justify-content: flex-end;
        }
        .dc-btn-cancel {
          padding: 9px 18px; border: 1.5px solid #e2e8f0;
          border-radius: 10px; background: #fff;
          font-size: 13px; font-weight: 500; color: #64748b;
          cursor: pointer; transition: background 0.15s;
        }
        .dc-btn-cancel:hover { background: #f8fafc; }
        .dc-btn-confirm {
          padding: 9px 20px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #fff;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
        .dc-btn-confirm:hover { opacity: 0.9; }
        .dc-btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="dc-wrap container py-4">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="dc-hero">
          <div className="dc-hero-glow1" />
          <div className="dc-hero-glow2" />
          <div className="dc-hero-glow3" />
          <div className="dc-hero-tag">
            <Car size={11} /> Painel do Cliente
          </div>
          <p className="dc-hero-saudacao">{saudacao},</p>
          <h2 className="dc-hero-nome">{primeiroNome} 👋</h2>
          <div className="dc-hero-stats">
            {[
              { val: carros.length,                                  label: 'Disponíveis' },
              { val: pedidos.length,                                 label: 'Meus pedidos' },
              { val: pedidos.filter(p => p.status === 'Aprovado').length, label: 'Aprovados' },
              { val: pedidos.filter(p => p.status === 'Pendente').length, label: 'Pendentes' },
            ].map(s => (
              <div className="dc-stat" key={s.label}>
                <div className="dc-stat-val">{s.val}</div>
                <div className="dc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Carros disponíveis ──────────────────────────────────── */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="dc-sh">
              <div className="dc-sh-left">
                <div className="dc-sh-icon"><Car size={15} color="#fff" /></div>
                <span className="dc-sh-title">Carros disponíveis</span>
                <span className="dc-sh-count">{carrosFiltrados.length}</span>
              </div>
              <div className="dc-search">
                <Search size={14} />
                <input placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
              </div>
            </div>

            {carrosFiltrados.length === 0 ? (
              <p className="text-center text-muted py-4 mb-0 small">Nenhum carro disponível no momento.</p>
            ) : (
              <div className="row g-3">
                {carrosFiltrados.map(c => {
                  const pal = CAR_PALETTES[paletteIdx[c.id] ?? 0]
                  return (
                    <div className="col-sm-6 col-xl-4" key={c.id}>
                      <div className="car-card-outer">
                        {/* Top colorido */}
                        <div className="car-card-top"
                          style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}>
                          <div className="car-card-top-glow"
                            style={{ background: `radial-gradient(circle, ${pal.accent}, transparent)` }} />
                          <div className="car-plate"
                            style={{ color: pal.accent, borderColor: pal.accent }}>
                            {c.placa ?? '---'}
                          </div>
                          <p className="car-name">{c.marca}</p>
                          <p className="car-sub">{c.modelo}</p>
                          <span className="car-year-pill" style={{ color: pal.accent }}>
                            {c.ano}
                          </span>
                        </div>
                        {/* Bottom branco */}
                        <div className="car-card-bottom">
                          <div className="car-meta">
                            <div className="car-meta-item"><Fuel size={11} /> Flex</div>
                            <div className="car-meta-item"><Gauge size={11} /> 0 km</div>
                          </div>
                          <button className="btn-solicitar"
                            style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                            onClick={() => abrirModal(c)}>
                            <PlusCircle size={13} /> Solicitar aluguel
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Meus pedidos ───────────────────────────────────────── */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="dc-sh mb-4">
              <div className="dc-sh-left">
                <div className="dc-sh-icon"><ClipboardList size={15} color="#fff" /></div>
                <span className="dc-sh-title">Meus pedidos</span>
                <span className="dc-sh-count">{pedidos.length}</span>
              </div>
            </div>

            {pedidos.length === 0 ? (
              <p className="text-center text-muted py-3 mb-0 small">Você ainda não fez nenhum pedido.</p>
            ) : (
              <div className="dc-table-wrap">
                <table className="dc-table">
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b' }}>
                              <CalendarDays size={12} color="#6366f1" /> {p.dataInicio}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b' }}>
                              <CalendarDays size={12} color="#6366f1" /> {p.dataFim}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b' }}>
                              <Clock size={12} color="#6366f1" /> {p.dias}d
                            </div>
                          </td>
                          <td>
                            <span className="dc-status-pill"
                              style={{ background: s.bg, color: s.color }}>
                              <span className="dc-status-dot" style={{ background: s.dot }} />
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
        </div>

        {/* ── Modal ──────────────────────────────────────────────── */}
        {modalAberto && (
          <div className="dc-modal-overlay" onClick={fecharModal}>
            <div className="dc-modal" onClick={e => e.stopPropagation()}>
              <div className="dc-modal-header">
                <div>
                  <div className="dc-modal-car-tag">
                    <Car size={11} /> {carroSelecionado?.marca} {carroSelecionado?.modelo}
                  </div>
                  <h5 className="dc-modal-title">Solicitar aluguel</h5>
                </div>
                <button className="dc-modal-close" onClick={fecharModal}>✕</button>
              </div>

              <div className="dc-modal-body">
                <div className="dc-date-group">
                  <div>
                    <div className="dc-date-label">Retirada</div>
                    <input type="date" className="dc-date-input"
                      value={dataInicio}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => { setDataInicio(e.target.value); setErroModal('') }} />
                  </div>
                  <div>
                    <div className="dc-date-label">Devolução</div>
                    <input type="date" className="dc-date-input"
                      value={dataFim}
                      min={dataInicio || new Date().toISOString().split('T')[0]}
                      onChange={e => { setDataFim(e.target.value); setErroModal('') }} />
                  </div>
                </div>

                {dias > 0 && (
                  <div className="dc-duration-card">
                    <div>
                      <div className="dc-duration-label">Duração do aluguel</div>
                      <div className="dc-duration-val">{dias} dia{dias > 1 ? 's' : ''}</div>
                    </div>
                    <Clock size={28} color="rgba(255,255,255,0.3)" />
                  </div>
                )}

                {erroModal && (
                  <div style={{ marginTop: 12, padding: '8px 12px', background: '#fff1f2',
                    border: '1px solid #fecdd3', borderRadius: 8, fontSize: 13, color: '#e11d48' }}>
                    {erroModal}
                  </div>
                )}
              </div>

              <div className="dc-modal-footer">
                <button className="dc-btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button className="dc-btn-confirm" onClick={handleSolicitarAluguel} disabled={enviando}>
                  {enviando
                    ? <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} />
                    : <PlusCircle size={14} />}
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