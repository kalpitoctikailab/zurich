'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import { cdn } from '@/app/lib/cdn'

const EASE: [number, number, number, number] = [0.7, 0, 0.3, 1]

const PASSAGES = [
  {
    heading: '32 Years In. Still Restless.',
    body: "We never take it easy. Our experience isn't our reason to be comfortable. Instead, it challenges us to dig deeper, question further and go beyond the expected. Realty doesn't stand still, and neither can our thinking. New buyers, emerging markets and changing platforms constantly reshape how projects are discovered and chosen.",
    image: '/images/32-Years-In-Still-Restless.jpeg',
  },
  {
    heading: 'Not New. And Never Old.',
    body: "We have a past. Yet, our thinking doesn't live there. We know what works. That's exactly why we keep asking what could work better. So, we learn, unlearn, experiment and keep our thinking in motion. Experience as a real estate brand strategy consulting partner has given us confidence, not fixed ideas. We rethink how a project is positioned, what it is called, how its identity takes shape and how its story travels from a brochure and campaign to a hoarding, digital or film. The learning moves forward. The formula stays behind.",
    image: '/images/Not-New-And-Never-Old.jpeg',
  },
  {
    heading: 'Many Minds. One Rule: Never Settle.',
    body: "Ideas rarely come from one desk. They move between strategists, writers, designers, digital thinkers and visual storytellers, each bringing a different way of seeing the same brief. Some bring decades of market experience. Others bring fresh tools, cultural cues and questions no one else thought to ask. Different disciplines. Different experiences. Different opinions. One shared standard: never settle.",
    image: '/images/Many-Minds-One-Rule-Never-Settle.jpeg',
  },
  {
    heading: 'A Lot Goes Into Turning A Head.',
    body: 'One head can turn another. We prefer a roomful. Every brief moves around the room: strategists question it, writers find its voice, designers shape it and digital thinkers take it further. Clients trust us with projects that have taken years to build, and we treat that trust as part of the brief. Talent gets attention. Teamwork gives it depth.',
    image: '/images/A-Lot-Goes-Into-Turning-A-Head-new.jpeg',
  },
]

const TOTAL = PASSAGES.length

/**
 * "Our thinking" — scroll-pinned stage, mirroring the Advantages section on
 * the home page: the panel pins for one viewport per passage while a tall
 * spacer is scrolled through, driving both the text swap on the left and an
 * image crossfade on the right.
 */
export default function AboutPassages() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [phase, setPhase] = useState<'before' | 'pinned' | 'after'>('before')
  const [afterTop, setAfterTop] = useState(0)

  useEffect(() => {
    const spacer = spacerRef.current
    if (!spacer) return

    const update = (scrollY: number) => {
      const sectionTop = spacer.offsetTop
      const viewH = window.innerHeight
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

  const item = PASSAGES[active]

  const panelStyle: React.CSSProperties =
    phase === 'pinned'
      ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh' }
      : phase === 'after'
      ? { position: 'absolute', top: afterTop, left: 0, right: 0, height: '100vh' }
      : { position: 'absolute', top: 0, left: 0, right: 0, height: '100vh' }

  return (
    <div
      ref={spacerRef}
      id="about-passages"
      style={{
        position: 'relative',
        height: `${(TOTAL + 2) * 100}vh`,
        background: '#000',
        zIndex: 2,
      }}
    >
      <div
        className="about-passages-panel"
        style={{
          ...panelStyle,
          display: 'grid',
          gridTemplateColumns: '50% 50%',
          overflow: 'hidden',
          background: '#000',
          zIndex: 10,
        }}
      >
        {/* ── LEFT — text stage ── */}
        <div className="about-passages-left" style={{
          position: 'relative',
          background: '#000',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem',
          overflow: 'hidden',
        }}>
          {/* eyebrow */}
          <span style={{
            position: 'absolute',
            top: '2.8rem',
            left: '4rem',
            fontSize: '1.1rem',
            letterSpacing: '0.22em',
            color: '#fff',
          }}>
            Our thinking
          </span>

          {/* counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '3rem' }}>
            <motion.span
              key={`num-${active}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}
            >
              {String(active + 1).padStart(2, '0')}
            </motion.span>
            <span style={{ display: 'block', width: 40, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>
              {String(TOTAL).padStart(2, '0')}
            </span>
          </div>

          <motion.h3
            key={`title-${active}`}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              fontSize: 'clamp(2.6rem, 3.6vw, 5rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '0.01em',
              color: '#fff',
              margin: 0,
              marginBottom: '2.2rem',
              maxWidth: 620,
            }}
          >
            {item.heading}
          </motion.h3>

          <motion.p
            key={`body-${active}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            style={{
              fontSize: '1.4rem',
              lineHeight: 1.85,
              letterSpacing: '0.02em',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 600,
              margin: 0,
            }}
          >
            {item.body}
          </motion.p>
        </div>

        {/* ── RIGHT — stacked images, opacity crossfade ── */}
        <div className="about-passages-right" style={{ position: 'relative', overflow: 'hidden' }}>
          {PASSAGES.map((p, i) => (
            <motion.div
              key={p.heading}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ position: 'absolute', inset: 0, zIndex: i === active ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={cdn(p.image)}
                alt={p.heading}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.15) 100%)',
              }} />
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .about-passages-panel {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr !important;
          }
          .about-passages-left {
            padding: 7rem 2rem 2rem !important;
          }
          .about-passages-right {
            min-height: 220px !important;
          }
          .about-passages-left h3 {
            font-size: clamp(2.2rem, 6vw, 3.2rem) !important;
          }
        }
      `}</style>
    </div>
  )
}
