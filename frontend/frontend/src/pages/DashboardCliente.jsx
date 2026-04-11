import { useState, useEffect } from 'react'
import { Car, PlusCircle, ClipboardList, Search } from 'lucide-react'

const API_CARROS = 'http://localhost:8080/automoveis/disponiveis'
const API_PEDIDOS = 'http://localhost:8080/pedidos'

export default function DashboardCliente({ usuario }) {
  const [carros, setCarros] = useState([])
  const [busca, setBusca] = useState('')
  const [pedidos, setPedidos] = useState([])
  const [carroSelecionado, setCarroSelecionado] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [erroModal, setErroModal] = useState('')
  const [enviando, setEnviando] = useState(false)

  const clienteId = 1 // simulação usuário logado

  // ── Calcular dias ─────────────────────────────
  const calcularDias = (inicio, fim) => {
    const diff = new Date(fim) - new Date(inicio)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // ── Buscar carros ─────────────────────────────
  const carregarCarros = async () => {
    try {
      const res = await fetch(API_CARROS)
      const data = await res.json()
      setCarros(data)
    } catch (err) {
      console.error('Erro ao buscar carros:', err)
    }
  }

  // ── Buscar pedidos do cliente ─────────────────
  const carregarPedidos = async () => {
    try {
      const res = await fetch(API_PEDIDOS)
      const data = await res.json()

      const meusPedidos = data
        .filter(p => p.cliente?.id === clienteId)
        .map(p => {
          const dias = calcularDias(p.dataInicio, p.dataFim)

          return {
            id: p.id,
            carro: `${p.automovel?.marca} ${p.automovel?.modelo}`,
            dataInicio: p.dataInicio,
            dataFim: p.dataFim,
            dias,
            total: dias * 100,
            status:
              p.status === 'PENDENTE'
                ? 'Pendente'
                : p.status === 'APROVADO'
                ? 'Aprovado'
                : 'Cancelado'
          }
        })

      setPedidos(meusPedidos)

    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    }
  }

  useEffect(() => {
    carregarCarros()
    carregarPedidos()
  }, [])

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

  // ── Criar pedido ─────────────────────────────
  const handleSolicitarAluguel = async () => {
    if (!dataInicio || !dataFim) {
      setErroModal('Informe as datas.')
      return
    }

    if (new Date(dataFim) <= new Date(dataInicio)) {
      setErroModal('Data de devolução deve ser após a retirada.')
      return
    }

    setEnviando(true)
    setErroModal('')

    try {
      const response = await fetch(API_PEDIDOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId,
          automovelId: carroSelecionado.id,
          dataInicio,
          dataFim
        })
      })

      if (!response.ok) throw new Error()

      // 🔥 Atualiza tudo corretamente
      await carregarPedidos()
      await carregarCarros()

      fecharModal()

    } catch (err) {
      console.error(err)
      setErroModal('Erro ao enviar pedido.')
    } finally {
      setEnviando(false)
    }
  }

  const BADGE = {
    Pendente: 'text-bg-warning',
    Aprovado: 'text-bg-success',
    Cancelado: 'text-bg-danger'
  }

  return (
    <div className="container py-4">

      {/* Cabeçalho */}
      <div className="mb-4">
        <h4 className="fw-semibold mb-0">
          Olá, {usuario?.nome?.split(' ')[0] || 'Cliente'} 👋
        </h4>
        <p className="text-muted small mb-0">
          Escolha um carro e acompanhe seus pedidos
        </p>
      </div>

      {/* ── CARROS ───────────────────────────── */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">

          <div className="d-flex justify-content-between mb-3">
            <h6 className="fw-semibold d-flex align-items-center gap-2">
              <Car size={16} /> Carros disponíveis
            </h6>

            <input
              type="text"
              className="form-control form-control-sm"
              style={{ maxWidth: 250 }}
              placeholder="Buscar..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Ano</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {carrosFiltrados.map(c => (
                <tr key={c.id}>
                  <td>{c.marca}</td>
                  <td>{c.modelo}</td>
                  <td>{c.ano}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => abrirModal(c)}
                    >
                      <PlusCircle size={13} /> Solicitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

      {/* ── MEUS PEDIDOS ─────────────────────── */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
            <ClipboardList size={16} /> Meus pedidos
          </h6>

          <table className="table table-hover">
            <thead>
              <tr>
                <th>Carro</th>
                <th>Período</th>
                <th>Dias</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : pedidos.map(p => (
                <tr key={p.id}>
                  <td>{p.carro}</td>
                  <td>{p.dataInicio} → {p.dataFim}</td>
                  <td>{p.dias}</td>
                  <td>
                    <span className={`badge ${BADGE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

      {/* ── MODAL ───────────────────────────── */}
      {modalAberto && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Solicitar aluguel</h5>
                <button className="btn-close" onClick={fecharModal} />
              </div>

              <div className="modal-body">
                <input type="date" className="form-control mb-2"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)} />

                <input type="date" className="form-control"
                  value={dataFim}
                  onChange={e => setDataFim(e.target.value)} />

                {erroModal && <div className="text-danger mt-2">{erroModal}</div>}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={fecharModal}>
                  Cancelar
                </button>

                <button className="btn btn-primary" onClick={handleSolicitarAluguel}>
                  {enviando ? 'Enviando...' : 'Confirmar'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}