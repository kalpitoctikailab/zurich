'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cdn } from '@/app/lib/cdn'

interface CaseStudyLabeledImageProps {
  /** omit to render just the image, no heading */
  label?: string
  /** optional paragraph rendered under the heading (side layout's left column) */
  body?: string
  src: string
  alt?: string
  /** 'top' (default): heading above the image. 'side': text on the left, image on the right. */
  layout?: 'top' | 'side'
}

const EASE: [number, number, number, number] = [0.7, 0, 0.3, 1]

/**
 * A single image shown at its actual size — not stretched to fill the
 * container, just capped so it can't overflow. Optionally accompanied by a
 * heading (and body text), either stacked above (layout="top", the default)
 * or as a left text column beside the image (layout="side"). Breathing room
 * above and below is built in so these sections don't butt up against the
 * full-bleed gallery images around them.
 */
export default function CaseStudyLabeledImage({ label, body, src, alt, layout = 'top' }: CaseStudyLabeledImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const heading = label ? (
    <motion.h3
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="cs-labeled-heading"
      style={{
        fontSize: 'clamp(2rem, 3vw, 3.5rem)',
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: '#fff',
        padding:'4rem',
        margin: layout === 'side' ? 0 : '0 0 3rem',
      }}
    >
      {label}
    </motion.h3>
  ) : null

  const bodyText = body ? (
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      style={{
        fontSize: '1.5rem',
        lineHeight: 1.75,
        letterSpacing: '0.03em',
        color: 'rgba(255,255,255,0.6)',
        margin: '2.4rem 0 0',
      }}
    >
      {body}
    </motion.p>
  ) : null

  const image = (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      style={{ maxWidth: '100%' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        src={cdn(src)}
        alt={alt || label || 'Case study image'}
        style={{ maxWidth: '100%', width: 'auto', height: 'auto', display: 'block' }}
      />
    </motion.div>
  )

  const styleTag = (
    <style>{`
      @media (max-width: 768px) {
        .cs-labeled {
          padding: 0 2rem !important;
          margin: 4rem 0 !important;
        }
        .cs-labeled-heading {
          padding: 2rem 0 !important;
        }
      }
    `}</style>
  )

  if (layout === 'side') {
    return (
      <div
        ref={ref}
        className="cs-labeled"
        style={{
          width: '100%',
          margin: '6rem 0',
          padding: '0 8rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'clamp(3rem, 5vw, 7rem)',
        }}
      >
        {/* text column — left */}
        <div style={{ flex: '1 1 300px', minWidth: 'min(100%, 300px)', maxWidth: 480 }}>
          {heading}
          {bodyText}
        </div>
        {/* image — right */}
        <div style={{ flex: '2 1 400px', minWidth: 'min(100%, 300px)', display: 'flex', justifyContent: 'center' }}>
          {image}
        </div>
        {styleTag}
      </div>
    )
  }

  return (
    <div ref={ref} className="cs-labeled" style={{
      width: '100%',
      margin: '6rem 0',
      padding: '0 8rem',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {heading}
      {bodyText}
      {image}
      {styleTag}
    </div>
  )
}
