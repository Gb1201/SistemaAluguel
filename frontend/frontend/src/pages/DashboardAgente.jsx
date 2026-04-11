import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, PlusCircle } from 'lucide-react'

const API_AUTOMOVEIS = 'http://localhost:8080/automoveis'
const API_PEDIDOS = 'http://localhost:8080/pedidos'

const carroVazio = { marca: '', modelo: '', ano: '', placa: '' }

const BADGE = {
  Pendente: 'text-bg-warning',
  Aprovado: 'text-bg-success',
  Reprovado: 'text-bg-danger',
}

export default function DashboardAgente() {
  const [pedidos, setPedidos] = useState([])
  const [carros, setCarros] = useState([])
  const [processando, setProcessando] = useState(null)

  const [modalCarro, setModalCarro] = useState(false)
  const [formCarro, setFormCarro] = useState(carroVazio)

  //  calcular dias
  const calcularDias = (inicio, fim) => {
    const diff = new Date(fim) - new Date(inicio)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  //  carregar pedidos
  const carregarPedidos = async () => {
    try {
      const res = await fetch(API_PEDIDOS)
      const data = await res.json()

      const formatados = data.map(p => {
        const dias = calcularDias(p.dataInicio, p.dataFim)

        return {
          id: p.id,
          cliente: p.cliente?.nome,
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
              : 'Reprovado',
        }
      })

      setPedidos(formatados)
    } catch {
      console.error('Erro ao carregar pedidos')
    }
  }

  //  carregar carros
  const carregarAutomoveis = async () => {
    try {
      const res = await fetch(API_AUTOMOVEIS)
      const data = await res.json()
      setCarros(data)
    } catch {
      console.error('Erro ao carregar carros')
    }
  }

  useEffect(() => {
    carregarPedidos()
    carregarAutomoveis()
  }, [])

  //  APROVAR / REPROVAR
  const atualizarStatus = async (id, novoStatus) => {
    setProcessando(id)

    try {
      const response = await fetch(
        `${API_PEDIDOS}/${id}/status?status=${novoStatus}`,
        { method: 'PUT' }
      )

      if (!response.ok) throw new Error()

      await carregarPedidos()
      await carregarAutomoveis()

    } catch {
      alert('Erro ao atualizar pedido')
    } finally {
      setProcessando(null)
    }
  }

  // cadastro carro
  const handleCarroChange = (e) => {
    const { name, value } = e.target
    setFormCarro(prev => ({ ...prev, [name]: value }))
  }

  const handleSalvarCarro = async () => {
    try {
      const res = await fetch(API_AUTOMOVEIS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formCarro,
          ano: Number(formCarro.ano),
        }),
      })

      if (!res.ok) throw new Error()

      setModalCarro(false)
      setFormCarro(carroVazio)
      carregarAutomoveis()

    } catch {
      alert('Erro ao cadastrar carro')
    }
  }

  const pendentes = pedidos.filter(p => p.status === 'Pendente').length
  const aprovados = pedidos.filter(p => p.status === 'Aprovado').length
  const reprovados = pedidos.filter(p => p.status === 'Reprovado').length

  return (
    <div className="container py-4">

      <h4 className="mb-4">Painel do Agente</h4>

      {/* Botão cadastrar carro */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setModalCarro(true)}
      >
        <PlusCircle size={16} /> Novo Carro
      </button>

      {/* CARDS COM LEGENDA */}
      <div className="row mb-4">

        <div className="col">
          <div className="card p-3 text-center">
            <h6 className="text-warning">Pendentes</h6>
            <h4>{pendentes}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card p-3 text-center">
            <h6 className="text-success">Aprovados</h6>
            <h4>{aprovados}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card p-3 text-center">
            <h6 className="text-danger">Reprovados</h6>
            <h4>{reprovados}</h4>
          </div>
        </div>

        <div className="col">
          <div className="card p-3 text-center">
            <h6>Carros</h6>
            <h4>{carros.length}</h4>
          </div>
        </div>

      </div>

      {/* Tabela de pedidos */}
      <div className="card mb-4">
        <div className="card-body">
          <h6>Pedidos</h6>

          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Carro</th>
                <th>Período</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td>{p.cliente}</td>
                  <td>{p.carro}</td>
                  <td>{p.dataInicio} → {p.dataFim}</td>

                  <td>
                    <span className={`badge ${BADGE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>

                  <td>
                    {p.status === 'Pendente' && (
                      <div className="d-flex gap-2">

                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => atualizarStatus(p.id, 'APROVADO')}
                          disabled={processando === p.id}
                        >
                          {processando === p.id
                            ? '...'
                            : <CheckCircle size={14} />}
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => atualizarStatus(p.id, 'CANCELADO')}
                          disabled={processando === p.id}
                        >
                          <XCircle size={14} />
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

      {/* 🚗 TABELA DE CARROS */}
      <div className="card">
        <div className="card-body">
          <h6>Carros Cadastrados</h6>

          <table className="table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Ano</th>
                <th>Placa</th>
              </tr>
            </thead>

            <tbody>
              {carros.map(c => (
                <tr key={c.id}>
                  <td>{c.marca}</td>
                  <td>{c.modelo}</td>
                  <td>{c.ano}</td>
                  <td>{c.placa}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL CADASTRO CARRO */}
      {modalCarro && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Cadastrar Carro</h5>
                <button className="btn-close" onClick={() => setModalCarro(false)} />
              </div>

              <div className="modal-body">

                <input
                  className="form-control mb-2"
                  placeholder="Marca"
                  name="marca"
                  value={formCarro.marca}
                  onChange={handleCarroChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Modelo"
                  name="modelo"
                  value={formCarro.modelo}
                  onChange={handleCarroChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Ano"
                  name="ano"
                  value={formCarro.ano}
                  onChange={handleCarroChange}
                />

                <input
                  className="form-control"
                  placeholder="Placa"
                  name="placa"
                  value={formCarro.placa}
                  onChange={handleCarroChange}
                />

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalCarro(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-success"
                  onClick={handleSalvarCarro}
                >
                  Salvar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}