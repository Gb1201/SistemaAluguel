import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Users, LayoutDashboard, ChevronRight, Building2, Bell, Settings, LogOut, Car, ClipboardList } from 'lucide-react'
import './Layout.css'

export default function Layout({ children, usuario, onLogout }) {
  const location = useNavigate()
  const loc      = useLocation()

  // Não exibe sidebar/topbar nas rotas públicas
  const rotasPublicas = ['/login', '/cadastro']
  const isPublica = rotasPublicas.some(r => loc.pathname.startsWith(r))

  if (isPublica) return <>{children}</>

  // Itens de nav conforme perfil
  const navItems = usuario?.tipo === 'agente'
    ? [{ to: '/agente',  icon: ClipboardList, label: 'Pedidos' }]
    : [{ to: '/cliente', icon: Car,           label: 'Alugar carro' }]

  const paginaAtual = () => {
    if (loc.pathname === '/agente')  return 'Painel do Agente'
    if (loc.pathname === '/cliente') return 'Alugar carro'
    return ''
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><Building2 size={18} /></div>
          <span className="logo-text">AlugaFácil</span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Menu</span>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>
              <Icon size={16} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{usuario?.nome?.[0] ?? 'U'}</div>
            <div className="user-info">
              <span className="user-name">{usuario?.nome ?? 'Usuário'}</span>
              <span className="user-role">{usuario?.tipo === 'agente' ? 'Agente' : 'Cliente'}</span>
            </div>
          </div>
          <button className="nav-item w-100 border-0 mt-1" style={{ color: '#e55' }}
            onClick={onLogout} title="Sair">
            <LogOut size={15} /><span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="breadcrumb-root">AlugaFácil</span>
            <ChevronRight size={13} className="breadcrumb-sep" />
            <span className="breadcrumb-current">{paginaAtual()}</span>
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn" title="Notificações"><Bell size={16} /></button>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}