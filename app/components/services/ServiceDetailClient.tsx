'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView, type MotionValue } from 'framer-motion'
import FAQAccordion from '@/app/components/ui/FAQAccordion'
import SplitText from '@/app/components/ui/SplitText'
import ParallaxImage from '@/app/components/ui/ParallaxImage'
import Marquee from '@/app/components/ui/Marquee'
import PortfolioCard from '@/app/components/portfolio/PortfolioCard'
import type { ServiceData } from '@/app/lib/servicesData'
import type { ProjectData } from '@/app/lib/portfolioData'
import { cdn } from '@/app/lib/cdn'

/* ─── shared animation helpers ─────────────────────────── */
function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-6% 0px' },
    transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] as [number, number, number, number], delay },
  }
}
function fadeIn(delay = 0) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: '-6% 0px' },
    transition: { duration: 1.1, ease: [0.7, 0, 0.3, 1] as [number, number, number, number], delay },
  }
}

/* ─── Scroll-linked word reveal — each word brightens as it crosses the
   reading line, instead of a one-shot fade-in. Used for "The Idea" copy. ─── */
function RevealWord({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity, display: 'inline-block', marginRight: '0.28em' }}>
      {children}
    </motion.span>
  )
}
function ScrollRevealText({ text, style }: { text: string; style: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'start 0.32'] })
  const words = text.split(' ')
  return (
    <p ref={ref} style={style}>
      {words.map((w, i) => (
        <RevealWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </RevealWord>
      ))}
    </p>
  )
}

/* ─── Step icons — one per position ─────────────────────── */
const STEP_ICONS = [
  // 1 — Discover / Research
  <svg key="1" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(-2,-2)">
      <circle cx="22" cy="22" r="12" />
      <line x1="31" y1="31" x2="42" y2="42" />
      <line x1="22" y1="14" x2="22" y2="30" />
      <line x1="14" y1="22" x2="30" y2="22" />
    </g>
  </svg>,
  // 2 — Define / Strategy
  <svg key="2" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,2)">
      <polygon points="24,6 44,38 4,38" />
      <line x1="24" y1="20" x2="24" y2="30" />
      <circle cx="24" cy="34" r="1.5" fill="currentColor" stroke="none" />
    </g>
  </svg>,
  // 3 — Build / Create
  <svg key="3" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="14" height="14" rx="2" />
    <rect x="26" y="8" width="14" height="14" rx="2" />
    <rect x="8" y="26" width="14" height="14" rx="2" />
    <rect x="26" y="26" width="14" height="14" rx="2" />
  </svg>,
  // 4 — Deliver / Launch
  <svg key="4" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 38 C10 38 16 10 38 10" />
    <polyline points="28,10 38,10 38,20" />
    <circle cx="16" cy="32" r="4" />
  </svg>,
]

/* ─── Process section — horizontal flow, icon-driven ─────── */
function ProcessSection({ steps }: { steps: ServiceData['process'] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' })
  const n = steps.length
  // Compact wave — text lives outside wave, so VH can be small
  const VW = 1200, VH = 280
  const midY = VH / 2
  const topY = 44
  const botY = VH - 44

  // Column centers must match the text grid below exactly: padding 13.5%,
  // n equal columns of width 73%/n. Icons sit at the same x as their text.
  const colWidthPct = 73 / n
  const iconPts = steps.map((_, i) => {
    const centerPct = 13.5 + (i + 0.5) * colWidthPct
    return {
      x: (centerPct / 100) * VW,
      y: i % 2 === 0 ? topY : botY,
      isTop: i % 2 === 0,
    }
  })

  const pathD = (() => {
    const pts: [number, number][] = [
      [0, midY],
      ...iconPts.map(p => [p.x, p.y] as [number, number]),
      [VW, midY],
    ]
    let d = `M ${pts[0][0]},${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1]
      const [x2, y2] = pts[i]
      const dx = x2 - x1
      d += ` C ${x1 + dx * 0.45},${y1} ${x2 - dx * 0.45},${y2} ${x2},${y2}`
    }
    return d
  })()

  // Shared text cell — renders step label, title, description
  const textCell = (i: number, dir: 'up' | 'down') => (
    <motion.div
      initial={{ opacity: 0, y: dir === 'up' ? -10 : 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: dir === 'up' ? -10 : 10 }}
      transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] as [number, number, number, number], delay: 0.65 + i * 0.22 }}
    >
      <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', marginBottom: '0.6rem' }}>
        {String(i + 1).padStart(2, '0')}
      </span>
      <h3 style={{ fontSize: 'clamp(1.5rem, 1.6vw, 2rem)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#fff', margin: 0, marginBottom: '0.6rem' }}>
        {steps[i].step}
      </h3>
      <p style={{ fontSize: 'clamp(1.1rem, 1.1vw, 1.4rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
        {steps[i].detail}
      </p>
    </motion.div>
  )

  return (
    <section ref={sectionRef} className="svc-process" style={{ background: '#000', padding: '10rem 0 8rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 5.6rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '5rem', gap: '3rem', flexWrap: 'wrap' }}>
          <div>
            <motion.span {...fadeUp()} style={{
              display: 'block', fontSize: '1.1rem', letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '1.6rem',
            }}>
              How We Work
            </motion.span>
            <SplitText
              as="h2"
              mode="lines"
              text="Our Process"
              style={{
                fontSize: 'clamp(3.6rem, 5.5vw, 7.2rem)',
                fontWeight: 600, lineHeight: 1.0, letterSpacing: '-0.03em', color: '#fff',
              }}
            />
          </div>
          <motion.p {...fadeUp(0.1)} className="process-sub" style={{
            fontSize: 'clamp(1.4rem, 1.4vw, 1.7rem)', lineHeight: 1.7,
            color: 'rgba(255,255,255,0.3)', maxWidth: 320, margin: 0, textAlign: 'right',
          }}>
            Every engagement follows the same disciplined sequence.
          </motion.p>
        </div>
      </div>

      {/* ── Desktop wave layout ── */}
      <div className="process-wave">

        {/* TOP text row — even steps (0, 2…), bottom-aligned so text sits flush above wave */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          alignItems: 'flex-end',
          padding: '0 clamp(4%, 13.5%, 13.5%)',
          paddingBottom: '2.8rem',
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{ padding: '0 1.2rem', textAlign: 'center' }}>
              {iconPts[i].isTop ? textCell(i, 'up') : <div aria-hidden="true" />}
            </div>
          ))}
        </div>

        {/* Compact wave — SVG path + icon cards only, no text inside */}
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Aspect-ratio spacer VW:VH = 1200:280 */}
          <div style={{ paddingBottom: `${(VH / VW) * 100}%` }} />

          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
          >
            <motion.path
              d={pathD}
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 2.0, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            />
          </svg>

          {iconPts.map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(pos.x / VW) * 100}%`,
                top: `${(pos.y / VH) * 100}%`,
              }}
            >
              {/* Ghost step number — centered on the wave point via a static (non-animated) wrapper */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}>
                <span style={{
                  display: 'block',
                  fontSize: 'clamp(7rem, 8vw, 10rem)',
                  fontWeight: 700, lineHeight: 1,
                  color: 'rgba(255,255,255,0.04)',
                  letterSpacing: '-0.05em',
                  userSelect: 'none', pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {i + 1}
                </span>
              </div>

              {/* Icon card — centering lives on this static wrapper; Framer Motion owns
                  the inner element's transform for scale/opacity, so the two never fight. */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'clamp(52px, 5vw, 72px)',
                  height: 'clamp(52px, 5vw, 72px)',
                  zIndex: 2,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.45 + i * 0.22 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                >
                  <div style={{ width: '44%', height: '44%' }}>
                    {STEP_ICONS[i % STEP_ICONS.length]}
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM text row — odd steps (1, 3…), top-aligned so text sits flush below wave */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          alignItems: 'flex-start',
          padding: '0 clamp(4%, 13.5%, 13.5%)',
          paddingTop: '2.8rem',
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{ padding: '0 1.2rem', textAlign: 'center' }}>
              {!iconPts[i].isTop ? textCell(i, 'down') : <div aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile fallback — vertical list ── */}
      <div className="process-mobile-list" style={{ display: 'none', flexDirection: 'column', gap: '3.2rem', padding: '0 2.4rem 2rem' }}>
        {steps.map((s, i) => (
          <motion.div key={i} {...fadeUp(i * 0.08)} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, flexShrink: 0,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              <div style={{ width: 22, height: 22 }}>{STEP_ICONS[i % STEP_ICONS.length]}</div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.4rem' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff', margin: 0, marginBottom: '0.6rem', lineHeight: 1.2 }}>{s.step}</h3>
              <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.65 }}>{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom divider */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 5.6rem' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.7, 0, 0.3, 1] }}
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 15%, rgba(255,255,255,0.1) 85%, transparent)',
            transformOrigin: 'left', marginTop: '2rem',
          }}
        />
      </div>
    </section>
  )
}

/* ─── Main component ───────────────────────────────────── */
interface Props {
  service: ServiceData
  prevService: ServiceData | null
  nextService: ServiceData | null
  relatedProjects: ProjectData[]
}

export default function ServiceDetailClient({ service, prevService, nextService, relatedProjects }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgScale = useTransform(heroScroll, [0, 1], [1.0, 1.12])
  const heroImgY     = useTransform(heroScroll, [0, 1], ['0%', '6%'])
  const heroTextY    = useTransform(heroScroll, [0, 1], ['0%', '20%'])
  const heroOpacity  = useTransform(heroScroll, [0, 0.55], [1, 0])

  return (
    <main style={{ background: '#000', color: '#fff' }}>

      {/* ══════════════════════════════════════════
          01 · HERO — 45/55 split, parallax
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="svc-hero"
        style={{
          position: 'relative',
          height: '100svh',
          minHeight: 640,
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* Left */}
        <div
          className="svc-hero-left"
          style={{
            position: 'relative',
            zIndex: 2,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 5.2rem 5.6rem',
            paddingTop: 'calc(88px + 3.2rem)',
            overflow: 'hidden',
          }}
        >
          <motion.div style={{ y: heroTextY, opacity: heroOpacity, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1], delay: 0.15 }}
            >
              <Link href="/services" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                fontSize: '1.25rem', letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.38)', textDecoration: 'none',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                All Services
              </Link>
            </motion.div>

            {/* Title + tagline — one typographic statement, no scaffolding above it */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <SplitText
                as="h1"
                mode="lines"
                text={service.title}
                style={{
                  fontSize: 'clamp(3.8rem, 5.2vw, 7.6rem)',
                  fontWeight: 600, lineHeight: 0.98,
                  letterSpacing: '-0.03em', color: '#fff',
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.7, 0, 0.3, 1], delay: 0.5 }}
                style={{
                  fontSize: 'clamp(1.6rem, 1.6vw, 2.1rem)',
                  lineHeight: 1.5, color: 'rgba(255,255,255,0.42)',
                  margin: '2.4rem 0 0', fontWeight: 600, maxWidth: 420,
                }}
              >
                {service.tagline}
              </motion.p>
            </div>

            {/* What's covered — real scope, not a decorative numeral */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1], delay: 0.7 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem' }}
            >
              {service.highlights.slice(0, 3).map((h, i) => (
                <span key={i} style={{
                  padding: '0.9rem 1.6rem',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: '999px',
                  fontSize: '1.2rem', lineHeight: 1.3,
                  color: 'rgba(255,255,255,0.62)',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right: image */}
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1], delay: 0.1 }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <motion.div style={{ scale: heroImgScale, y: heroImgY, position: 'absolute', inset: 0, willChange: 'transform' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cdn(service.image)} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </motion.div>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.65) 100%)', pointerEvents: 'none' }} />
        </motion.div>

        {/* Seam line */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, bottom: 0, left: '45%', width: '1px',
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 75%, transparent)',
          zIndex: 3, pointerEvents: 'none',
        }} />

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="svc-scroll-hint"
          style={{ position: 'absolute', bottom: '4rem', right: '4rem', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <span style={{ fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', writingMode: 'vertical-rl' }}>Scroll</span>
          <span style={{ position: 'relative', display: 'block', width: '1px', height: 40, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
            <motion.span
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'rgba(255,255,255,0.7)' }}
            />
          </span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          02 · MARQUEE — scrolling keywords
      ══════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '2rem 0', overflow: 'hidden' }}>
        <Marquee
          items={service.marqueeKeywords}
          duration={30}
          itemStyle={{ fontSize: 'clamp(1.4rem, 1.6vw, 2rem)', fontWeight: 400, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}
        />
      </div>

      {/* ══════════════════════════════════════════
          03 · THE IDEA — editorial full-width text
      ══════════════════════════════════════════ */}
      <section className="svc-idea" style={{ padding: '12rem 5.6rem' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '140px 1fr 360px', gap: '5.6rem', alignItems: 'start' }}
            className="svc-idea-grid"
          >
            {/* Left label — pinned while the copy scrolls past it */}
            <div className="svc-idea-label" style={{ position: 'sticky', top: '14rem' }}>
              <motion.span {...fadeUp()} style={{ display: 'block', fontSize: '1.1rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', lineHeight: 1.8 }}>
                The<br />Idea
              </motion.span>
            </div>

            {/* Center: copy brightens word by word as it crosses the reading line */}
            <div>
              <ScrollRevealText
                text={service.description[0]}
                style={{
                  fontSize: 'clamp(2rem, 2.3vw, 3.2rem)',
                  fontWeight: 400, lineHeight: 1.5,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  color: '#fff',
                  marginBottom: service.description[1] ? '4rem' : 0,
                }}
              />
              {service.description[1] && (
                <motion.p {...fadeUp(0.05)} style={{ fontSize: 'clamp(1.5rem, 1.5vw, 1.9rem)', lineHeight: 1.75, color: 'rgba(255,255,255,0.44)', margin: 0, fontWeight: 300 }}>
                  {service.description[1]}
                </motion.p>
              )}
            </div>

            {/* Right: a tall image that travels down the section alongside the copy */}
            {service.secondaryImage && (
              <motion.div
                {...fadeIn(0.15)}
                className="svc-idea-image"
                style={{ position: 'sticky', top: '14rem', borderRadius: '16px', overflow: 'hidden', aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ParallaxImage src={cdn(service.secondaryImage)} alt="" strength={14} style={{ height: '100%' }} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          04 · PROCESS — scroll-driven interactive
      ══════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <ProcessSection steps={service.process} />
      </div>

      {/* ══════════════════════════════════════════
          05 · DELIVERABLES — what you receive
      ══════════════════════════════════════════ */}
      {false && service.highlights.length > 0 && (
        <section
          className="svc-delivers"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0 5.6rem 12rem' }}
        >
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>

            {/* Header */}
            <div className="svc-delivers-head" style={{ padding: '7rem 0 5rem', maxWidth: 680 }}>
              <SplitText
                as="h2"
                mode="lines"
                text="Key Deliverables"
                style={{ fontSize: 'clamp(3.6rem, 5.5vw, 7.2rem)', fontWeight: 600, lineHeight: 1.0, letterSpacing: '-0.03em', color: '#fff' }}
              />
              <motion.p {...fadeUp(0.1)} style={{
                fontSize: 'clamp(1.4rem, 1.4vw, 1.7rem)', lineHeight: 1.7,
                color: 'rgba(255,255,255,0.35)', margin: '2rem 0 0',
              }}>
                The foundations your brand needs to move the market.
              </motion.p>
            </div>

            {/* Items — a single interactive list; hover inverts the index, draws the arrow */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {service.highlights.map((item, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.06)}
                  className="svc-deliver-row"
                  style={{
                    padding: 'clamp(2.4rem, 4vw, 4.4rem) 0',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', gap: 'clamp(2rem, 3vw, 4rem)',
                  }}
                >
                  <span className="svc-deliver-num" style={{
                    flexShrink: 0,
                    width: '5.2rem', height: '5.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.18)',
                    fontSize: '1.4rem', fontWeight: 600,
                    color: '#fff',
                    transition: 'background 0.4s cubic-bezier(.7,0,.3,1), color 0.4s cubic-bezier(.7,0,.3,1), border-color 0.4s cubic-bezier(.7,0,.3,1)',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{
                    flex: 1,
                    fontSize: 'clamp(1.8rem, 2.4vw, 2.8rem)',
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.3, margin: 0,
                    fontWeight: 600, letterSpacing: '-0.01em',
                  }}>
                    {item}
                  </p>
                  <svg
                    className="svc-deliver-arrow"
                    width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    style={{ flexShrink: 0, color: '#fff', opacity: 0, transform: 'translateX(-10px)', transition: 'opacity 0.4s cubic-bezier(.7,0,.3,1), transform 0.4s cubic-bezier(.7,0,.3,1)' }}
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          06 · GALLERY — asymmetric parallax
      ══════════════════════════════════════════ */}
      <section className="svc-gallery" style={{ padding: '0 5.6rem 12rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <motion.span {...fadeUp()} style={{
            display: 'block', fontSize: '1.1rem', letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '3.6rem',
          }}>
            Visual Showcase
          </motion.span>

          <div className="svc-gallery-grid" style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '1.4rem' }}>
            <motion.div {...fadeIn()} style={{ borderRadius: '16px', overflow: 'hidden', minHeight: 560, border: '1px solid rgba(255,255,255,0.05)' }}>
              <ParallaxImage src={cdn(service.gallery[0])} alt="Visual 1" strength={10} style={{ height: '100%' }} />
            </motion.div>
            <motion.div {...fadeIn(0.12)} style={{ borderRadius: '16px', overflow: 'hidden', minHeight: 560, border: '1px solid rgba(255,255,255,0.05)' }}>
              <ParallaxImage src={cdn(service.gallery[1])} alt="Visual 2" strength={10} style={{ height: '100%' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          07 · PORTFOLIO — selected work
      ══════════════════════════════════════════ */}
      {relatedProjects.length > 0 && (
        <section
          className="svc-portfolio"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0 5.6rem 12rem' }}
        >
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              gap: '2rem', padding: '7rem 0 5.6rem', flexWrap: 'wrap',
            }}>
              <div>
                <motion.span {...fadeUp()} style={{ display: 'block', fontSize: '1.1rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '1.2rem' }}>
                  Our Work
                </motion.span>
                <SplitText as="h2" mode="lines" text="Selected Projects" style={{
                  fontSize: 'clamp(3.2rem, 4.5vw, 6rem)', fontWeight: 600, lineHeight: 1.02, letterSpacing: '-0.025em',
                }} />
              </div>
              <motion.div {...fadeUp(0.1)}>
                <Link href="/portfolio" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                  fontSize: '1.35rem', letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.48)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '100px', padding: '1.1rem 2.4rem',
                  textDecoration: 'none',
                }}>
                  View All Work
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            <div className="svc-portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {relatedProjects.map((project, i) => (
                <PortfolioCard
                  key={project.slug}
                  slug={project.slug}
                  title={project.title}
                  imageSrc={project.images.hero}
                  projectType={project.projectType.replace('\n', ' ')}
                  location={project.location}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          08 · FAQ
      ══════════════════════════════════════════ */}
      {service.faq.length > 0 && (
        <section
          className="svc-faq"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0 5.6rem 12rem' }}
        >
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div className="svc-faq-grid" style={{
              display: 'grid', gridTemplateColumns: '1fr 1.7fr',
              gap: 'clamp(4rem, 7vw, 10rem)',
              alignItems: 'start', paddingTop: '7rem',
            }}>
              <div style={{ position: 'sticky', top: '11rem' }}>
                <motion.span {...fadeUp()} style={{ display: 'block', fontSize: '1.1rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '2rem' }}>
                  Questions
                </motion.span>
                <SplitText as="h2" mode="lines" text="A Few Answers." style={{
                  fontSize: 'clamp(3rem, 3.8vw, 5rem)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.02em',
                }} />
                <motion.p {...fadeUp(0.15)} style={{
                  fontSize: '1.35rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.3)',
                  margin: 0, marginTop: '2.4rem', maxWidth: 280,
                }}>
                  Everything you need to know before we get started.
                </motion.p>
              </div>
              <FAQAccordion items={service.faq} />
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          09 · SERVICE NAVIGATION
      ══════════════════════════════════════════ */}
      {(prevService || nextService) && (
        <div
          className="svc-nav-row"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '5.6rem',
            display: 'flex', alignItems: 'stretch', gap: '2rem',
          }}
        >
          <div style={{ flex: 1 }}>
            {prevService && (
              <Link href={`/services/${prevService.slug}`} className="svc-nav-link"
                style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.8rem', textDecoration: 'none', color: '#fff' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Previous
                </span>
                <span style={{ fontSize: 'clamp(1.6rem, 1.8vw, 2.4rem)', fontWeight: 600, lineHeight: 1.15 }}>{prevService.title}</span>
              </Link>
            )}
          </div>

          {prevService && nextService && (
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
          )}

          <div style={{ flex: 1, textAlign: 'right' }}>
            {nextService && (
              <Link href={`/services/${nextService.slug}`} className="svc-nav-link"
                style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-end', textDecoration: 'none', color: '#fff' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                  Next
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
                <span style={{ fontSize: 'clamp(1.6rem, 1.8vw, 2.4rem)', fontWeight: 600, lineHeight: 1.15 }}>{nextService.title}</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* Hero */
        @media (max-width: 768px) {
          .svc-hero { grid-template-columns: 1fr !important; grid-template-rows: 1fr 38vh !important; }
          .svc-hero-left { padding: 2.4rem !important; padding-top: calc(80px + 2rem) !important; }
          .svc-scroll-hint { display: none !important; }
        }
        /* Idea */
        @media (max-width: 960px) {
          .svc-idea { padding: 7rem 2.4rem !important; }
          .svc-idea-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .svc-idea-label { position: static !important; }
          .svc-idea-image { position: static !important; aspect-ratio: 16/10 !important; }
        }
        /* Deliverables */
        .svc-deliver-row:hover .svc-deliver-num { background: #fff; color: #000; border-color: #fff; }
        .svc-deliver-row:hover .svc-deliver-arrow { opacity: 1; transform: translateX(0); }
        @media (max-width: 960px) {
          .svc-delivers { padding: 0 2.4rem 8rem !important; }
          .svc-deliver-row { gap: 1.6rem !important; }
          .svc-deliver-arrow { display: none !important; }
        }
        /* Gallery */
        @media (max-width: 768px) {
          .svc-gallery { padding: 0 2.4rem 8rem !important; }
          .svc-gallery-grid { grid-template-columns: 1fr !important; }
        }
        /* Portfolio */
        @media (max-width: 1024px) {
          .svc-portfolio { padding: 0 2.4rem 8rem !important; }
          .svc-portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) { .svc-portfolio-grid { grid-template-columns: 1fr !important; } }
        /* FAQ */
        @media (max-width: 900px) {
          .svc-faq { padding: 0 2.4rem 8rem !important; }
          .svc-faq-grid { grid-template-columns: 1fr !important; }
        }
        /* Process */
        @media (max-width: 960px) {
          .svc-process { padding: 7rem 0 8rem !important; }
          .process-sub { text-align: left !important; }
        }
        @media (max-width: 768px) {
          .process-wave { display: none !important; }
          .process-mobile-list { display: flex !important; }
        }
        /* Nav */
        .svc-nav-link span:last-child { transition: opacity 0.2s; }
        .svc-nav-link:hover span:last-child { opacity: 0.5; }
        @media (max-width: 640px) {
          .svc-nav-row { flex-direction: column !important; padding: 3.2rem 2.4rem !important; }
          .svc-nav-row > div:last-child { text-align: left !important; }
          .svc-nav-row > div:last-child a { align-items: flex-start !important; }
        }
      `}</style>
    </main>
  )
}
