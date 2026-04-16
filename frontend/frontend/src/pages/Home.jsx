import { useNavigate } from 'react-router-dom'
import { Car, Shield, ClipboardList, Users, CheckCircle, ArrowRight, Zap } from 'lucide-react'

const funcionalidades = [
  {
    icon: <Users size={20} />,
    titulo: 'Cadastro de Clientes',
    descricao: 'Crie sua conta com dados pessoais e rendimentos em segundos. Processo simples e seguro.',
    tag: 'Onboarding',
  },
  {
    icon: <Car size={20} />,
    titulo: 'Frota de Veículos',
    descricao: 'Agentes gerenciam a frota disponível em tempo real, com cadastro rápido e controle total.',
    tag: 'Gestão',
  },
  {
    icon: <ClipboardList size={20} />,
    titulo: 'Pedidos de Aluguel',
    descricao: 'Solicite aluguéis escolhendo o carro e período desejado, tudo com poucos cliques.',
    tag: 'Reservas',
  },
  {
    icon: <CheckCircle size={20} />,
    titulo: 'Aprovação pelo Agente',
    descricao: 'Agentes analisam e aprovam pedidos em tempo real, mantendo o controle da operação.',
    tag: 'Workflow',
  },
  {
    icon: <Shield size={20} />,
    titulo: 'Acesso por Perfil',
    descricao: 'Dois perfis distintos — cliente e agente — cada um com painel personalizado e seguro.',
    tag: 'Segurança',
  },
  {
    icon: <Zap size={20} />,
    titulo: 'Tempo Real',
    descricao: 'Disponibilidade de veículos e status de pedidos atualizados instantaneamente no sistema.',
    tag: 'Performance',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .hm-root {
          min-height: 100vh;
          background: #06080e;
          font-family: 'Sora', sans-serif;
          color: #f0f2f8;
          overflow-x: hidden;
        }

        /* ── Navbar ── */
        .hm-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 56px;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: sticky; top: 0; z-index: 100;
          background: rgba(6,8,14,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .hm-nav-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none;
        }
        .hm-nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(232,164,59,0.4);
        }
        .hm-nav-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 600;
          color: #f0f2f8;
        }
        .hm-nav-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; font-weight: 500;
          background: rgba(232,164,59,0.12);
          border: 1px solid rgba(232,164,59,0.25);
          color: #e8a43b;
          padding: 2px 8px; border-radius: 20px;
          letter-spacing: 0.5px;
        }
        .hm-btn-nav {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 22px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border: none; border-radius: 9px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #000; cursor: pointer;
          box-shadow: 0 4px 16px rgba(232,164,59,0.3);
          transition: all 0.2s;
          letter-spacing: 0.2px;
        }
        .hm-btn-nav:hover {
          box-shadow: 0 6px 24px rgba(232,164,59,0.5);
          transform: translateY(-1px);
        }

        /* ── Hero ── */
        .hm-hero {
          position: relative;
          padding: 110px 56px 100px;
          text-align: center;
          overflow: hidden;
        }

        /* Background grid */
        .hm-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(232,164,59,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,164,59,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%);
          pointer-events: none;
        }

        /* Orb */
        .hm-hero-orb {
          position: absolute;
          top: -120px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(232,164,59,0.14) 0%, rgba(232,100,59,0.06) 40%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
        }

        .hm-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(232,164,59,0.08);
          border: 1px solid rgba(232,164,59,0.2);
          color: #e8a43b;
          font-size: 11.5px; font-weight: 600;
          padding: 5px 14px; border-radius: 20px;
          margin-bottom: 28px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .hm-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 7vw, 78px);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -1.5px;
          margin: 0 0 24px;
          color: #f0f2f8;
        }
        .hm-hero h1 em {
          font-style: italic;
          color: #e8a43b;
        }
        .hm-hero-sub {
          font-size: 16px;
          color: #8b94b0;
          max-width: 540px;
          margin: 0 auto 44px;
          line-height: 1.75;
          font-weight: 300;
        }

        .hm-hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 36px;
          background: linear-gradient(135deg, #e8a43b, #c27f22);
          border: none; border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #000; cursor: pointer;
          box-shadow: 0 8px 32px rgba(232,164,59,0.4);
          transition: all 0.22s;
          letter-spacing: 0.3px;
        }
        .hm-hero-cta:hover {
          box-shadow: 0 14px 48px rgba(232,164,59,0.6);
          transform: translateY(-3px);
        }

        .hm-hero-stats {
          display: flex; align-items: center; justify-content: center;
          gap: 40px; margin-top: 64px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-wrap: wrap;
        }
        .hm-stat-item { text-align: center; }
        .hm-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 700;
          color: #e8a43b; line-height: 1;
        }
        .hm-stat-label { font-size: 12px; color: #4a5270; margin-top: 5px; letter-spacing: 0.5px; }
        .hm-stat-sep { width: 1px; height: 40px; background: rgba(255,255,255,0.07); }

        /* ── Features ── */
        .hm-features {
          padding: 80px 56px;
          max-width: 1160px;
          margin: 0 auto;
        }

        .hm-feat-header {
          text-align: center; margin-bottom: 52px;
        }
        .hm-feat-pre {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; font-weight: 500;
          color: #e8a43b; letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .hm-feat-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 700;
          color: #f0f2f8; margin-bottom: 10px;
          letter-spacing: -0.5px;
        }
        .hm-feat-sub { font-size: 14px; color: #4a5270; font-weight: 300; }

        .hm-feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 18px;
        }

        .hm-feat-card {
          background: #0d1018;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .hm-feat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(232,164,59,0.3), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .hm-feat-card:hover {
          border-color: rgba(232,164,59,0.2);
          box-shadow: 0 8px 40px rgba(232,164,59,0.08);
          transform: translateY(-4px);
        }
        .hm-feat-card:hover::before { opacity: 1; }

        .hm-feat-icon-wrap {
          width: 42px; height: 42px;
          background: rgba(232,164,59,0.1);
          border: 1px solid rgba(232,164,59,0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #e8a43b;
          margin-bottom: 16px;
        }
        .hm-feat-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; font-weight: 500;
          color: #4a5270; letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px; display: block;
        }
        .hm-feat-card h3 { font-size: 14px; font-weight: 600; color: #f0f2f8; margin: 0 0 8px; }
        .hm-feat-card p { font-size: 13px; color: #4a5270; line-height: 1.65; margin: 0; font-weight: 300; }

        /* ── CTA Banner ── */
        .hm-cta-band {
          margin: 0 56px 80px;
          background: linear-gradient(135deg, #1a1400, #12100a);
          border: 1px solid rgba(232,164,59,0.2);
          border-radius: 20px;
          padding: 52px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hm-cta-band::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 400px; height: 200px;
          background: radial-gradient(ellipse, rgba(232,164,59,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .hm-cta-band h2 {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 700;
          color: #f0f2f8; margin-bottom: 10px;
        }
        .hm-cta-band p { font-size: 14px; color: #4a5270; margin-bottom: 28px; font-weight: 300; }

        /* ── Footer ── */
        .hm-footer {
          text-align: center; padding: 28px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 12px; color: #2e3450;
          background: #06080e;
        }
      `}</style>

      <div className="hm-root">
        {/* Navbar */}
        <nav className="hm-nav">
          <div className="hm-nav-logo">
            <div className="hm-nav-logo-icon">
              <Car size={18} color="#000" strokeWidth={2.2} />
            </div>
            <span className="hm-nav-logo-text">AlugaFácil</span>
            <span className="hm-nav-badge">v2.0</span>
          </div>
          <button className="hm-btn-nav" onClick={() => navigate('/login')}>
            Entrar <ArrowRight size={14} />
          </button>
        </nav>

        {/* Hero */}
        <section className="hm-hero">
          <div className="hm-hero-orb" />
          <div className="hm-hero-eyebrow">
            <Car size={11} /> Sistema de Locação de Veículos
          </div>
          <h1>
            Alugue com <em>elegância</em>,<br />
            gerencie com precisão
          </h1>
          <p className="hm-hero-sub">
            Plataforma premium para locação de automóveis. Do cadastro do cliente
            à aprovação pelo agente — tudo centralizado, tudo em tempo real.
          </p>
          <button className="hm-hero-cta" onClick={() => navigate('/login')}>
            Começar agora <ArrowRight size={16} />
          </button>

          <div className="hm-hero-stats">
            {[
              { num: '100%', label: 'DIGITAL'    },
              null,
              { num: '2',    label: 'PERFIS'      },
              null,
              { num: '∞',    label: 'VEÍCULOS'    },
              null,
              { num: '24/7', label: 'DISPONÍVEL'  },
            ].map((s, i) =>
              s === null
                ? <div key={i} className="hm-stat-sep" />
                : (
                  <div key={i} className="hm-stat-item">
                    <div className="hm-stat-num">{s.num}</div>
                    <div className="hm-stat-label">{s.label}</div>
                  </div>
                )
            )}
          </div>
        </section>

        {/* Features */}
        <section className="hm-features">
          <div className="hm-feat-header">
            <p className="hm-feat-pre">Funcionalidades</p>
            <h2 className="hm-feat-title">Tudo que você precisa</h2>
            <p className="hm-feat-sub">Pensado para clientes e agentes, do primeiro acesso ao controle total</p>
          </div>
          <div className="hm-feat-grid">
            {funcionalidades.map((f, i) => (
              <div key={i} className="hm-feat-card">
                <div className="hm-feat-icon-wrap">{f.icon}</div>
                <span className="hm-feat-tag">{f.tag}</span>
                <h3>{f.titulo}</h3>
                <p>{f.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Band */}
        <div className="hm-cta-band">
          <h2>Pronto para começar?</h2>
          <p>Crie sua conta em menos de 2 minutos e acesse a plataforma.</p>
          <button className="hm-hero-cta" style={{ fontSize: 14, padding: '13px 30px' }}
            onClick={() => navigate('/cadastro')}>
            Criar conta grátis <ArrowRight size={15} />
          </button>
        </div>

        <footer className="hm-footer">
          © {new Date().getFullYear()} AlugaFácil — Sistema de Locação de Veículos
        </footer>
      </div>
    </>
  )
}