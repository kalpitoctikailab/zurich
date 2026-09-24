'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimateReveal from '@/app/components/ui/AnimateReveal'

const EASE = 'cubic-bezier(.7,0,.3,1)'

const CRAFTS = [
  {
    title: 'Brand Strategy & Consulting',
    tag: 'The thinking before the ink',
    body: 'Positioning, naming, and the launch roadmap: every project starts as a strategy conversation, not an artwork request.',
    image: '/portfolio/commercial-projects/krupa-aspire/01.jpg',
  },
  {
    title: 'Strategic Design',
    tag: 'Identities built to last',
    body: 'Identities and design systems that survive beyond the launch: logo to livery, one coherent voice.',
    image: '/portfolio/residencial-projects/greenleaf heritage/g3.jpg',
  },
  {
    title: 'Brochure Design',
    tag: 'Print that gets kept',
    body: 'The piece a buyer takes home. Paper, foil, binding, and storytelling engineered to stay on the table.',
    image: '/portfolio/residencial-projects/greenleaf heritage/g7.jpg',
  },
  {
    title: 'Advertising',
    tag: 'Campaigns people quote',
    body: 'Hoardings, press, and launch campaigns that make a project the one everybody has already heard of.',
    image: '/portfolio/corporate-brochure/krrish-group/01.jpg',
  },
  {
    title: 'Exhibitions',
    tag: 'Brands you can walk into',
    body: 'Stalls, pavilions, and experience centres: the brand at full scale, built to be walked through.',
    image: '/portfolio/commercial-projects/krupa-aspire/09.jpg',
  },
  {
    title: 'Brand Communication',
    tag: 'End to end, one voice',
    body: 'Everything between first hoarding and handover: managed as one continuous brand conversation.',
    image: '/portfolio/corporate-brochure/krrish-group/08.jpg',
  },
]

/**
 * Expanding-panel service index: six full-height portfolio panels sit side
 * by side; the active one unfolds to show the service story while the rest
 * compress to slim slivers. Hover drives it on desktop, tap on touch.
 */
export default function AboutCraft() {
  const [active, setActive] = useState(0)

  return (
    <section
      id="about-craft"
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '10rem 4rem 8rem',
      }}
    >
      <div style={{ maxWidth: 1500, margin: '0 auto', width: '100%' }}>
        <AnimateReveal>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '4rem',
          }}>
            <span style={{
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              color: '#fff',
            }}>
              What we do
            </span>
            <span style={{
              fontSize: '1.1rem',
              letterSpacing: '0.16em',
              color: 'rgba(255,255,255,0.35)',
            }}>
              6 service lines
            </span>
          </div>
        </AnimateReveal>

        <div
          className="craft-accordion"
          style={{
            display: 'flex',
            gap: '0.8rem',
            height: 'min(64vh, 620px)',
          }}
        >
          {CRAFTS.map((craft, i) => {
            const isActive = i === active
            return (
              <motion.div
                key={craft.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1], delay: i * 0.08 }}
                data-active={isActive}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{
                  position: 'relative',
                  flexGrow: isActive ? 5 : 1,
                  flexBasis: 0,
                  minWidth: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: `flex-grow 0.9s ${EASE}`,
                }}
              >
                {/* panel image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  loading="lazy"
                  src={craft.image}
                  alt={craft.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: isActive ? 'grayscale(0) brightness(0.85)' : 'grayscale(1) brightness(0.45)',
                    transform: isActive ? 'scale(1)' : 'scale(1.12)',
                    transition: `filter 0.9s ${EASE}, transform 1.2s ${EASE}`,
                  }}
                />
                {/* readability gradient */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: isActive
                    ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.25) 100%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
                  transition: `background 0.9s ${EASE}`,
                }} />

                {/* index — always visible, top corner */}
                <span style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  fontSize: '1.25rem',
                  letterSpacing: '0.14em',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  transition: 'color 0.5s ease',
                  zIndex: 2,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* collapsed label — vertical along the sliver */}
                <span
                  className="craft-vlabel"
                  aria-hidden={isActive}
                  style={{
                    position: 'absolute',
                    bottom: '2.4rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    writingMode: 'vertical-rl',
                    rotate: '180deg',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    whiteSpace: 'nowrap',
                    color: 'rgba(255,255,255,0.85)',
                    opacity: isActive ? 0 : 1,
                    transition: `opacity 0.45s ${EASE}`,
                    zIndex: 2,
                  }}
                >
                  {craft.title}
                </span>

                {/* expanded content */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '2.8rem',
                  zIndex: 2,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ${EASE} 0.25s, transform 0.6s ${EASE} 0.25s`,
                  pointerEvents: 'none',
                }}>
                  <span style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    letterSpacing: '0.18em',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '1.2rem',
                  }}>
                    {craft.tag}
                  </span>
                  <h3 style={{
                    fontSize: 'clamp(2rem, 2.4vw, 3.4rem)',
                    fontWeight: 600,
                    lineHeight: 1.1,
                    letterSpacing: '0.03em',
                    margin: 0,
                    marginBottom: '1.4rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {craft.title}
                  </h3>
                  <p style={{
                    fontSize: '1.35rem',
                    lineHeight: 1.65,
                    letterSpacing: '0.03em',
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0,
                    maxWidth: 440,
                  }}>
                    {craft.body}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .craft-accordion {
            flex-direction: column !important;
            height: auto !important;
          }
          .craft-accordion > div {
            flex-grow: 1 !important;
            min-height: 88px;
            transition: min-height 0.9s cubic-bezier(.7,0,.3,1) !important;
          }
          .craft-accordion > div[data-active="true"] {
            min-height: 400px;
          }
          .craft-accordion .craft-vlabel {
            writing-mode: horizontal-tb !important;
            rotate: none !important;
            left: 6rem !important;
            right: 2rem;
            top: 1.7rem;
            bottom: auto !important;
            transform: none !important;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>
    </section>
  )
}
