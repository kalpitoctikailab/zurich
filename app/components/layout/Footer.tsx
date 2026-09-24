'use client'

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/zurichgraphics/',
    path: 'M12 2.5c2.72 0 3.06.01 4.12.06 1.07.05 1.79.22 2.43.46.65.25 1.2.6 1.75 1.15.55.55.9 1.1 1.15 1.75.24.64.41 1.36.46 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.79-.46 2.43a4.9 4.9 0 0 1-1.15 1.75 4.9 4.9 0 0 1-1.75 1.15c-.64.24-1.36.41-2.43.46-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.79-.22-2.43-.46a4.9 4.9 0 0 1-1.75-1.15 4.9 4.9 0 0 1-1.15-1.75c-.24-.64-.41-1.36-.46-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.79.46-2.43.25-.65.6-1.2 1.15-1.75a4.9 4.9 0 0 1 1.75-1.15c.64-.24 1.36-.41 2.43-.46C8.94 2.51 9.28 2.5 12 2.5Zm0 2.16c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.31.31-.5.6-.66 1.02-.12.31-.26.78-.3 1.65-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.31.31.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.31-.31.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.87-.18-1.34-.3-1.65a2.74 2.74 0 0 0-.66-1.02 2.74 2.74 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3-1.05-.05-1.37-.06-4.04-.06Zm0 3.68a3.66 3.66 0 1 1 0 7.32 3.66 3.66 0 0 1 0-7.32Zm0 6.04a2.38 2.38 0 1 0 0-4.76 2.38 2.38 0 0 0 0 4.76Zm4.66-6.19a.86.86 0 1 1-1.72 0 .86.86 0 0 1 1.72 0Z',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/zurichgraphics/',
    path: 'M13.5 21v-8.15h2.73l.41-3.17h-3.14V7.7c0-.92.25-1.54 1.57-1.54h1.67V3.34c-.29-.04-1.28-.12-2.44-.12-2.41 0-4.07 1.47-4.07 4.18v2.33H7.5v3.17h2.73V21h3.27Z',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/zurichgraphics/',
    path: 'M6.94 8.5H3.56V20.5h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.5 20.5v-6.6c0-3.53-1.89-5.17-4.4-5.17-2.03 0-2.94 1.12-3.44 1.9V8.5H9.28c.05 1 0 12 0 12h3.38v-6.7c0-.36.03-.72.13-.98.29-.72.95-1.47 2.06-1.47 1.45 0 2.03 1.1 2.03 2.72v6.43h3.62Z',
  },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      className="ui-dark"
      style={{
        background: '#000',
        color: '#fff',
        padding: '8rem 5.6rem 4rem',
        zIndex:'999999',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        {/* Scroll to Top Arrow */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <button
            onClick={scrollToTop}
            aria-label="Scroll To Top Of The Page"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '1rem',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="14" height="31" viewBox="0 0 14 31" fill="none">
              <path d="M7 1L7 30M7 1L1 7M7 1L13 7" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 4fr 1fr',
            alignItems: 'end',
            gap: '2rem',
          }}
        >
          {/* Left - Copyright + social */}
          <div>
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.05em',
              marginBottom: '1.6rem',
            }}>
              © 2026 Zurich Graphics
            </p>
            <div style={{ display: 'flex', gap: '1.4rem' }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Center - Logo */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={scrollToTop}
              aria-label="Scroll To Top"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src="/zurich-logo-White.svg"
                alt="Zurich Graphics"
                style={{ height: 'clamp(2.8rem, 6vw, 8rem)', width: 'auto' }}
              />
            </button>
          </div>

          {/* Right - Credits */}
          <div style={{ textAlign: 'right' }}>
            <p
              rel="noopener noreferrer"
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              Site by Octik AI Lab
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer {
            padding: 5rem 2rem 3rem !important;
          }
          footer > div > div:last-child {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 3rem !important;
          }
          footer > div > div:last-child > div {
            text-align: center !important;
          }
          footer > div > div:last-child > div:first-child > div {
            justify-content: center !important;
          }
        }
      `}</style>
    </footer>
  )
}
