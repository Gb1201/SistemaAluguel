import { NavLink, useLocation, Outlet } from 'react-router-dom'
import { ChevronRight, Building2, Bell, LogOut, Car, ClipboardList } from 'lucide-react'
import './Layout.css'

export default function Layout({ usuario, onLogout }) {
  const loc = useLocation()

  const navItems = usuario?.tipo === 'agente'
    ? [{ to: '/agente', icon: ClipboardList, label: 'Pedidos' }]
    : [{ to: '/cliente', icon: Car, label: 'Alugar carro' }]

  const paginaAtual = () => {
    if (loc.pathname === '/agente') return 'Painel do Agente'
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

          <button className="nav-item w-100 border-0 mt-1"
            style={{ color: '#e55' }}
            onClick={onLogout}>
            <LogOut size={15} /><span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>AlugaFácil</span>
            <ChevronRight size={13} />
            <span>{paginaAtual()}</span>
          </div>

          <button className="topbar-btn">
            <Bell size={16} />
          </button>
        </header>

        {/* atualização */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}