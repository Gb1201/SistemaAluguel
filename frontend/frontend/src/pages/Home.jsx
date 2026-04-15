import { useNavigate } from 'react-router-dom'
import { Car, Shield, ClipboardList, Users, CheckCircle, ArrowRight } from 'lucide-react'

const funcionalidades = [
  {
    icon: <Users size={22} color="#4f6ef7" />,
    titulo: 'Cadastro de Clientes',
    descricao: 'Clientes podem criar sua conta com dados pessoais e rendimentos diretamente pelo sistema.',
  },
  {
    icon: <Car size={22} color="#4f6ef7" />,
    titulo: 'Frota de Veículos',
    descricao: 'Agentes cadastram e gerenciam os automóveis disponíveis para aluguel na plataforma.',
  },
  {
    icon: <ClipboardList size={22} color="#4f6ef7" />,
    titulo: 'Pedidos de Aluguel',
    descricao: 'Clientes solicitam aluguéis escolhendo o carro e o período desejado com poucos cliques.',
  },
  {
    icon: <CheckCircle size={22} color="#4f6ef7" />,
    titulo: 'Aprovação pelo Agente',
    descricao: 'Agentes analisam e aprovam ou reprovam cada pedido, mantendo controle total da operação.',
  },
  {
    icon: <Shield size={22} color="#4f6ef7" />,
    titulo: 'Acesso por Perfil',
    descricao: 'Sistema com dois perfis distintos: cliente e agente, cada um com sua tela personalizada.',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        .home-root {
          min-height: 100vh;
          background: #f4f5f9;
          font-family: 'DM Sans', sans-serif;
        }
        .home-navbar {
          background: #fff;
          border-bottom: 1px solid #e8eaf0;
          padding: 0 40px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .home-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 700;
          color: #1a1d2e;
          text-decoration: none;
        }
        .home-logo-icon {
          width: 34px; height: 34px;
          background: #4f6ef7;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .btn-entrar {
          background: #4f6ef7;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, transform 0.1s;
        }
        .btn-entrar:hover { background: #3a57e0; transform: translateY(-1px); }
        .home-hero {
          background: linear-gradient(135deg, #1e2540 0%, #0f1117 100%);
          padding: 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .home-hero::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(79,110,247,0.25) 0%, transparent 70%);
        }
        .home-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(79,110,247,0.15);
          border: 1px solid rgba(79,110,247,0.3);
          color: #a5b4fc;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 20px;
        }
        .home-hero h1 {
          font-size: 48px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 16px;
          letter-spacing: -1px;
        }
        .home-hero h1 span { color: #6c8ef7; }
        .home-hero p {
          font-size: 16px;
          color: #8b92a8;
          max-width: 520px;
          margin: 0 auto 32px;
          line-height: 1.7;
        }
        .btn-hero-cta {
          background: #4f6ef7;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 20px rgba(79,110,247,0.4);
        }
        .btn-hero-cta:hover {
          background: #3a57e0;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(79,110,247,0.5);
        }
        .home-features {
          padding: 64px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .home-features-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #1a1d2e;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .home-features-sub {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 40px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .feature-card {
          background: #fff;
          border: 1px solid #e8eaf0;
          border-radius: 14px;
          padding: 24px;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .feature-card:hover {
          box-shadow: 0 6px 24px rgba(79,110,247,0.1);
          border-color: #c5cffa;
          transform: translateY(-3px);
        }
        .feature-icon {
          width: 44px; height: 44px;
          background: #eef1ff;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
        }
        .feature-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d2e;
          margin: 0 0 8px;
        }
        .feature-card p {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }
        .home-footer {
          text-align: center;
          padding: 28px;
          border-top: 1px solid #e8eaf0;
          font-size: 12px;
          color: #9ca3af;
          background: #fff;
        }
      `}</style>

      <div className="home-root">

        {/* Navbar */}
        <nav className="home-navbar">
          <div className="home-logo">
            <div className="home-logo-icon">
              <Car size={18} color="#fff" />
            </div>
             AlugaFácil
          </div>
          <button className="btn-entrar" onClick={() => navigate('/login')}>
            Entrar <ArrowRight size={14} />
          </button>
        </nav>

        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-badge">
            <Car size={12} /> Sistema de Aluguel de Veículos
          </div>
          <h1>Alugue com <span>facilidade</span>,<br />gerencie com controle</h1>
          <p>
            Plataforma completa para locação de automóveis, do cadastro do cliente
            à aprovação do pedido pelo agente, tudo em um só lugar.
          </p>
          <button className="btn-hero-cta" onClick={() => navigate('/login')}>
            Começar agora <ArrowRight size={16} />
          </button>
        </section>

        {/* Funcionalidades */}
        <section className="home-features">
          <h2 className="home-features-title">Tudo que você precisa</h2>
          <p className="home-features-sub">Funcionalidades pensadas para clientes e agentes</p>
          <div className="feature-grid">
            {funcionalidades.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.titulo}</h3>
                <p>{f.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          © {new Date().getFullYear()} AlugaFácil — Sistema de Locação de Veículos
        </footer>

      </div>
    </>
  )
}