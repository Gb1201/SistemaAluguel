import { NavLink, useLocation } from 'react-router-dom'
import { Users, LayoutDashboard, ChevronRight, Building2, Bell, Settings } from 'lucide-react'
import './Layout.css'

// Itens de navegação da sidebar
const navItems = [
  { to: '/dashboard', icon: Users, label: 'Clientes' },
]

export default function Layout({ children }) {
  const location = useLocation()

  // Resolve o título da página atual para o breadcrumb
  const paginaAtual = () => {
    if (location.pathname.startsWith('/cadastro-cliente')) return 'Cadastro de Cliente'
    if (location.pathname === '/dashboard') return 'Clientes'
    return ''
  }

  return (
    <div className="app-shell">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Building2 size={18} />
          </div>
          <span className="logo-text">AlugaFácil</span>
        </div>

        {/* Seção de navegação */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">Menu</span>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Rodapé da sidebar */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">G</div>
            <div className="user-info">
              <span className="user-name">Gabriel</span>
              <span className="user-role">Administrador</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Área principal ── */}
      <div className="main-area">

        {/* Topbar */}
        <header className="topbar">
          <div className="breadcrumb">
            <span className="breadcrumb-root">Sistema</span>
            <ChevronRight size={13} className="breadcrumb-sep" />
            <span className="breadcrumb-current">{paginaAtual()}</span>
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn" title="Notificações">
              <Bell size={16} />
            </button>
            <button className="topbar-btn" title="Configurações">
              <Settings size={16} />
            </button>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="page-content">
          {children}
        </main>

      </div>
    </div>
  )
}