'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import { cdn } from '@/app/lib/cdn'

const ITEMS = [
  {
    num: 1,
    title: 'Brand Strategy\n & Consulting',
    description: 'Giving your project a sharper position and a stronger reason to be chosen.',
    image: '/images/Brand strategy_home page.jpeg',
  },
  {
    num: 2,
    title: 'Naming & Brand\n Identity',
    description: 'We give projects names people remember and identities competitors notice.',
    image: '/images/naming_homepage.jpeg',
  },
  {
    num: 3,
    title: 'Brochure Design',
    description: 'We give every feature a reason to matter and every page a reason to turn.',
    image: '/images/Services_Corporate Brochure Design.jpg',
  },
  {
    num: 4,
    title: 'Campaign Design',
    description: 'Creative that cuts through clutter and gives the project an unfair share of attention.',
    image: '/images/Services_Campaign Design-new.jpeg',
  },
  {
    num: 5,
    title: '360° Project\n Branding',
    description: 'We make one powerful brand speak fluently across every physical and digital touchpoint.',
    image: '/images/Services_360 Branding Design.jpg',
  },
  {
    num: 6,
    title: 'Reels & Digital\n Communication',
    description: 'Scroll-stopping content that moves fast, speaks sharp and keeps the project in conversation.',
    image: '/images/Services_Reels_2.jpg',
  },
  {
    num: 7,
    title: 'Corporate &\n Project Films',
    description: 'We give corporate vision a voice and project stories a powerful screen presence.',
    image: '/images/Services_Corporate Video.jpg',
  },
  {
    num: 8,
    title: 'Print &\n Outdoor Media',
    description: 'Turning every hoarding, newspaper and site surface into a reason to look.',
    image: '/images/Services_Print Media.jpg',
  },
  {
    num: 9,
    title: 'Exhibition &\n Stall Designs',
    description: 'Designed to turn heads before the conversation even begins.',
    image: '/images/Exhibition-Stall-Designs.jpeg',
  },
]

const TOTAL = ITEMS.length

export default function Advantages() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  // 'before' | 'pinned' | 'after'
  const [phase, setPhase] = useState<'before' | 'pinned' | 'after'>('before')
  // top offset for 'after' phase (px from top of document)
  const [afterTop, setAfterTop] = useState(0)

  useEffect(() => {
    const spacer = spacerRef.current
    if (!spacer) return

    const update = (scrollY: number) => {
      const sectionTop = spacer.offsetTop
      const viewH = window.innerHeight
      // Each step gets one full viewH of scroll — all TOTAL steps reachable while pinned
      // Plus 2 extra viewH to keep step 7 visible before next section
      const scrollDistance = (TOTAL + 2) * viewH
      const sectionBottom = sectionTop + scrollDistance

      if (scrollY < sectionTop) {
        setPhase('before')
      } else if (scrollY < sectionBottom) {
        setPhase('pinned')
        const scrolled = scrollY - sectionTop
        const index = Math.min(TOTAL - 1, Math.floor(scrolled / viewH))
        setActive(index)
      } else {
        // afterTop positions the panel as spacer's own absolutely positioned
        // child, so it must be local to spacer's top — not document-absolute.
        setPhase('after')
        setAfterTop(scrollDistance - viewH)
        setActive(TOTAL - 1)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis as Lenis | undefined
    if (lenis) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handler = (e: any) => update(e.scroll)
      lenis.on('scroll', handler)
      update(lenis.scroll)
      return () => lenis.off('scroll', handler)
    }

    const onScroll = () => update(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    update(window.scrollY)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const item = ITEMS[active]

  // Panel style based on phase
  const panelStyle: React.CSSProperties =
    phase === 'pinned'
      ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh' }
      : phase === 'after'
      ? { position: 'absolute', top: afterTop, left: 0, right: 0, height: '100vh' }
      : { position: 'absolute', top: 0, left: 0, right: 0, height: '100vh' }

  return (
    // Spacer: tall enough for all steps — (TOTAL-1) extra viewports + 1 for the panel itself + 2vh buffer
    <div
      ref={spacerRef}
      id="advantages"
      style={{
        position: 'relative',
        height: `${(TOTAL + 2) * 100}vh`,
        background: '#000',
        zIndex: 9,
      }}
    >
      {/* Panel — fixed when pinned, absolute otherwise */}
      <div
        className="advantages-panel"
        style={{
          ...panelStyle,
          display: 'grid',
          gridTemplateColumns: '50% 50%',
          overflow: 'hidden',
          background: '#000',
          zIndex: 10,
        }}
      >
        {/* ── LEFT ── */}
        <div className="advantages-left" style={{
          background: '#000', color: '#fff',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4rem',
          overflow: 'hidden',
        }}>

          {/* Counter */}
          <div className="advantages-counter" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            
            <motion.span
              key={`num-${active}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}
            >
              {item.num}
            </motion.span>
            <span style={{ display: 'block', width: 40, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>
              {TOTAL}
            </span>
          </div>

          {/* Title */}
          <div className="advantages-title" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <motion.h2
              key={`title-${active}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] as [number,number,number,number] }}
              style={{
                fontSize: 'clamp(3.2rem, 5vw, 7rem)', fontWeight: 600,
                lineHeight: 1.05, letterSpacing: '0.01em',
                color: '#fff',
                margin: 0, whiteSpace: 'pre-line',
              }}
            >
              {item.title}
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p
            key={`desc-${active}`}
            className="advantages-desc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] as [number,number,number,number], delay: 0.1 }}
            style={{
              fontSize: 'clamp(1.2rem, 1.2vw, 1.5rem)', lineHeight: 1.65,
              color: 'rgba(255,255,255,0.55)', maxWidth: 420,
              margin: 0, letterSpacing: '0.03em',
            }}
          >
            {item.description}
          </motion.p>
        </div>

        {/* ── RIGHT — all images stacked, opacity crossfade ── */}
        <div className="advantages-right" style={{ position: 'relative', overflow: 'hidden' }}>
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.num}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] as [number,number,number,number] }}
              style={{ position: 'absolute', inset: 0, zIndex: i === active ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={cdn(it.image)}
                alt={it.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .advantages-panel {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr !important;
          }
          .advantages-left {
            justify-content: flex-start !important;
            gap: 2rem !important;
            padding: 2.8rem 2rem !important;
          }
          .advantages-counter {
            flex: 0 0 auto !important;
          }
          .advantages-title {
            flex: 0 0 auto !important;
          }
          .advantages-left h2 {
            font-size: clamp(2.6rem, 6.5vw, 4rem) !important;
          }
          .advantages-desc {
            max-width: 100% !important;
          }
          .advantages-right {
            min-height: 240px !important;
          }
        }
      `}</style>
    </div>
  )
}
