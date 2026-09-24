'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import SvgIcon from '@/app/components/ui/SvgIcon'
import { cdn } from '@/app/lib/cdn'

const EASE: [number, number, number, number] = [0.7, 0, 0.3, 1]

// Floating cluster: each image lives at its own depth — a different mouse
// parallax factor and scroll drift — so the hero reads as layered space.
const FLOATERS = [
  {
    src: '/images/About us page_261px X 348px.jpeg',
    width: 'clamp(160px, 17vw, 300px)',
    aspect: '3 / 4',
    pos: { top: '9%', right: '7%' } as React.CSSProperties,
    mouse: -28,
    drift: '-18%',
    delay: 0.9,
  },
  {
    src: '/images/About us page_153px X 153px.jpeg',
    width: 'clamp(130px, 13vw, 230px)',
    aspect: '4 / 3',
    pos: { bottom: '34%', left: '5%' } as React.CSSProperties,
    mouse: 40,
    drift: '14%',
    delay: 1.05,
  },
  {
    src: '/images/About us page_200px X 149px.jpeg',
    width: 'clamp(110px, 10vw, 190px)',
    aspect: '1 / 1',
    pos: { bottom: '13%', right: '16%' } as React.CSSProperties,
    mouse: 18,
    drift: '-10%',
    delay: 1.2,
  },
]

export default function AboutManifesto() {
  const ref = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-9%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['0%', '7%'])
  const x3 = useTransform(scrollYProgress, [0, 1], ['0%', '-5%'])

  // normalized cursor position (-0.5 … 0.5), smoothed
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  useEffect(() => { setMounted(true) }, [])

  const lineStyle: React.CSSProperties = {
    fontWeight: 600,
    lineHeight: 0.94,
    letterSpacing: '0.02em',
    color: '#fff',
    margin: 0,
  }

  const lines: { text: string; x: typeof x1; align: string; outlined?: boolean }[] = [
    { text: 'Realty runs deep.', x: x1, align: 'flex-start' },
    { text: 'Our brands', x: x2, align: 'center', outlined: true },
    { text: ' run ahead.', x: x3, align: 'flex-end' },
  ]

  return (
    <section
      ref={ref}
      id="about-manifesto"
      onMouseMove={onMouseMove}
      style={{
        position: 'relative',
        height: '100svh',
        minHeight: 600,
        background: '#000',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 4rem',
      }}
      className="manifesto-section"
    >
      {/* floating image cluster — behind the type */}
      <div className="manifesto-floaters">
        {FLOATERS.map(f => (
          <FloatingImage key={f.src} {...f} smx={smx} smy={smy} progress={scrollYProgress} mounted={mounted} />
        ))}
      </div>

      {/* eyebrow */}
      {mounted && (
        <motion.span
          className="manifesto-eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          style={{
            position: 'absolute',
            top: '2.8rem',
            left: '4rem',
            fontSize: '1.1rem',
            letterSpacing: '0.22em',
            color: '#fff',
            zIndex: 2,
          }}
        >
          Premium branding · print · exhibitions, since 1994
        </motion.span>
      )}

      {/* manifesto lines */}
      <h1 style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: 0 }}>
        {lines.map((line, i) => (
          <div key={line.text} style={{ display: 'flex', justifyContent: line.align, overflow: 'hidden' }}>
            {mounted && (
              <motion.span
                className="about-manifesto-line"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.15 + i * 0.14 }}
                style={{ ...lineStyle, display: 'block', x: line.x, ...(line.outlined ? {
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.85)',
                } : {}) }}
              >
                {line.text}
              </motion.span>
            )}
          </div>
        ))}
      </h1>

      {/* bottom row — intro + scroll cue */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="manifesto-bottom-row"
          style={{
            position: 'absolute',
            bottom: '3.2rem',
            left: '4rem',
            right: '4rem',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '4rem',
            zIndex: 2,
          }}
        >
          <p className="manifesto-intro-text" style={{
            fontSize: '1.4rem',
            lineHeight: 1.7,
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 620,
            margin: 0,
          }}>
            Realty is in our DNA. And after 32 years, it runs pretty deep.
            Zurich Graphics began in Vadodara in 1994 as a real estate
            branding agency, with realty at its heart and the belief that
            every project deserved an identity of its own. Vadodara remains
            our home ground, but our work has taken us across India into
            different cities, markets and buyer mindsets. Over the years, our
            thinking has grown wider and our approach sharper. Today, as a
            360&deg; branding agency, we bring strategy, naming, identity,
            brochures, campaigns, outdoor, films and digital together under
            one roof.
          </p>
          <a href="#about-passages" aria-label="Scroll Down" style={{ color: '#fff', lineHeight: 0, flexShrink: 0 }}>
            <SvgIcon id="long-arrow-down" width={14} height={41} style={{ color: '#fff' }} />
          </a>
        </motion.div>
      )}

      <style>{`
        .about-manifesto-line {
          font-size: clamp(6rem, 13vw, 15rem);
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .about-manifesto-line {
            font-size: clamp(3.2rem, 11vw, 15rem);
          }
          /* Fixed 110–300px-wide floating images with %-based positions have
             no room to live on a narrow screen without colliding with the
             text and each other — they're aria-hidden decoration whose
             mouse-parallax is already inert on touch, so hide them instead
             of trying to make three overlapping absolute-position images
             coexist with the full-width headline in ~375px. */
          .manifesto-floaters {
            display: none;
          }
          /* Desktop pins everything (eyebrow, headline, intro paragraph) to
             one fixed 100svh screen via absolute positioning + centering —
             that only works because the content fits one screen at desktop
             sizes. On mobile the same content is taller than one screen, so
             forcing height:100svh crushed it all into overlapping layers.
             Drop the fixed height and let it flow as a normal stacked page
             instead: eyebrow → headline → intro text, each in normal
             document flow (position:static rejoins them to the section's
             existing flex-column order). */
          .manifesto-section {
            height: auto !important;
            min-height: 0 !important;
            padding: 9rem 2rem 4rem !important;
            justify-content: flex-start !important;
            gap: 3rem !important;
          }
          .manifesto-eyebrow {
            position: static !important;
          }
          .manifesto-bottom-row {
            position: static !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.6rem !important;
          }
          .manifesto-intro-text {
            max-width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .about-manifesto-line {
            font-size: clamp(2.4rem, 10.5vw, 15rem);
            white-space: normal;
            overflow-wrap: break-word;
          }
        }
      `}</style>
    </section>
  )
}

function FloatingImage({
  src, width, aspect, pos, mouse, drift, delay, smx, smy, progress, mounted,
}: (typeof FLOATERS)[number] & {
  smx: ReturnType<typeof useSpring>
  smy: ReturnType<typeof useSpring>
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  mounted: boolean
}) {
  const px = useTransform(smx, (v: number) => v * mouse * 2)
  const py = useTransform(smy, (v: number) => v * mouse * 1.4)
  const scrollDrift = useTransform(progress, [0, 1], ['0%', drift])

  return (
    <motion.div
      style={{
        position: 'absolute',
        ...pos,
        width,
        aspectRatio: aspect,
        zIndex: 0,
        y: scrollDrift,
      }}
    >
      <motion.div style={{ x: px, y: py, width: '100%', height: '100%' }}>
        {mounted && (
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.15 }}
            animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
            transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1], delay }}
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={cdn(src)}
              alt=""
              aria-hidden="true"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
