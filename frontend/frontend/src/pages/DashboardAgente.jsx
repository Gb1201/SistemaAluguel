import { useState } from 'react'
import { ClipboardList, CheckCircle, XCircle, Eye, PlusCircle, Car } from 'lucide-react'

// Pedidos mockados
const pedidosMock = [
  { id: 1, cliente: 'Ana Souza',      carro: 'Toyota Corolla',   dataInicio: '2025-08-01', dataFim: '2025-08-05', dias: 4, total: 720,  status: 'Pendente'  },
  { id: 2, cliente: 'Carlos Lima',    carro: 'Honda Civic',      dataInicio: '2025-08-03', dataFim: '2025-08-07', dias: 4, total: 800,  status: 'Pendente'  },
  { id: 3, cliente: 'Fernanda Rocha', carro: 'Volkswagen Golf',  dataInicio: '2025-07-28', dataFim: '2025-07-30', dias: 2, total: 320,  status: 'Aprovado'  },
  { id: 4, cliente: 'Marcos Souza',   carro: 'Hyundai HB20',     dataInicio: '2025-07-20', dataFim: '2025-07-22', dias: 2, total: 240,  status: 'Reprovado' },
]

// Carros mockados iniciais
const carrosMock = [
  { id: 1, marca: 'Toyota',     modelo: 'Corolla',   ano: 2022, placa: 'ABC-1234', diaria: 180 },
  { id: 2, marca: 'Honda',      modelo: 'Civic',     ano: 2023, placa: 'DEF-5678', diaria: 200 },
  { id: 3, marca: 'Volkswagen', modelo: 'Golf',      ano: 2021, placa: 'GHI-9012', diaria: 160 },
]

const carroVazio = { marca: '', modelo: '', ano: '', placa: '', diaria: '' }

const BADGE = {
  Pendente:  'text-bg-warning',
  Aprovado:  'text-bg-success',
  Reprovado: 'text-bg-danger',
}

export default function DashboardAgente({ usuario }) {
  const [pedidos, setPedidos]             = useState(pedidosMock)
  const [carros, setCarros]               = useState(carrosMock)
  const [filtro, setFiltro]               = useState('Todos')
  const [abaAtiva, setAbaAtiva]           = useState('pedidos') // 'pedidos' | 'carros'
  const [pedidoDetalhe, setPedidoDetalhe] = useState(null)
  const [processando, setProcessando]     = useState(null)

  // Estado do modal de cadastro de carro
  const [modalCarro, setModalCarro]   = useState(false)
  const [formCarro, setFormCarro]     = useState(carroVazio)
  const [errosCarro, setErrosCarro]   = useState({})
  const [salvandoCarro, setSalvandoCarro] = useState(false)

  // ── Pedidos ──────────────────────────────────────────────────────
  const filtrados = filtro === 'Todos' ? pedidos : pedidos.filter(p => p.status === filtro)

  const atualizarStatus = async (id, novoStatus) => {
    setProcessando(id)
    try {
      // await fetch(`http://localhost:8080/pedidos/${id}/status`, { method: 'PUT', ... })
      await new Promise(r => setTimeout(r, 500))
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: novoStatus } : p))
      if (pedidoDetalhe?.id === id) setPedidoDetalhe(prev => ({ ...prev, status: novoStatus }))
    } catch {
      alert('Não foi possível atualizar o pedido.')
    } finally {
      setProcessando(null)
    }
  }

  // ── Cadastro de carro ────────────────────────────────────────────
  const handleCarroChange = (e) => {
    const { name, value } = e.target
    setFormCarro(prev => ({ ...prev, [name]: value }))
    if (errosCarro[name]) setErrosCarro(prev => ({ ...prev, [name]: '' }))
  }

  const validarCarro = () => {
    const erros = {}
    if (!formCarro.marca.trim())   erros.marca  = 'Obrigatório.'
    if (!formCarro.modelo.trim())  erros.modelo = 'Obrigatório.'
    if (!formCarro.ano)            erros.ano    = 'Obrigatório.'
    if (!formCarro.placa.trim())   erros.placa  = 'Obrigatório.'
    if (!formCarro.diaria)         erros.diaria = 'Obrigatório.'
    setErrosCarro(erros)
    return Object.keys(erros).length === 0
  }

  const handleSalvarCarro = async () => {
    if (!validarCarro()) return
    setSalvandoCarro(true)
    try {
      // ── Substituir por POST real quando backend estiver pronto ──
      // const response = await fetch('http://localhost:8080/carros', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formCarro),
      // })
      // const novoCarro = await response.json()

      await new Promise(r => setTimeout(r, 600))
      const novoCarro = {
        ...formCarro,
        id:     carros.length + 1,
        ano:    Number(formCarro.ano),
        diaria: Number(formCarro.diaria),
      }
      setCarros(prev => [novoCarro, ...prev])
      setModalCarro(false)
      setFormCarro(carroVazio)
      setAbaAtiva('carros') // muda para a aba de carros após cadastrar
    } catch {
      alert('Não foi possível cadastrar o carro.')
    } finally {
      setSalvandoCarro(false)
    }
  }

  const fecharModalCarro = () => {
    setModalCarro(false)
    setFormCarro(carroVazio)
    setErrosCarro({})
  }

  // Métricas
  const pendentes  = pedidos.filter(p => p.status === 'Pendente').length
  const aprovados  = pedidos.filter(p => p.status === 'Aprovado').length
  const reprovados = pedidos.filter(p => p.status === 'Reprovado').length

  return (
    <div className="container py-4">

      {/* Cabeçalho */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-semibold mb-0">Painel do Agente</h4>
          <p className="text-muted small mb-0">Gerencie pedidos e frota de veículos</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setModalCarro(true)}>
          <PlusCircle size={15} /> Cadastrar carro
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Pendentes',  valor: pendentes,      cor: '#fff8e1', texto: '#b45309' },
          { label: 'Aprovados',  valor: aprovados,      cor: '#e8f5e9', texto: '#2e7d32' },
          { label: 'Reprovados', valor: reprovados,     cor: '#fce4e4', texto: '#b91c1c' },
          { label: 'Carros',     valor: carros.length,  cor: '#e8eaf6', texto: '#3949ab' },
        ].map(c => (
          <div className="col-6 col-md-3" key={c.label}>
            <div className="card border-0 h-100" style={{ background: c.cor }}>
              <div className="card-body py-3">
                <div className="small fw-medium mb-1" style={{ color: c.texto }}>{c.label}</div>
                <div className="fs-3 fw-semibold" style={{ color: c.texto }}>{c.valor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link d-flex align-items-center gap-2 ${abaAtiva === 'pedidos' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('pedidos')}>
            <ClipboardList size={15} /> Pedidos
            {pendentes > 0 && (
              <span className="badge text-bg-warning rounded-pill">{pendentes}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link d-flex align-items-center gap-2 ${abaAtiva === 'carros' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('carros')}>
            <Car size={15} /> Carros <span className="badge text-bg-secondary rounded-pill">{carros.length}</span>
          </button>
        </li>
      </ul>

      {/* ── Aba: Pedidos ─────────────────────────────────────────── */}
      {abaAtiva === 'pedidos' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-semibold mb-0">Pedidos de aluguel</h6>
              <div className="d-flex gap-2">
                {['Todos', 'Pendente', 'Aprovado', 'Reprovado'].map(s => (
                  <button key={s}
                    className={`btn btn-sm ${filtro === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltro(s)}>{s}
                  </button>
                ))}
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr><th>#</th><th>Cliente</th><th>Carro</th><th>Período</th><th>Total</th><th>Status</th><th style={{ width: 200 }}>Ações</th></tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-muted py-4">Nenhum pedido encontrado.</td></tr>
                  ) : filtrados.map((p, i) => (
                    <tr key={p.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td className="fw-medium">{p.cliente}</td>
                      <td>{p.carro}</td>
                      <td className="text-muted small">{p.dataInicio} → {p.dataFim}</td>
                      <td className="fw-medium">R$ {p.total.toLocaleString('pt-BR')}</td>
                      <td><span className={`badge rounded-pill ${BADGE[p.status]}`}>{p.status}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                            onClick={() => setPedidoDetalhe(p)}><Eye size={12} /> Ver</button>
                          {p.status === 'Pendente' && (<>
                            <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                              onClick={() => atualizarStatus(p.id, 'Aprovado')} disabled={processando === p.id}>
                              {processando === p.id
                                ? <span className="spinner-border spinner-border-sm" />
                                : <CheckCircle size={12} />} Aprovar
                            </button>
                            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              onClick={() => atualizarStatus(p.id, 'Reprovado')} disabled={processando === p.id}>
                              <XCircle size={12} /> Reprovar
                            </button>
                          </>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Aba: Carros ──────────────────────────────────────────── */}
      {abaAtiva === 'carros' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">Frota cadastrada</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr><th>#</th><th>Marca</th><th>Modelo</th><th>Ano</th><th>Placa</th><th>Diária</th></tr>
                </thead>
                <tbody>
                  {carros.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted py-4">Nenhum carro cadastrado.</td></tr>
                  ) : carros.map((c, i) => (
                    <tr key={c.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td className="fw-medium">{c.marca}</td>
                      <td>{c.modelo}</td>
                      <td className="text-muted">{c.ano}</td>
                      <td><span className="badge text-bg-secondary">{c.placa}</span></td>
                      <td className="text-success fw-medium">R$ {Number(c.diaria).toLocaleString('pt-BR')}/dia</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Cadastrar carro ───────────────────────────────── */}
      {modalCarro && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold d-flex align-items-center gap-2">
                  <Car size={18} /> Cadastrar carro
                </h5>
                <button className="btn-close" onClick={fecharModalCarro} />
              </div>
              <div className="modal-body">
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Marca <span className="text-danger">*</span></label>
                    <input type="text" name="marca"
                      className={`form-control ${errosCarro.marca ? 'is-invalid' : ''}`}
                      placeholder="Ex: Toyota" value={formCarro.marca} onChange={handleCarroChange} />
                    {errosCarro.marca && <div className="invalid-feedback">{errosCarro.marca}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Modelo <span className="text-danger">*</span></label>
                    <input type="text" name="modelo"
                      className={`form-control ${errosCarro.modelo ? 'is-invalid' : ''}`}
                      placeholder="Ex: Corolla" value={formCarro.modelo} onChange={handleCarroChange} />
                    {errosCarro.modelo && <div className="invalid-feedback">{errosCarro.modelo}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Ano <span className="text-danger">*</span></label>
                    <input type="number" name="ano"
                      className={`form-control ${errosCarro.ano ? 'is-invalid' : ''}`}
                      placeholder="Ex: 2023" min="1990" max="2030"
                      value={formCarro.ano} onChange={handleCarroChange} />
                    {errosCarro.ano && <div className="invalid-feedback">{errosCarro.ano}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Placa <span className="text-danger">*</span></label>
                    <input type="text" name="placa"
                      className={`form-control ${errosCarro.placa ? 'is-invalid' : ''}`}
                      placeholder="Ex: ABC-1234" value={formCarro.placa} onChange={handleCarroChange} />
                    {errosCarro.placa && <div className="invalid-feedback">{errosCarro.placa}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium small">Diária (R$) <span className="text-danger">*</span></label>
                    <input type="number" name="diaria"
                      className={`form-control ${errosCarro.diaria ? 'is-invalid' : ''}`}
                      placeholder="Ex: 150" min="0" step="0.01"
                      value={formCarro.diaria} onChange={handleCarroChange} />
                    {errosCarro.diaria && <div className="invalid-feedback">{errosCarro.diaria}</div>}
                  </div>

                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary btn-sm" onClick={fecharModalCarro}>
                  Cancelar
                </button>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                  onClick={handleSalvarCarro} disabled={salvandoCarro}>
                  {salvandoCarro
                    ? <><span className="spinner-border spinner-border-sm" /> Salvando...</>
                    : <><PlusCircle size={13} /> Cadastrar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Detalhes do pedido ────────────────────────────── */}
      {pedidoDetalhe && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-semibold">Pedido #{pedidoDetalhe.id}</h5>
                <button className="btn-close" onClick={() => setPedidoDetalhe(null)} />
              </div>
              <div className="modal-body">
                {[
                  ['Cliente',   pedidoDetalhe.cliente],
                  ['Carro',     pedidoDetalhe.carro],
                  ['Retirada',  pedidoDetalhe.dataInicio],
                  ['Devolução', pedidoDetalhe.dataFim],
                  ['Dias',      pedidoDetalhe.dias],
                  ['Total',     `R$ ${pedidoDetalhe.total.toLocaleString('pt-BR')}`],
                ].map(([k, v]) => (
                  <div key={k} className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-muted small">{k}</span>
                    <span className="fw-medium small">{v}</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between py-2 align-items-center">
                  <span className="text-muted small">Status</span>
                  <span className={`badge rounded-pill ${BADGE[pedidoDetalhe.status]}`}>{pedidoDetalhe.status}</span>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                {pedidoDetalhe.status === 'Pendente' && (<>
                  <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                    onClick={() => atualizarStatus(pedidoDetalhe.id, 'Aprovado')} disabled={!!processando}>
                    <CheckCircle size={13} /> Aprovar
                  </button>
                  <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => atualizarStatus(pedidoDetalhe.id, 'Reprovado')} disabled={!!processando}>
                    <XCircle size={13} /> Reprovar
                  </button>
                </>)}
                <button className="btn btn-secondary btn-sm" onClick={() => setPedidoDetalhe(null)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}