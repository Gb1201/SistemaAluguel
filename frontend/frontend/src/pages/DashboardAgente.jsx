import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, PlusCircle } from 'lucide-react'

const API_AUTOMOVEIS = 'http://localhost:8080/automoveis'
const API_PEDIDOS    = 'http://localhost:8080/pedidos'

const carroVazio = { marca: '', modelo: '', ano: '', placa: '' }

const BADGE = {
  Pendente:  'text-bg-warning',
  Aprovado:  'text-bg-success',
  Reprovado: 'text-bg-danger',
}

export default function DashboardAgente({ usuario }) {
  const [pedidos, setPedidos]       = useState([])
  const [carros, setCarros]         = useState([])
  const [processando, setProcessando] = useState(null)
  const [modalCarro, setModalCarro] = useState(false)
  const [formCarro, setFormCarro]   = useState(carroVazio)

  const calcularDias = (inicio, fim) => {
    const diff = new Date(fim) - new Date(inicio)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const carregarPedidos = async () => {
    try {
      const res  = await fetch(API_PEDIDOS)
      const data = await res.json()
      const formatados = data.map(p => {
        const dias = calcularDias(p.dataInicio, p.dataFim)
        return {
          id:         p.id,
          cliente:    p.cliente?.nome,
          carro:      `${p.automovel?.marca} ${p.automovel?.modelo}`,
          dataInicio: p.dataInicio,
          dataFim:    p.dataFim,
          dias,
          total:      dias * 100,
          status:
            p.status === 'PENDENTE'  ? 'Pendente'  :
            p.status === 'APROVADO'  ? 'Aprovado'  : 'Reprovado',
        }
      })
      setPedidos(formatados)
    } catch {
      console.error('Erro ao carregar pedidos')
    }
  }

  const carregarAutomoveis = async () => {
    try {
      const res  = await fetch(API_AUTOMOVEIS)
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

  const atualizarStatus = async (id, novoStatus) => {
    setProcessando(id)
    try {
      const response = await fetch(`${API_PEDIDOS}/${id}/status?status=${novoStatus}`, { method: 'PUT' })
      if (!response.ok) throw new Error()
      await carregarPedidos()
      await carregarAutomoveis()
    } catch {
      alert('Erro ao atualizar pedido')
    } finally {
      setProcessando(null)
    }
  }

  const handleCarroChange = (e) => {
    const { name, value } = e.target
    setFormCarro(prev => ({ ...prev, [name]: value }))
  }

  const handleSalvarCarro = async () => {
    try {
      const res = await fetch(API_AUTOMOVEIS, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...formCarro, ano: Number(formCarro.ano) }),
      })
      if (!res.ok) throw new Error()
      setModalCarro(false)
      setFormCarro(carroVazio)
      carregarAutomoveis()
    } catch {
      alert('Erro ao cadastrar carro')
    }
  }

  const pendentes  = pedidos.filter(p => p.status === 'Pendente').length
  const aprovados  = pedidos.filter(p => p.status === 'Aprovado').length
  const reprovados = pedidos.filter(p => p.status === 'Reprovado').length

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-0">Painel do Agente</h4>
          <p className="text-muted small mb-0">Olá, {usuario?.nome ?? 'Agente'}</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setModalCarro(true)}>
          <PlusCircle size={16} /> Novo Carro
        </button>
      </div>

      {/* Cards resumo */}
      <div className="row mb-4">
        {[
          { label: 'Pendentes',  valor: pendentes,     cor: 'text-warning' },
          { label: 'Aprovados',  valor: aprovados,     cor: 'text-success' },
          { label: 'Reprovados', valor: reprovados,    cor: 'text-danger'  },
          { label: 'Carros',     valor: carros.length, cor: 'text-primary' },
        ].map(c => (
          <div className="col" key={c.label}>
            <div className="card p-3 text-center border-0 shadow-sm">
              <h6 className={c.cor}>{c.label}</h6>
              <h4 className="mb-0">{c.valor}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de pedidos */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Pedidos</h6>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>Cliente</th><th>Carro</th><th>Período</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-4">Nenhum pedido.</td></tr>
              ) : pedidos.map(p => (
                <tr key={p.id}>
                  <td className="fw-medium">{p.cliente}</td>
                  <td>{p.carro}</td>
                  <td className="text-muted small">{p.dataInicio} → {p.dataFim}</td>
                  <td><span className={`badge ${BADGE[p.status]}`}>{p.status}</span></td>
                  <td>
                    {p.status === 'Pendente' && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                          onClick={() => atualizarStatus(p.id, 'APROVADO')} disabled={processando === p.id}>
                          {processando === p.id
                            ? <span className="spinner-border spinner-border-sm" />
                            : <CheckCircle size={13} />} Aprovar
                        </button>
                        <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => atualizarStatus(p.id, 'CANCELADO')} disabled={processando === p.id}>
                          <XCircle size={13} /> Reprovar
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

      {/* Tabela de carros */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Carros Cadastrados</h6>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>Marca</th><th>Modelo</th><th>Ano</th><th>Placa</th></tr>
            </thead>
            <tbody>
              {carros.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted py-4">Nenhum carro cadastrado.</td></tr>
              ) : carros.map(c => (
                <tr key={c.id}>
                  <td className="fw-medium">{c.marca}</td>
                  <td>{c.modelo}</td>
                  <td className="text-muted">{c.ano}</td>
                  <td><span className="badge text-bg-secondary">{c.placa}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal cadastro carro */}
      {modalCarro && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold">Cadastrar Carro</h5>
                <button className="btn-close" onClick={() => setModalCarro(false)} />
              </div>
              <div className="modal-body">
                {['marca', 'modelo', 'ano', 'placa'].map(campo => (
                  <input key={campo} className="form-control mb-2"
                    placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                    name={campo} value={formCarro[campo]} onChange={handleCarroChange}
                    type={campo === 'ano' ? 'number' : 'text'} />
                ))}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setModalCarro(false)}>Cancelar</button>
                <button className="btn btn-primary btn-sm" onClick={handleSalvarCarro}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}