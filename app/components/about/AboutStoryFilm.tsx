'use client'
import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'

const EASE: [number, number, number, number] = [0.7, 0, 0.3, 1]

const CHAPTERS = [
  {
    year: 1994,
    yearLabel: '1994',
    title: 'The Press Room',
    body: 'Zurich Graphics opens as a print and design house. Ink, paper, and a conviction that a builder’s brochure should feel as considered as the building itself.',
    image: '/portfolio/commercial-projects/krupa-aspire/08.jpg',
  },
  {
    year: 2003,
    yearLabel: '2003',
    title: 'Strategy Joins The Craft',
    body: 'Clients stop asking for artwork and start asking for direction. Brand strategy and consultation become the first conversation of every project: the design follows the thinking.',
    image: '/portfolio/commercial-projects/krupa-aspire/01.jpg',
  },
  {
    year: 2012,
    yearLabel: '2012',
    title: 'The Exhibition Years',
    body: 'Campaigns step off the page. Advertising, launches, and exhibition experiences carry our clients’ brands into halls, hoardings, and headlines.',
    image: '/portfolio/corporate-brochure/krrish-group/01.jpg',
  },
  {
    year: 2026,
    yearLabel: 'Today',
    title: '4000 Projects Later',
    body: 'End-to-end brand communication for real estate, architecture, and high-value businesses: strategy, design, print, advertising, and exhibitions under one roof.',
    image: '/portfolio/residencial-projects/greenleaf heritage/g1.jpg',
  },
]

/* ── mechanical odometer digit ─────────────────────────────────────────── */

const DIGIT_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

function OdometerDigit({ year, place }: { year: MotionValue<number>; place: number }) {
  // mechanical-counter behavior: this digit sits on its value and only rolls
  // forward during the final unit before the lower places carry (e.g. the
  // thousands digit turns 1→2 only across 1999→2000, not gradually); the
  // 11-item strip (…9,0) lets the 9→0 carry roll forward instead of snapping
  const y = useTransform(year, v => {
    const value = Math.max(0, v)
    const digit = Math.floor(value / place) % 10
    const roll = Math.max(0, (value % place) - (place - 1))
    return `${-(digit + roll)}em`
  })
  return (
    <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', verticalAlign: 'top' }}>
      <motion.span style={{ y, display: 'block' }}>
        {DIGIT_STRIP.map((d, i) => (
          <span key={i} style={{ display: 'block', height: '1em', lineHeight: 1 }}>{d}</span>
        ))}
      </motion.span>
    </span>
  )
}

/* ── the film ──────────────────────────────────────────────────────────── */

/**
 * Scroll-driven story: the stage pins for ~5 viewports while four chapters
 * play through it. A mechanical year odometer rolls 1994 → 2026 with scroll,
 * scenes crossfade with a slow settle, and the final chapter lands the
 * studio's numbers.
 */
export default function AboutStoryFilm() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: spacerRef, offset: ['start start', 'end end'] })

  // year scrubs between chapter anchor points, smoothed so digits roll
  const yearRaw = useTransform(scrollYProgress, [0.06, 0.31, 0.56, 0.81], [1994, 2003, 2012, 2026], { clamp: true })
  const year = useSpring(yearRaw, { stiffness: 55, damping: 18 })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    setActive(Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(v * CHAPTERS.length))))
  })

  const chapter = CHAPTERS[active]

  return (
    <div
      ref={spacerRef}
      id="about-story"
      style={{ position: 'relative', height: '500vh', background: '#000' }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100svh',
        overflow: 'hidden',
        color: '#fff',
      }}>
        {/* ── scenes: stacked, crossfading, slowly settling ── */}
        {CHAPTERS.map((c, i) => (
          <motion.div
            key={c.year}
            initial={false}
            animate={{
              opacity: i === active ? 1 : 0,
              scale: i === active ? 1 : 1.06,
            }}
            transition={{ duration: 1.1, ease: EASE }}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={c.image}
              alt=""
              aria-hidden="true"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* keep the frame dark and the type readable */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.35) 100%)',
            }} />
          </motion.div>
        ))}

        {/* ── header ── */}
        <div style={{
          position: 'absolute',
          top: '2.8rem',
          left: '4rem',
          zIndex: 3,
          fontSize: '1.1rem',
          letterSpacing: '0.22em',
          color: '#fff',
        }}>
          The story
        </div>

        {/* ── chapter text ── */}
        <div style={{
          position: 'absolute',
          left: '4rem',
          top: 0,
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: 'min(560px, 60vw)',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -34 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span style={{
                display: 'block',
                fontSize: '1.2rem',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '2rem',
              }}>
                CH.{String(active + 1).padStart(2, '0')} · {chapter.yearLabel}
              </span>
              <h3 style={{
                fontSize: 'clamp(3.2rem, 4.8vw, 6.8rem)',
                fontWeight: 600,
                lineHeight: 1.02,
                letterSpacing: '0.02em',
                margin: 0,
                marginBottom: '2.4rem',
              }}>
                {chapter.title}
              </h3>
              <p style={{
                fontSize: '1.5rem',
                lineHeight: 1.75,
                letterSpacing: '0.03em',
                color: 'rgba(255,255,255,0.75)',
                margin: 0,
                maxWidth: 460,
              }}>
                {chapter.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── the odometer ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '4rem',
            bottom: '9rem',
            zIndex: 2,
            fontSize: 'clamp(8rem, 15vw, 19rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '0.04em',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.75)',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          <OdometerDigit year={year} place={1000} />
          <OdometerDigit year={year} place={100} />
          <OdometerDigit year={year} place={10} />
          <OdometerDigit year={year} place={1} />
        </div>

        {/* ── chapter rail + progress ── */}
        <div style={{
          position: 'absolute',
          bottom: '3.2rem',
          left: '4rem',
          right: '4rem',
          zIndex: 3,
        }}>
          <div style={{ display: 'flex', gap: '3.2rem', marginBottom: '1.6rem' }}>
            {CHAPTERS.map((c, i) => (
              <span key={c.year} style={{
                fontSize: '1.1rem',
                letterSpacing: '0.18em',
                color: i === active ? '#fff' : 'rgba(255,255,255,0.35)',
                transition: 'color 0.4s ease',
              }}>
                CH.{String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.2)' }}>
            <motion.div style={{
              scaleX: scrollYProgress,
              transformOrigin: 'left center',
              height: '100%',
              background: '#fff',
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
