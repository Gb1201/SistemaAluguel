import { NavLink, useLocation, Outlet } from 'react-router-dom'
import { useState } from 'react'
import {
  ChevronRight,
  Car,
  ClipboardList,
  Bell,
  LogOut,
  Gauge
} from 'lucide-react'
import './Layout.css'

export default function Layout({ usuario, onLogout }) {
  const loc = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = usuario?.tipo === 'agente'
    ? [
        { to: '/agente', icon: Gauge, label: 'Painel' },
        { to: '/agente', icon: ClipboardList, label: 'Pedidos' }
      ]
    : [
        { to: '/cliente', icon: Car, label: 'Alugar carro' },
        { to: '/cliente', icon: ClipboardList, label: 'Meus Pedidos' }
      ]

  const paginaAtual = () => {
    if (loc.pathname === '/agente') return 'Painel do Agente'
    if (loc.pathname === '/cliente') return 'Alugar Carro'
    return ''
  }

  return (
    <div className="app-shell">

      {/* OVERLAY MOBILE */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Car size={17} strokeWidth={2.2} />
          </div>
          <span className="logo-text">AlugaFácil</span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Menu</span>

          {navItems.map(({ to, icon: Icon, label }, i) => (
            <NavLink
              key={`${to}-${i}`}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `nav-item${isActive ? ' nav-item--active' : ''}`
              }
            >
              <Icon size={15} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {usuario?.nome?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">
                {usuario?.nome ?? 'Usuário'}
              </span>
              <span className="user-role">
                {usuario?.tipo === 'agente' ? 'Agente' : 'Cliente'}
              </span>
            </div>
          </div>

          <button
            className="nav-item w-100 border-0 mt-1"
            style={{ color: 'rgba(245,84,106,0.8)' }}
            onClick={onLogout}
          >
            <LogOut size={14} strokeWidth={1.8} />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-area">
        <header className="topbar">

          {/* BOTÃO MENU MOBILE */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <div className="breadcrumb">
            <span className="breadcrumb-root">AlugaFácil</span>
            <ChevronRight size={12} className="breadcrumb-sep" />
            <span className="breadcrumb-current">
              {paginaAtual()}
            </span>
          </div>

          <div className="topbar-actions">
            <button className="topbar-btn" title="Notificações">
              <Bell size={15} strokeWidth={1.8} />
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}