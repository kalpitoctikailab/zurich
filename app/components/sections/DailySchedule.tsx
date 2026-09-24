'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import SvgIcon from '@/app/components/ui/SvgIcon'
import { cdn } from '@/app/lib/cdn'

// hour is 0–11 on a 12-hour face (0 stands in for 12, so we never store the literal 12)
const ITEMS = [
  {
    time: 'Discover',
    image: '/daily-schedule/w1.jpg',
    text: 'We start by understanding the project, the market and the buyer: what makes this realty different, and who it needs to speak to.',
    hour: 10,
  },
  {
    time: 'Define',
    image: '/daily-schedule/w2.jpg',
    text: 'We define the project\'s place in the market before a single design element is created. Strategy first, position, then promotion.',
    hour: 11,
  },
  {
    time: 'Research',
    image: '/daily-schedule/w3.jpg',
    text: 'Three decades of experience and a deep understanding of Indian realty shape every brief, from residential to industrial projects.',
    hour: 0,
  },
  {
    time: 'Create',
    image: '/daily-schedule/w4.jpg',
    text: 'Naming, identity, brochures, campaigns and digital experiences come together under one roof: one sharp idea runs through every piece.',
    hour: 1,
  },
  {
    time: 'Refine',
    image: '/daily-schedule/w5.jpg',
    text: 'Every element is tested against the market, sharpened until the brand experience feels inevitable, not accidental.',
    hour: 2,
  },
  {
    time: 'Deliver',
    image: '/daily-schedule/w6.jpg',
    text: 'From concept to conversion, the brand goes live across every physical and digital touchpoint, ready to make the market notice.',
    hour: 3,
  },
  {
    time: 'Support',
    image: '/daily-schedule/w7.jpg',
    text: 'We stay connected past launch, carrying one consistent brand story seamlessly across every buyer touchpoint.',
    hour: 4,
  },
]

// Converts a clock hour (0–11) to the rotate() degrees this hand's coordinate
// system uses, normalised to 0–359 (0 = 3 o'clock, -90/270 = 12 o'clock).
function hourToDeg(hour: number) {
  return (((hour * 30 - 90) % 360) + 360) % 360
}

export default function DailySchedule() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = next (right→left), -1 = prev (left→right)
  // Raw, unclamped rotation for the hand — keeps accumulating in whichever
  // direction was last clicked so the hand always sweeps forward on "next"
  // and backward on "prev", including across the wrap between last and first.
  const [rotation, setRotation] = useState(() => hourToDeg(ITEMS[0].hour))
  const item = ITEMS[active]

  const leftRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: leftRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  const prev = () => {
    const prevIndex = (active - 1 + ITEMS.length) % ITEMS.length
    const targetDeg = hourToDeg(ITEMS[prevIndex].hour)
    const current = ((rotation % 360) + 360) % 360
    let delta = targetDeg - current
    if (delta >= 0) delta -= 360 // always sweep backward
    setDirection(-1)
    setRotation(r => r + delta)
    setActive(prevIndex)
  }
  const next = () => {
    const nextIndex = (active + 1) % ITEMS.length
    const targetDeg = hourToDeg(ITEMS[nextIndex].hour)
    const current = ((rotation % 360) + 360) % 360
    let delta = targetDeg - current
    if (delta <= 0) delta += 360 // always sweep forward
    setDirection(1)
    setRotation(r => r + delta)
    setActive(nextIndex)
  }

  return (
    <section
      id="schedule"
      className="schedule-section"
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        width: '100%',
        height: '100svh',
        minHeight: 600,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Clock positioned at the center divider */}
      <div className="schedule-clock" style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vh',
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: '50%',
      }}>
        {/* Clock circle */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.15)',
        }} />

        {/* Fixed vertical line (always pointing up) - starts from center, extends to top */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '50%',
          height: '1px',
          background: '#fff',
          transformOrigin: 'left center',
          transform: 'translateY(-50%) rotate(-90deg)',
        }} />

        {/* Rotating line (changes with slider) - starts from center, rotates */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '50%',
            height: '1px',
            background: '#fff',
            transformOrigin: 'left center',
            transform: 'translateY(-50%)',
          }}
        />
      </div>

      {/* ── LEFT — tall image only, no text overlay ── */}
      <div ref={leftRef} className="schedule-left" style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={`img-${active}`}
            custom={direction}
            initial={{ x: direction === 1 ? '100%' : '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: direction === 1 ? '-100%' : '100%' }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
          >
            <motion.div style={{ y: imgY, position: 'absolute', inset: '-14% 0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={cdn(item.image)}
                alt={item.time}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── RIGHT — black panel: time + text bottom-left + arrows ── */}
      <div className="schedule-right" style={{
        background: '#000',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Time digits (title) + description — stacked together, centred */}
        <div style={{ position: 'relative', zIndex: 2, marginRight: '8%', maxWidth: 440 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={`time-${active}`}
              className="schedule-time"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
              style={{
                fontSize: 'clamp(5rem, 8vw, 11rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#fff',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.time}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`text-${active}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1], delay: 0.1 }}
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 'clamp(1.1rem, 1.1vw, 1.35rem)',
                lineHeight: 1.6,
                letterSpacing: '0.03em',
                marginTop: '2rem',
              }}
            >
              {item.text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ← → arrows — right side, vertically centred */}
        <div style={{
          position: 'absolute',
          right: '3.2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
        }}>
          <button
            onClick={prev}
            aria-label="Previous"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', lineHeight: 0, padding: '0.4rem' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.4')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <SvgIcon id="long-arrow-left" width={41} height={14} />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', lineHeight: 0, padding: '0.4rem' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.4')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <SvgIcon id="long-arrow-right" width={41} height={14} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .schedule-section {
            grid-template-columns: 1fr !important;
            height: auto !important;
            min-height: 100svh !important;
          }
          .schedule-left {
            height: 46svh !important;
            min-height: 320px !important;
          }
          .schedule-right {
            min-height: 46svh !important;
            padding: 3.2rem 0 !important;
          }
          .schedule-clock {
            width: min(80vw, 60vh) !important;
            height: min(80vw, 60vh) !important;
            top: 46svh !important;
          }
        }
        @media (max-width: 640px) {
          .schedule-time {
            font-size: clamp(3.2rem, 12vw, 5rem) !important;
          }
        }
      `}</style>
    </section>
  )
}
