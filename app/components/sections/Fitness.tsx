'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import AnimateReveal from '@/app/components/ui/AnimateReveal'

const IMG = {
  i1: '/images/Services_001.jpg',
  i2: '/images/Services_002.jpg',
  i3: '/images/Services_003.jpg',
  i4: '/images/Services_004.jpg',
  i5: '/images/Services_005.jpg',
  i6: '/images/Services_006.jpg',
  i7: '/images/Services_007.jpg',
  i8: '/images/Services_008.jpg',
  i9: '/images/Services_009.jpg',
  i10: '/images/Services_010.jpg',
}

// Mobile gets a plain vertical stack instead of the horizontal-scroll rig —
// the strip's translateX math is driven by strip.scrollWidth, which doesn't
// have a sane mobile equivalent, so flipping flex-direction on the existing
// panels would fight that math rather than fix it. Same content, read top
// to bottom instead of left to right.
const MOBILE_ITEMS: Array<{ type: 'heading' | 'image' | 'text' | 'label'; text?: string; src?: string; alt?: string }> = [
  { type: 'heading', text: 'Our Work' },
  { type: 'image', src: IMG.i1, alt: 'Real estate site brochure design by Zurich Graphics' },
  { type: 'label', text: 'Site Brochure' },
  { type: 'text', text: "We'll let it do the talking. Inside are identities that found their edge, campaigns that owned their space and projects that became brands." },
  { type: 'image', src: IMG.i2, alt: 'Real estate company profile design by Zurich Graphics' },
  { type: 'image', src: IMG.i3, alt: 'Corporate company profile brochure layout by Zurich Graphics' },
  { type: 'label', text: 'Company Profile' },
  { type: 'text', text: 'Built in the studio. Tested in the market. Remembered across cities.' },
  { type: 'text', text: 'The Skyline Remembers Great Architecture. The Market Remembers Great Branding. This Is Where We Made Our Mark.' },
  { type: 'image', src: IMG.i4, alt: 'Real estate campaign creative by Zurich Graphics' },
  { type: 'image', src: IMG.i5, alt: 'Real estate marketing campaign design by Zurich Graphics' },
  { type: 'label', text: 'Campaign' },
  { type: 'text', text: 'Every project becomes a case study our clients are proud to share, from first sketch to the finished brand on the ground.' },
  { type: 'image', src: IMG.i6, alt: '360 degree real estate branding by Zurich Graphics' },
  { type: 'image', src: IMG.i7, alt: 'Integrated 360 degree branding touchpoints by Zurich Graphics' },
  { type: 'label', text: '360 Branding' },
  { type: 'text', text: 'From Naming To Launch: One Connected Creative Journey, Across Every Touchpoint.' },
  { type: 'image', src: IMG.i8, alt: 'Real estate print media advertisement by Zurich Graphics' },
  { type: 'image', src: IMG.i9, alt: 'Newspaper and print advertising design by Zurich Graphics' },
  { type: 'label', text: 'Print Media' },
  { type: 'text', text: 'A Compelling Position. A Powerful Story. A Brand Built To Be Chosen.' },
  { type: 'heading', text: 'Stall Design' },
  { type: 'image', src: IMG.i10, alt: 'Real estate exhibition stall design by Zurich Graphics' },
  { type: 'text', text: 'Over three decades of experience, a deep understanding of Indian realty and a strategy-first approach: identities that found their edge, campaigns that owned their space and projects that became brands.' },
]

export default function Fitness() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [translateX, setTranslateX] = useState(0)
  const [slideX, setSlideX] = useState(100)  // vw: 100 = off-screen right
  const [phase, setPhase] = useState<'before' | 'pinned' | 'after'>('before')
  const [afterTop, setAfterTop] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const spacer = spacerRef.current
    const strip = stripRef.current
    if (!spacer || !strip) return

    const update = (scrollY: number) => {
      const sectionTop = spacer.offsetTop
      const viewW = window.innerWidth
      const viewH = window.innerHeight
      const maxX = strip.scrollWidth - viewW

      // Slide-in zone: 1 viewH before sectionTop for smooth slide-in animation
      const slideStart = sectionTop - viewH
      // Horizontal scroll ends when we've scrolled maxX past sectionTop
      const hScrollEnd = sectionTop + maxX

      if (scrollY < slideStart) {
        setSlideX(100); setPhase('before'); setTranslateX(0)
      } else if (scrollY < sectionTop) {
        // Slide in from right — strip stays at 0, no horizontal scroll yet
        const p = (scrollY - slideStart) / viewH
        setSlideX(100 - p * 100); setPhase('before'); setTranslateX(0)
      } else if (scrollY < hScrollEnd) {
        // Fully in — horizontal scroll starts from 0
        setSlideX(0); setPhase('pinned')
        setTranslateX(-(scrollY - sectionTop))
      } else {
        // End — park. afterTop is local to spacerRef (position: relative),
        // not document-absolute, since the panel becomes its absolutely
        // positioned child once un-pinned.
        setSlideX(0); setPhase('after')
        setAfterTop(maxX)
        setTranslateX(-maxX)
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
    const fn = () => update(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    update(window.scrollY)
    return () => window.removeEventListener('scroll', fn)
  }, [isMobile])

  const [spacerH, setSpacerH] = useState('400vh')
  useEffect(() => {
    if (isMobile) return
    const recalc = () => {
      const strip = stripRef.current
      if (!strip) return
      const maxX = strip.scrollWidth - window.innerWidth
      // Spacer = horizontal scroll distance + 1 viewport height so the
      // parked panel (100vh, un-pinned once 'after') has flow space to sit
      // in. The slide-in itself happens while scrolling through the
      // previous section, so it doesn't need extra room here.
      const bufferSpace = window.innerHeight
      setSpacerH(`${maxX + bufferSpace}px`)
    }
    const t = setTimeout(recalc, 100)
    window.addEventListener('resize', recalc)
    // Mobile browsers often don't fire 'resize' when the address bar
    // shows/hides mid-scroll (the event most engines actually dispatch it
    // for), which left the horizontal-scroll spacer height stale — use the
    // visualViewport API too, which does fire reliably for that case.
    window.visualViewport?.addEventListener('resize', recalc)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', recalc)
      window.visualViewport?.removeEventListener('resize', recalc)
    }
  }, [isMobile])

  const panelStyle: React.CSSProperties =
    phase === 'after'
      ? { position: 'absolute', top: afterTop, left: 0, width: '100vw', height: '100vh' }
      : { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }

  if (isMobile) {
    return (
      <div id="fitness" style={{ position: 'relative', background: '#fff', zIndex: 10, padding: '5rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {MOBILE_ITEMS.map((mi, i) => (
            <AnimateReveal key={i} delay={(i % 4) * 0.05}>
              {mi.type === 'heading' && (
                <h2 style={{
                  fontSize: 'clamp(2.4rem, 8vw, 3.2rem)',
                  fontWeight: 600, lineHeight: 1.1,
                  letterSpacing: '0.02em', color: '#000', margin: 0,
                }}>
                  {mi.text}
                </h2>
              )}
              {mi.type === 'label' && (
                <p style={{
                  fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.1em',
                  color: '#000', margin: 0,
                }}>
                  {mi.text}
                </p>
              )}
              {mi.type === 'text' && (
                <p style={{
                  fontSize: '1.4rem', lineHeight: 1.6,
                  letterSpacing: '0.03em', color: '#000', margin: 0,
                }}>
                  {mi.text}
                </p>
              )}
              {mi.type === 'image' && (
                <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img loading="lazy" src={mi.src} alt={mi.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </AnimateReveal>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={spacerRef}
      id="fitness"
      style={{ position: 'relative', height: spacerH, background: '#000', zIndex: 10 }}
    >
      <div
        style={{
          ...panelStyle,
          overflow: 'hidden',
          zIndex: 15,
          background: '#fff',
          transform: `translate3d(${slideX}vw, 0, 0)`,
          willChange: 'transform',
          // Hide completely when fully off-screen to prevent visibility during pre-scroll
          visibility: slideX >= 100 ? 'hidden' : 'visible',
        }}
      >
        <div
          ref={stripRef}
          style={{
            display: 'flex', alignItems: 'flex-start',
            height: '100vh', width: 'max-content',
            background: '#fff',
            transform: `translateX(${translateX}px)`,
            willChange: 'transform',
          }}
        >
          {/* PANEL 1 */}
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', padding: '0 6rem', gap: '5rem', flexShrink: 0 }}>
            <div style={{ flexShrink: 0, width: '20vw' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 2.8vw, 3.6rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '0.02em', color: '#000', margin: 0 }}>
                Our Work
              </h2>
            </div>
            <div style={{ flexShrink: 0, width: '38vw', height: '78vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i1} alt="Real estate site brochure design by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '80% 20%' }} />
            </div>
            <div style={{ flexShrink: 0, width: '22vw' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.1em', color: '#000', marginBottom: '1.2rem' }}>
                Site Brochure
              </p>
              <p style={{ fontSize: 'clamp(1.1rem, 1.1vw, 1.4rem)', lineHeight: 1.65, letterSpacing: '0.04em', color: '#000' }}>
                We&apos;ll let it do the talking. Inside are identities that found their edge,
                campaigns that owned their space and projects that became brands.
              </p>
            </div>
          </div>

          {/* PANEL 2 */}
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', padding: '0 4rem', gap: '3rem', flexShrink: 0 }}>
            <div style={{ flexShrink: 0, width: '20vw', height: '65vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i2} alt="Real estate company profile design by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flexShrink: 0, width: '22vw', height: '72vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i3} alt="Corporate company profile brochure layout by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             
            </div>
            <div style={{ flexShrink: 0, width: '20vw' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.1em', color: '#000', marginTop: '2rem', marginBottom: '0.6rem' }}>
                Company Profile
              </p>
              <p style={{ fontSize: 'clamp(1.1rem, 1.1vw, 1.4rem)', lineHeight: 1.65, letterSpacing: '0.04em', color: '#000' }}>
              The Skyline Remembers Great Architecture. The Market Remembers Great Branding. This Is Where We Made Our Mark.
              </p>
            </div>
          </div>

          {/* PANEL 3 */}
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', padding: '0 4rem', gap: '3rem', flexShrink: 0 }}>
            <div style={{ flexShrink: 0, width: '28vw', height: '78vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i4} alt="Real estate campaign creative by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '20% 0%' }} />
            </div>
            <div style={{ flexShrink: 0, width: '28vw', height: '75vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i5} alt="Real estate marketing campaign design by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flexShrink: 0, width: '18vw' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.1em', color: '#000', marginBottom: '1.2rem' }}>
                Campaign
              </p>
              <p style={{ fontSize: 'clamp(1.1rem, 1.1vw, 1.4rem)', lineHeight: 1.65, letterSpacing: '0.04em', color: '#000' }}>
                Every project becomes a case study our clients are proud to share, from first
                sketch to the finished brand on the ground.
              </p>
            </div>
          </div>

          {/* PANEL 4 */}
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', padding: '0 4rem', gap: '3rem', flexShrink: 0 }}>
            <div style={{ flexShrink: 0, width: '28vw', height: '72vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i6} alt="360 degree real estate branding by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flexShrink: 0, width: '48vw', height: '78vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i7} alt="Integrated 360 degree branding touchpoints by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' }} />
            </div>
            <div style={{ flexShrink: 0, width: '20vw' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.1em', color: '#000', marginBottom: '1.2rem' }}>
                360 Branding
              </p>
              <p style={{ fontSize: 'clamp(1.1rem, 1.1vw, 1.4rem)', lineHeight: 1.65, letterSpacing: '0.04em', color: '#000' }}>
                From Naming To Launch: One Connected Creative Journey, Across Every Touchpoint.
              </p>
            </div>
            <div style={{ flexShrink: 0, width: '6vw' }} />
          </div>

          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', padding: '0 4rem', gap: '3rem', flexShrink: 0 }}>
            <div style={{ flexShrink: 0, width: '28vw', height: '72vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i8} alt="Real estate print media advertisement by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flexShrink: 0, width: '48vw', height: '78vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i9} alt="Newspaper and print advertising design by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%' }} />
            </div>
            <div style={{ flexShrink: 0, width: '20vw' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.1em', color: '#000', marginBottom: '1.2rem' }}>
                Print Media
              </p>
              <p style={{ fontSize: 'clamp(1.1rem, 1.1vw, 1.4rem)', lineHeight: 1.65, letterSpacing: '0.04em', color: '#000' }}>
                A Compelling Position. A Powerful Story. A Brand Built To Be Chosen.
              </p>
            </div>
            <div style={{ flexShrink: 0, width: '6vw' }} />
          </div>

          {/* PANEL 10 */}
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', padding: '0 6rem', gap: '5rem', flexShrink: 0 }}>
            <div style={{ flexShrink: 0, width: '20vw' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 2.8vw, 3.6rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '0.02em', color: '#000', margin: 0 }}>
                Stall Design
              </h2>
            </div>
            <div style={{ flexShrink: 0, width: '38vw', height: '78vh', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={IMG.i10} alt="Real estate exhibition stall design by Zurich Graphics" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '80% 20%' }} />
            </div>
            <div style={{ flexShrink: 0, width: '22vw' }}>
              <p style={{ fontSize: 'clamp(1.1rem, 1.1vw, 1.4rem)', lineHeight: 1.65, letterSpacing: '0.04em', color: '#000' }}>
                Over three decades of experience, a deep understanding of Indian realty and a
                strategy-first approach: identities that found their edge, campaigns that owned
                their space and projects that became brands.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
