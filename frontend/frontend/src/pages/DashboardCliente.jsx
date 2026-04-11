import { useState, useEffect } from 'react'
import { Car, PlusCircle, ClipboardList, Search } from 'lucide-react'

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

  //  Função para carregar carros disponíveis
  const carregarCarros = () => {
    fetch('http://localhost:8080/automoveis/disponiveis')
      .then(res => res.json())
      .then(data => setCarros(data))
      .catch(err => console.error('Erro ao buscar carros:', err))
  }

  useEffect(() => {
    carregarCarros()
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

  const calcularDias = () => {
    if (!dataInicio || !dataFim) return 0
    const diff = new Date(dataFim) - new Date(dataInicio)
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

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
      // simula usuario logado com id 1 do banco de dados que no caso seria joao guilherme
      const clienteId = 1

      console.log("Enviando pedido:", {
        clienteId,
        automovelId: carroSelecionado.id,
        dataInicio,
        dataFim
      })

      const response = await fetch('http://localhost:8080/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId,
          automovelId: carroSelecionado.id,
          dataInicio,
          dataFim
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao criar pedido')
      }

      const novoPedido = {
        id: pedidos.length + 1,
        carro: `${carroSelecionado.marca} ${carroSelecionado.modelo}`,
        dataInicio,
        dataFim,
        dias: calcularDias(),
        total: 0,
        status: 'Pendente',
      }

      setPedidos(prev => [novoPedido, ...prev])

      // Atualiza carros disponíveis
      carregarCarros()

      fecharModal()

    } catch (err) {
      console.error(err)
      setErroModal('Erro ao enviar pedido. Verifique o servidor.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-0">
          Olá, {usuario?.nome?.split(' ')[0] || 'Cliente'} 👋
        </h4>
        <p className="text-muted small mb-0">
          Escolha um carro e solicite seu aluguel
        </p>
      </div>

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
              <input
                type="text"
                className="form-control border-start-0 ps-0 form-control-sm"
                placeholder="Buscar marca ou modelo..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Placa</th>
                  <th style={{ width: 130 }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {carrosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      Nenhum carro encontrado.
                    </td>
                  </tr>
                ) : carrosFiltrados.map(carro => (
                  <tr key={carro.id}>
                    <td className="fw-medium">{carro.marca}</td>
                    <td>{carro.modelo}</td>
                    <td className="text-muted">{carro.ano}</td>
                    <td className="text-muted small">{carro.placa}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                        onClick={() => abrirModal(carro)}
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
      </div>

      {/* Modal */}
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
                  <strong>
                    {carroSelecionado?.marca} {carroSelecionado?.modelo}
                  </strong>
                </p>

                <div className="row g-3">
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control"
                      value={dataInicio}
                      onChange={e => setDataInicio(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control"
                      value={dataFim}
                      onChange={e => setDataFim(e.target.value)}
                    />
                  </div>
                </div>

                {erroModal && (
                  <div className="alert alert-danger py-2 small mt-3 mb-0">
                    {erroModal}
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  onClick={handleSolicitarAluguel}
                  disabled={enviando}
                >
                  {enviando
                    ? <span className="spinner-border spinner-border-sm" />
                    : <PlusCircle size={13} />
                  }
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