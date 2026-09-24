'use client'
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { TECHNOLOGY_ITEMS } from '@/app/lib/data'
import { cdn } from '@/app/lib/cdn'

const TOTAL = TECHNOLOGY_ITEMS.length
const STEPS = Math.max(1, TOTAL - 1) // transitions between consecutive items
const BOX_WIDTH = 364
const BOX_HEIGHT = 330
const BOX_GAP = 40 // vertical space between the stacked boxes (px)
const BOX_STEP = BOX_HEIGHT + BOX_GAP

export default function Technologies() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'before' | 'pinned' | 'after'>('before')
  const [afterTop, setAfterTop] = useState(0)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  // 0 while still far above; ramps 0→1 across the last viewport before pinning,
  // driving a full-height slide-up cover so the panel is never partially shown.
  const [enter, setEnter] = useState(0)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const spacer = spacerRef.current
    if (!spacer) return

    const snapTo = (targetRaw: number, sectionTop: number, viewH: number) => {
      const targetScrollY = sectionTop + targetRaw * viewH
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).__lenis as Lenis | undefined
      if (lenis) lenis.scrollTo(targetScrollY, { duration: 0.6 })
      else window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
    }

    const scheduleSnap = (sectionTop: number, viewH: number) => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentScrollY = (window as any).__lenis?.scroll ?? window.scrollY
        const entryStart = sectionTop - viewH
        const sectionBottom = sectionTop + (STEPS + 2) * viewH

        if (currentScrollY >= entryStart && currentScrollY < sectionTop) {
          // Entry zone: the panel is sliding into view but hasn't pinned yet.
          // Settle to fully-out (previous section) or fully-in (pinned) so it
          // never rests in a half-revealed state.
          const f = (currentScrollY - entryStart) / viewH
          if (f > 0.02 && f < 0.98) {
            snapTo(f > 0.5 ? 0 : -1, sectionTop, viewH)
          }
        } else if (currentScrollY >= sectionTop && currentScrollY < sectionBottom) {
          // Interior: snap between consecutive boxes at the 50% mark.
          const raw = (currentScrollY - sectionTop) / viewH
          const idx = Math.min(STEPS - 1, Math.floor(raw))
          const prog = raw - idx
          if (prog > 0.02 && prog < 0.98) {
            snapTo(prog > 0.5 ? idx + 1 : idx, sectionTop, viewH)
          }
        }
      }, 150)
    }

    const update = (scrollY: number) => {
      const sectionTop = spacer.offsetTop
      const viewH = window.innerHeight
      const scrollDistance = (STEPS + 2) * viewH
      const sectionBottom = sectionTop + scrollDistance

      if (scrollY < sectionTop) {
        setPhase('before')
        setIndex(0)
        setProgress(0)
        // Slide-up cover: 0 until one viewport out, then ramps to 1 at the top.
        setEnter(Math.max(0, Math.min(1, (scrollY - (sectionTop - viewH)) / viewH)))
        // Within one viewport of the top, we're in the slide-in entry zone —
        // let the snap resolve a half-revealed rest here too.
        if (scrollY >= sectionTop - viewH) scheduleSnap(sectionTop, viewH)
      } else if (scrollY < sectionBottom) {
        setPhase('pinned')
        setEnter(1)
        const raw = Math.min(STEPS, (scrollY - sectionTop) / viewH)
        const idx = Math.min(STEPS - 1, Math.floor(raw))
        setIndex(idx)
        setProgress(Math.min(1, Math.max(0, raw - idx)))
        scheduleSnap(sectionTop, viewH)
      } else {
        // afterTop positions the panel as spacer's own absolutely positioned
        // child, so it must be local to spacer's top — not document-absolute.
        setPhase('after')
        setEnter(1)
        setAfterTop(scrollDistance - viewH)
        setIndex(STEPS - 1)
        setProgress(1)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis as Lenis | undefined
    if (lenis) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handler = (e: any) => update(e.scroll)
      lenis.on('scroll', handler)
      update(lenis.scroll)
      return () => {
        lenis.off('scroll', handler)
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      }
    }

    const onScroll = () => update(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    update(window.scrollY)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  const hasNext = index + 1 < TOTAL
  const current = TECHNOLOGY_ITEMS[index]
  const next = hasNext ? TECHNOLOGY_ITEMS[index + 1] : null

  const panelStyle: React.CSSProperties =
    phase === 'pinned'
      ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh' }
      : phase === 'after'
      ? { position: 'absolute', top: afterTop, left: 0, right: 0, height: '100vh' }
      : // before: full-height fixed panel that slides up over the previous
        // section, so it's never shown partially in normal flow.
        {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          transform: `translateY(${(1 - enter) * 100}%)`,
        }

  return (
    <div
      ref={spacerRef}
      id="services"
      style={{
        position: 'relative',
        height: `${(STEPS + 2) * 100}vh`,
        background: '#000',
        zIndex: 11,
      }}
    >
      <div
        className="tech-panel"
        style={{
          ...panelStyle,
          display: 'grid',
          gridTemplateColumns: '50% 50%',
          overflow: 'hidden',
          background: '#000',
          zIndex: 11,
        }}
      >
        {/* LEFT — next image slides up from the bottom, covering the current one */}
        <div className="tech-left" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={cdn(current.image)}
              alt={current.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          {next && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateY(${(1 - progress) * 100}%)`,
                willChange: 'transform',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={cdn(next.image)}
                alt={next.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}
        </div>

        {/* RIGHT — heading stays fixed top-right; only the box and image change */}
        <div
          className="tech-right"
          style={{
            position: 'relative',
            height: '100%',
            padding: '4rem',
            color: '#fff',
          }}
        >
          <div className="tech-box-outer" style={{ position: 'relative', width: BOX_WIDTH, height: '100%', overflow: 'hidden' }}>
            {/* One strip holding every box; it slides up so the active box sits
                centred. All boxes are always mounted — nothing loads on demand. */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `calc(50% - ${BOX_HEIGHT / 2}px)`,
                display: 'flex',
                flexDirection: 'column',
                gap: `${BOX_GAP}px`,
                transform: `translateY(-${(index + progress) * BOX_STEP}px)`,
                willChange: 'transform',
              }}
            >
              {TECHNOLOGY_ITEMS.map((tech, i) => {
                const isActive = i === Math.round(index + progress)
                return (
                  <div
                    key={tech.title}
                    style={{
                      height: BOX_HEIGHT,
                      flexShrink: 0,
                      background: '#000',
                      border: '1px solid rgba(255,255,255,1)',
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: isActive ? 1 : 1,
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    <p style={{ fontSize: '1.5rem', letterSpacing: '0.1em', color: '#fff', margin: 0 }}>
                      {tech.title}
                    </p>
                    <p style={{ fontSize: '1.3rem', lineHeight: 1.5, color: 'rgba(255,255,255,1)', margin: 0 }}>
                      {tech.body}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <h2
            className="tech-heading"
            style={{
              position: 'absolute',
              top: '4rem',
              right: '4rem',
              fontSize: 'clamp(2.5rem, 3.5vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '0.05em',
              margin: 0,
              textAlign: 'right',
            }}
          >
            The Reviews<br />Are In
          </h2>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .tech-panel {
            grid-template-columns: 1fr !important;
            grid-template-rows: 38svh 1fr !important;
          }
          .tech-right {
            padding: 2.4rem 2rem !important;
          }
          .tech-box-outer {
            width: 100% !important;
            max-width: 320px !important;
          }
          .tech-heading {
            top: 2rem !important;
            right: 2rem !important;
            font-size: clamp(1.8rem, 5vw, 2.6rem) !important;
          }
        }
      `}</style>
    </div>
  )
}
