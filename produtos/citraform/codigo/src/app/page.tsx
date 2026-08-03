import { ArrowRight, Sparkles, GitBranch, Gauge } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Formulários conversacionais',
    desc: 'Uma pergunta por vez, tela cheia, com a identidade visual do cliente aplicada — sem código.',
  },
  {
    icon: GitBranch,
    title: 'Lógica condicional',
    desc: 'Jump logic e pontuação de lead nativas, com telas finais e eventos de tracking condicionados ao resultado.',
  },
  {
    icon: Gauge,
    title: 'Motor único, três entregas',
    desc: 'SaaS puro, embed universal ou domínio próprio via CNAME — sem duplicar lógica entre modos.',
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100dvh', background: C.cream, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'oklch(97.5% 0.010 85 / 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: ff.display,
              fontWeight: 800,
              fontSize: 20,
              color: C.ink,
              letterSpacing: '-0.02em',
            }}
          >
            Citra<span style={{ color: C.limeDark }}>Form</span>
          </span>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <a
              href="#recursos"
              style={{
                fontFamily: ff.body,
                fontSize: 14,
                fontWeight: 500,
                color: C.ink2,
                padding: '8px 14px',
                textDecoration: 'none',
              }}
            >
              Recursos
            </a>
            <Button variant="primary" size="md">
              Entrar
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1 }}>
        <section
          style={{
            maxWidth: 780,
            margin: '0 auto',
            padding: '96px 24px 64px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: C.limeBg,
              color: C.limeDark,
              fontFamily: ff.body,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              borderRadius: 999,
              marginBottom: 24,
            }}
          >
            Produto Citra · em construção
          </div>

          <h1
            style={{
              fontFamily: ff.display,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: C.ink,
              margin: '0 0 20px',
            }}
          >
            Formulários inteligentes, feitos pra converter
          </h1>

          <p
            style={{
              fontFamily: ff.body,
              fontSize: 18,
              lineHeight: 1.6,
              color: C.ink2,
              margin: '0 0 36px',
            }}
          >
            O form builder da linha Citra: qualificação de leads, lógica condicional e
            pontuação nativas, com o mesmo motor entregue como SaaS, embed ou domínio próprio.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
              Criar meu primeiro formulário
            </Button>
            <Button variant="secondary" size="lg">
              Ver exemplo
            </Button>
          </div>
        </section>

        {/* Feature cards */}
        <section
          id="recursos"
          style={{
            maxWidth: 1160,
            margin: '0 auto',
            padding: '32px 24px 96px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: C.limeBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Icon size={20} color={C.limeDark} strokeWidth={2.2} />
              </div>
              <h3
                style={{
                  fontFamily: ff.display,
                  fontWeight: 700,
                  fontSize: 17,
                  color: C.ink,
                  margin: '0 0 8px',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: ff.body,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: C.ink2,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </Card>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '32px 0', borderTop: `1px solid ${C.border}`, background: C.white }}>
        <div
          style={{
            maxWidth: 1160,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontFamily: ff.body, fontSize: 12, color: C.ink3 }}>
            Um produto{' '}
            <a href="https://makelemonad.com" target="_blank" rel="noopener noreferrer" style={{ color: C.ink2, fontWeight: 600 }}>
              Make
            </a>
          </span>
          <span style={{ fontFamily: ff.body, fontSize: 12, color: C.ink3 }}>
            Design system herdado do CitraChat
          </span>
        </div>
      </footer>
    </div>
  );
}
