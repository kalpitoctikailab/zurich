'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cdn } from '@/app/lib/cdn'

interface CaseStudyIntroProps {
  title: string
  subtitle?: string
  body?: string | string[]
  location?: string
  src: string
  alt?: string
}

const EASE: [number, number, number, number] = [0.7, 0, 0.3, 1]

/**
 * Centered case-study intro block: big uppercase title, a centered
 * description paragraph, a bolder location line, and the image below —
 * everything center-aligned, matching the client's case-study cover layout.
 */
export default function CaseStudyIntro({ title, subtitle, body, location, src, alt }: CaseStudyIntroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const paragraphs = Array.isArray(body) ? body : body ? [body] : []

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, ease: EASE, delay },
  })

  return (
    <div
      ref={ref}
      className="cs-intro"
      style={{
        width: '100%',
        margin: '6rem 0',
        padding: '0 8rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <motion.h2
        {...reveal(0)}
        style={{
          fontSize: 'clamp(2.8rem, 4vw, 5.2rem)',
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: '#fff',
          margin: 0,
          marginBottom: '2.8rem',
        }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          {...reveal(0.08)}
          style={{
            fontSize: 'clamp(1.8rem, 2vw, 2.4rem)',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '0.02em',
            color: '#fff',
            maxWidth: 760,
            margin: 0,
            marginBottom: '2.4rem',
          }}
        >
          {subtitle}
        </motion.p>
      )}

      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          {...reveal(0.12 + i * 0.06)}
          style={{
            fontSize: '1.4rem',
            lineHeight: 1.8,
            letterSpacing: '0.03em',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 720,
            margin: 0,
            marginBottom: i === paragraphs.length - 1 ? '4rem' : '1.4rem',
          }}
        >
          {p}
        </motion.p>
      ))}

      {/* no bottom margin — the image below carries its own whitespace */}
      {location && (
        <motion.p
          {...reveal(0.2)}
          style={{
            fontSize: 'clamp(1.6rem, 1.6vw, 2.2rem)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: '#fff',
            margin: 0,
          }}
        >
          {location}
        </motion.p>
      )}

      <motion.div {...reveal(0.28)} style={{ maxWidth: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src={cdn(src)}
          alt={alt || title}
          style={{ maxWidth: '100%', width: 'auto', height: 'auto', display: 'block', margin: '0 auto' }}
        />
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .cs-intro {
            padding: 0 2rem !important;
            margin: 4rem 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
