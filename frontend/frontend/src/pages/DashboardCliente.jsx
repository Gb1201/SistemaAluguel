import { useState, useEffect } from 'react'
import { Car, PlusCircle, ClipboardList, Search, CalendarDays, Clock } from 'lucide-react'

const API_CARROS  = 'http://localhost:8080/automoveis/disponiveis'
const API_PEDIDOS = 'http://localhost:8080/pedidos'

const STATUS_CONFIG = {
  Pendente:  { badge: 'badge-pendente',  label: 'Pendente'  },
  Aprovado:  { badge: 'badge-aprovado',  label: 'Aprovado'  },
  Cancelado: { badge: 'badge-cancelado', label: 'Cancelado' },
}

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
    } catch (err) { console.error('Erro ao buscar carros:', err) }
  }

  const carregarPedidos = async () => {
    try {
      const res  = await fetch(API_PEDIDOS)
      const data = await res.json()
      const meusPedidos = data
        .filter(p => p.cliente?.id === clienteId)
        .map(p => ({
          id:         p.id,
          carro:      `${p.automovel?.marca} ${p.automovel?.modelo}`,
          dataInicio: p.dataInicio,
          dataFim:    p.dataFim,
          dias:       calcularDias(p.dataInicio, p.dataFim),
          status:
            p.status === 'PENDENTE' ? 'Pendente' :
            p.status === 'APROVADO' ? 'Aprovado' : 'Cancelado',
        }))
      setPedidos(meusPedidos)
    } catch (err) { console.error('Erro ao buscar pedidos:', err) }
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
    if (new Date(dataFim) <= new Date(dataInicio)) {
      setErroModal('Data de devolução deve ser após a retirada.'); return
    }
    setEnviando(true); setErroModal('')
    try {
      const response = await fetch(API_PEDIDOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId, automovelId: carroSelecionado.id, dataInicio, dataFim }),
      })
      if (!response.ok) throw new Error()
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
        .dc-hero {
          background: linear-gradient(135deg, #1e2540 0%, #0f1117 100%);
          border-radius: 16px;
          padding: 28px 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .dc-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(79,110,247,0.3) 0%, transparent 70%);
          border-radius: 50%;
        }
        .dc-hero::after {
          content: '';
          position: absolute;
          bottom: -60px; right: 80px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(108,142,247,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }
        .dc-hero-title {
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 4px;
        }
        .dc-hero-sub {
          font-size: 13px;
          color: #8b92a8;
          margin: 0;
        }
        .dc-stats {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .dc-stat {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 16px;
          min-width: 90px;
        }
        .dc-stat-val {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }
        .dc-stat-label {
          font-size: 11px;
          color: #8b92a8;
          margin-top: 3px;
        }
        .dc-section-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d2e;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .dc-section-title svg { color: #4f6ef7; }
        .car-card {
          border: 1px solid #e8eaf0;
          border-radius: 12px;
          padding: 16px;
          background: #fff;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          cursor: default;
        }
        .car-card:hover {
          box-shadow: 0 4px 20px rgba(79,110,247,0.1);
          border-color: #c5cffa;
          transform: translateY(-2px);
        }
        .car-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .car-icon-wrap {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #eef1ff, #dce3ff);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .car-marca { font-size: 13px; font-weight: 600; color: #1a1d2e; }
        .car-modelo { font-size: 12px; color: #6b7280; }
        .car-ano {
          font-size: 11px;
          background: #f4f5f9;
          color: #6b7280;
          padding: 2px 8px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 12px;
        }
        .btn-solicitar {
          width: 100%;
          background: #4f6ef7;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 12.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-solicitar:hover { background: #3a57e0; }
        .pedido-row { transition: background 0.15s; }
        .pedido-row:hover { background: #fafbff; }
        .badge-pendente {
          background: #fff8e1; color: #b45309;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 500;
        }
        .badge-aprovado {
          background: #e8f5e9; color: #2e7d32;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 500;
        }
        .badge-cancelado {
          background: #fce4e4; color: #b91c1c;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11.5px; font-weight: 500;
        }
        .search-wrap {
          position: relative;
          max-width: 280px;
        }
        .search-wrap svg {
          position: absolute; left: 10px; top: 50%;
          transform: translateY(-50%);
          color: #9ca3af; pointer-events: none;
        }
        .search-wrap input {
          padding-left: 32px;
          border-radius: 8px;
          border: 1px solid #e0e3ed;
          font-size: 13px;
          height: 34px;
          width: 100%;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .search-wrap input:focus {
          border-color: #4f6ef7;
          box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
        }
        .modal-dias-info {
          background: linear-gradient(135deg, #eef1ff, #f0f4ff);
          border: 1px solid #c5cffa;
          border-radius: 10px;
          padding: 12px 16px;
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-dias-label { font-size: 12px; color: #6b7280; }
        .modal-dias-val { font-size: 15px; font-weight: 600; color: #4f6ef7; }
      `}</style>

      <div className="container py-4">

        {/*  Hero  */}
        <div className="dc-hero">
          <p className="dc-hero-sub">{saudacao},</p>
          <h2 className="dc-hero-title">{primeiroNome} 👋</h2>
          <div className="dc-stats">
            <div className="dc-stat">
              <div className="dc-stat-val">{carros.length}</div>
              <div className="dc-stat-label">Disponíveis</div>
            </div>
            <div className="dc-stat">
              <div className="dc-stat-val">{pedidos.length}</div>
              <div className="dc-stat-label">Meus pedidos</div>
            </div>
            <div className="dc-stat">
              <div className="dc-stat-val">
                {pedidos.filter(p => p.status === 'Aprovado').length}
              </div>
              <div className="dc-stat-label">Aprovados</div>
            </div>
          </div>
        </div>

        {/* Carros disponíveis  */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="dc-section-title mb-0">
                <Car size={16} /> Carros disponíveis
              </div>
              <div className="search-wrap">
                <Search size={14} />
                <input placeholder="Buscar marca ou modelo..."
                  value={busca} onChange={e => setBusca(e.target.value)} />
              </div>
            </div>

            {carrosFiltrados.length === 0 ? (
              <p className="text-center text-muted py-4 mb-0">Nenhum carro disponível.</p>
            ) : (
              <div className="row g-3">
                {carrosFiltrados.map(c => (
                  <div className="col-sm-6 col-lg-4" key={c.id}>
                    <div className="car-card">
                      <div className="car-card-header">
                        <div className="car-icon-wrap">
                          <Car size={18} color="#4f6ef7" />
                        </div>
                        <div>
                          <div className="car-marca">{c.marca}</div>
                          <div className="car-modelo">{c.modelo}</div>
                        </div>
                      </div>
                      <span className="car-ano">{c.ano}</span>
                      <button className="btn-solicitar" onClick={() => abrirModal(c)}>
                        <PlusCircle size={13} /> Solicitar aluguel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/*  Meus pedidos  */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="dc-section-title">
              <ClipboardList size={16} /> Meus pedidos
            </div>
            {pedidos.length === 0 ? (
              <p className="text-center text-muted py-3 mb-0 small">Você ainda não fez nenhum pedido.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e8eaf0' }}>
                      {['Carro', 'Retirada', 'Devolução', 'Dias', 'Status'].map(h => (
                        <th key={h} style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                          letterSpacing: '0.5px', color: '#9ca3af', paddingBottom: 10, border: 'none' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map(p => (
                      <tr key={p.id} className="pedido-row">
                        <td style={{ fontWeight: 500, fontSize: 13 }}>{p.carro}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                            <CalendarDays size={12} /> {p.dataInicio}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                            <CalendarDays size={12} /> {p.dataFim}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                            <Clock size={12} /> {p.dias}d
                          </div>
                        </td>
                        <td>
                          <span className={STATUS_CONFIG[p.status]?.badge}>
                            {STATUS_CONFIG[p.status]?.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/*  Modal  */}
        {modalAberto && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                  <div>
                    <h5 className="modal-title fw-semibold mb-0">Solicitar aluguel</h5>
                    <p className="text-muted small mb-0 mt-1">
                      {carroSelecionado?.marca} {carroSelecionado?.modelo} · {carroSelecionado?.ano}
                    </p>
                  </div>
                  <button className="btn-close" onClick={fecharModal} />
                </div>
                <div className="modal-body px-4 pt-3">
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label fw-medium small">Data de retirada</label>
                      <input type="date" className="form-control"
                        value={dataInicio}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => { setDataInicio(e.target.value); setErroModal('') }} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium small">Data de devolução</label>
                      <input type="date" className="form-control"
                        value={dataFim}
                        min={dataInicio || new Date().toISOString().split('T')[0]}
                        onChange={e => { setDataFim(e.target.value); setErroModal('') }} />
                    </div>
                  </div>

                  {dias > 0 && (
                    <div className="modal-dias-info">
                      <span className="modal-dias-label">Duração do aluguel</span>
                      <span className="modal-dias-val">{dias} dia{dias > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {erroModal && (
                    <div className="alert alert-danger py-2 small mt-3 mb-0">{erroModal}</div>
                  )}
                </div>
                <div className="modal-footer border-0 px-4 pb-4 pt-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={fecharModal}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                    onClick={handleSolicitarAluguel} disabled={enviando}>
                    {enviando
                      ? <span className="spinner-border spinner-border-sm" />
                      : <PlusCircle size={13} />}
                    {enviando ? 'Enviando...' : 'Confirmar pedido'}
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