import { useState, useEffect } from 'react'
import { Car, PlusCircle, ClipboardList, Search } from 'lucide-react'

// Dados mockados de carros disponíveis — substituir por GET real futuramente
const carrosMock = [
  { id: 1, marca: 'Toyota',     modelo: 'Corolla',   ano: 2022, diaria: 180, placa: 'ABC-1234' },
  { id: 2, marca: 'Honda',      modelo: 'Civic',     ano: 2023, diaria: 200, placa: 'DEF-5678' },
  { id: 3, marca: 'Volkswagen', modelo: 'Golf',      ano: 2021, diaria: 160, placa: 'GHI-9012' },
  { id: 4, marca: 'Hyundai',    modelo: 'HB20',      ano: 2023, diaria: 120, placa: 'JKL-3456' },
  { id: 5, marca: 'Chevrolet',  modelo: 'Onix',      ano: 2022, diaria: 110, placa: 'MNO-7890' },
  { id: 6, marca: 'Ford',       modelo: 'Territory', ano: 2023, diaria: 220, placa: 'PQR-1111' },
]

export default function DashboardCliente({ usuario }) {
  const [carros, setCarros]         = useState(carrosMock)
  const [busca, setBusca]           = useState('')
  const [pedidos, setPedidos]       = useState([])
  const [carroSelecionado, setCarroSelecionado] = useState(null)
  const [modalAberto, setModalAberto]           = useState(false)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim]       = useState('')
  const [erroModal, setErroModal]   = useState('')
  const [enviando, setEnviando]     = useState(false)

  // Filtra carros pelo nome/marca em tempo real
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

  const calcularDias = () => {
    if (!dataInicio || !dataFim) return 0
    const diff = new Date(dataFim) - new Date(dataInicio)
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const handleSolicitarAluguel = async () => {
    if (!dataInicio || !dataFim) { setErroModal('Informe as datas.'); return }
    if (new Date(dataFim) <= new Date(dataInicio)) { setErroModal('Data de devolução deve ser após a retirada.'); return }

    setEnviando(true)
    setErroModal('')

    try {
      // ── Substituir por POST real quando backend estiver pronto ──
      // await fetch('http://localhost:8080/pedidos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ carroId: carroSelecionado.id, clienteId: usuario.id, dataInicio, dataFim }),
      // })

      await new Promise(r => setTimeout(r, 600)) // simula latência

      const novoPedido = {
        id:         pedidos.length + 1,
        carro:      `${carroSelecionado.marca} ${carroSelecionado.modelo}`,
        dataInicio,
        dataFim,
        dias:       calcularDias(),
        total:      calcularDias() * carroSelecionado.diaria,
        status:     'Pendente',
      }

      setPedidos(prev => [novoPedido, ...prev])
      fecharModal()

    } catch (err) {
      setErroModal('Não foi possível enviar o pedido.')
    } finally {
      setEnviando(false)
    }
  }

  const dias = calcularDias()

  return (
    <div className="container py-4">

      {/* Saudação */}
      <div className="mb-4">
        <h4 className="fw-semibold mb-0">Olá, {usuario?.nome?.split(' ')[0]} 👋</h4>
        <p className="text-muted small mb-0">Escolha um carro e solicite seu aluguel</p>
      </div>

      {/* ── Seção: Carros disponíveis ── */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
              <Car size={16} className="text-primary" /> Carros disponíveis
            </h6>
            <div className="input-group" style={{ maxWidth: 260 }}>
              <span className="input-group-text bg-white border-end-0">
                <Search size={14} className="text-muted" />
              </span>
              <input type="text" className="form-control border-start-0 ps-0 form-control-sm"
                placeholder="Buscar marca ou modelo..."
                value={busca} onChange={e => setBusca(e.target.value)} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Diária</th>
                  <th>Placa</th>
                  <th style={{ width: 130 }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {carrosFiltrados.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted py-4">Nenhum carro encontrado.</td></tr>
                ) : carrosFiltrados.map(carro => (
                  <tr key={carro.id}>
                    <td className="fw-medium">{carro.marca}</td>
                    <td>{carro.modelo}</td>
                    <td className="text-muted">{carro.ano}</td>
                    <td className="text-success fw-medium">R$ {carro.diaria}/dia</td>
                    <td className="text-muted small">{carro.placa}</td>
                    <td>
                      <button className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                        onClick={() => abrirModal(carro)}>
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

      {/* ── Seção: Meus pedidos ── */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
            <ClipboardList size={16} className="text-primary" /> Meus pedidos
          </h6>

          {pedidos.length === 0 ? (
            <p className="text-muted small text-center py-3 mb-0">Você ainda não fez nenhum pedido.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Carro</th><th>Retirada</th><th>Devolução</th><th>Dias</th><th>Total</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p, i) => (
                    <tr key={p.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td className="fw-medium">{p.carro}</td>
                      <td className="text-muted small">{p.dataInicio}</td>
                      <td className="text-muted small">{p.dataFim}</td>
                      <td>{p.dias}</td>
                      <td className="fw-medium">R$ {p.total.toLocaleString('pt-BR')}</td>
                      <td>
                        <span className={`badge rounded-pill ${
                          p.status === 'Aprovado'   ? 'text-bg-success' :
                          p.status === 'Reprovado'  ? 'text-bg-danger'  : 'text-bg-warning'
                        }`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Solicitar aluguel ── */}
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
                  {' '}— R$ {carroSelecionado?.diaria}/dia
                </p>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label fw-medium small">Data de retirada</label>
                    <input type="date" className="form-control"
                      value={dataInicio} onChange={e => { setDataInicio(e.target.value); setErroModal('') }}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium small">Data de devolução</label>
                    <input type="date" className="form-control"
                      value={dataFim} onChange={e => { setDataFim(e.target.value); setErroModal('') }}
                      min={dataInicio || new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                {dias > 0 && (
                  <div className="mt-3 p-3 rounded-2 text-center" style={{ background: '#f0f4ff' }}>
                    <span className="text-muted small">{dias} dia(s) · </span>
                    <strong className="text-primary">
                      Total: R$ {(dias * carroSelecionado.diaria).toLocaleString('pt-BR')}
                    </strong>
                  </div>
                )}
                {erroModal && <div className="alert alert-danger py-2 small mt-3 mb-0">{erroModal}</div>}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={fecharModal}>Cancelar</button>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  onClick={handleSolicitarAluguel} disabled={enviando}>
                  {enviando
                    ? <span className="spinner-border spinner-border-sm" role="status" />
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