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
  const [errosCarro, setErrosCarro] = useState({})

  // 🔢 calcular dias
  const calcularDias = (inicio, fim) => {
    const diff = new Date(fim) - new Date(inicio)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // 🔄 carregar pedidos
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

  // 🚗 carregar carros
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

  // ✅ APROVAR / REPROVAR
  const atualizarStatus = async (id, novoStatus) => {
    setProcessando(id)

    try {
      const response = await fetch(
        `${API_PEDIDOS}/${id}/status?status=${novoStatus}`,
        { method: 'PUT' }
      )

      if (!response.ok) throw new Error()

      // 🔥 recarrega tudo
      await carregarPedidos()
      await carregarAutomoveis()

    } catch {
      alert('Erro ao atualizar pedido')
    } finally {
      setProcessando(null)
    }
  }

  // 🚗 cadastro carro
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

      {/* Cards */}
      <div className="row mb-4">
        {[pendentes, aprovados, reprovados, carros.length].map((v, i) => (
          <div key={i} className="col">
            <div className="card p-3 text-center">{v}</div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="card">
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

    </div>
  )
}