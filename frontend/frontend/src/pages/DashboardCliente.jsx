import { useState, useEffect } from 'react'
import { Car, PlusCircle, ClipboardList, Search } from 'lucide-react'

const API_CARROS  = 'http://localhost:8080/automoveis/disponiveis'
const API_PEDIDOS = 'http://localhost:8080/pedidos'

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

  // Usa o id real do usuário logado vindo do contexto de autenticação
  const clienteId = usuario?.id

  const calcularDias = (inicio, fim) => {
    const diff = new Date(fim) - new Date(inicio)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // ── GET /automoveis/disponiveis ──────────────────────────────────
  const carregarCarros = async () => {
    try {
      const res  = await fetch(API_CARROS)
      const data = await res.json()
      setCarros(data)
    } catch (err) {
      console.error('Erro ao buscar carros:', err)
    }
  }

  // ── GET /pedidos — filtra pelo id do cliente logado ──────────────
  const carregarPedidos = async () => {
    try {
      const res  = await fetch(API_PEDIDOS)
      const data = await res.json()

      const meusPedidos = data
        .filter(p => p.cliente?.id === clienteId)
        .map(p => {
          const dias = calcularDias(p.dataInicio, p.dataFim)
          return {
            id:         p.id,
            carro:      `${p.automovel?.marca} ${p.automovel?.modelo}`,
            dataInicio: p.dataInicio,
            dataFim:    p.dataFim,
            dias,
            status:
              p.status === 'PENDENTE'  ? 'Pendente'  :
              p.status === 'APROVADO'  ? 'Aprovado'  : 'Cancelado',
          }
        })

      setPedidos(meusPedidos)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    }
  }

  useEffect(() => {
    if (clienteId) {
      carregarCarros()
      carregarPedidos()
    }
  }, [clienteId])

  const carrosFiltrados = carros.filter(c =>
    `${c.marca} ${c.modelo}`.toLowerCase().includes(busca.toLowerCase())
  )

  const abrirModal = (carro) => {
    setCarroSelecionado(carro)
    setDataInicio('')
    setDataFim('')
    setErroModal('')
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setCarroSelecionado(null)
  }

  // ── POST /pedidos ────────────────────────────────────────────────
  const handleSolicitarAluguel = async () => {
    if (!dataInicio || !dataFim) { setErroModal('Informe as datas.'); return }
    if (new Date(dataFim) <= new Date(dataInicio)) {
      setErroModal('Data de devolução deve ser após a retirada.')
      return
    }

    setEnviando(true)
    setErroModal('')

    try {
      const response = await fetch(API_PEDIDOS, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          clienteId,
          automovelId: carroSelecionado.id,
          dataInicio,
          dataFim,
        }),
      })
      if (!response.ok) throw new Error()

      await carregarPedidos()
      await carregarCarros()
      fecharModal()
    } catch {
      setErroModal('Erro ao enviar pedido.')
    } finally {
      setEnviando(false)
    }
  }

  const BADGE = {
    Pendente:  'text-bg-warning',
    Aprovado:  'text-bg-success',
    Cancelado: 'text-bg-danger',
  }

  return (
    <div className="container py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-0">Olá, {usuario?.nome?.split(' ')[0] || 'Cliente'} 👋</h4>
        <p className="text-muted small mb-0">Escolha um carro e acompanhe seus pedidos</p>
      </div>

      {/* ── Carros disponíveis ───────────────────────────────────── */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
              <Car size={16} /> Carros disponíveis
            </h6>
            <div className="input-group" style={{ maxWidth: 260 }}>
              <span className="input-group-text bg-white border-end-0">
                <Search size={14} className="text-muted" />
              </span>
              <input type="text" className="form-control border-start-0 ps-0 form-control-sm"
                placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Marca</th><th>Modelo</th><th>Ano</th><th style={{ width: 120 }}></th></tr>
              </thead>
              <tbody>
                {carrosFiltrados.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-muted py-4">Nenhum carro disponível.</td></tr>
                ) : carrosFiltrados.map(c => (
                  <tr key={c.id}>
                    <td className="fw-medium">{c.marca}</td>
                    <td>{c.modelo}</td>
                    <td className="text-muted">{c.ano}</td>
                    <td>
                      <button className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                        onClick={() => abrirModal(c)}>
                        <PlusCircle size={13} /> Solicitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Meus pedidos ─────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
            <ClipboardList size={16} /> Meus pedidos
          </h6>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Carro</th><th>Período</th><th>Dias</th><th>Status</th></tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-muted py-4">Nenhum pedido encontrado.</td></tr>
                ) : pedidos.map(p => (
                  <tr key={p.id}>
                    <td className="fw-medium">{p.carro}</td>
                    <td className="text-muted small">{p.dataInicio} → {p.dataFim}</td>
                    <td>{p.dias}</td>
                    <td><span className={`badge rounded-pill ${BADGE[p.status]}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal: Solicitar aluguel ──────────────────────────────── */}
      {modalAberto && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold">Solicitar aluguel</h5>
                <button className="btn-close" onClick={fecharModal} />
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  <strong>{carroSelecionado?.marca} {carroSelecionado?.modelo}</strong>
                </p>
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
                {dataInicio && dataFim && new Date(dataFim) > new Date(dataInicio) && (
                  <div className="mt-3 p-2 rounded-2 text-center" style={{ background: '#f0f4ff' }}>
                    <span className="text-muted small">
                      {calcularDias(dataInicio, dataFim)} dia(s) de aluguel
                    </span>
                  </div>
                )}
                {erroModal && <div className="alert alert-danger py-2 small mt-3 mb-0">{erroModal}</div>}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={fecharModal}>Cancelar</button>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-1"
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
  )
}