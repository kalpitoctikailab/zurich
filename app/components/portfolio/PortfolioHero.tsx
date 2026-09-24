'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import SvgIcon from '@/app/components/ui/SvgIcon'

interface PortfolioHeroProps {
  title: string
  imageSrc: string
  imageAlt: string
  subtitle?: string
  /** where "back" should return to — the portfolio index with this project's tab pre-selected */
  backHref?: string
}

export default function PortfolioHero({
  title,
  imageSrc,
  imageAlt,
  backHref,
}: PortfolioHeroProps) {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1])


  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: 600,
        overflow: 'hidden',
      }}
    >
      {/* Back — returns to the portfolio index with this project's own tab
          already selected. Fixed + mirrors Header's Enquire-button styling,
          sitting opposite it on the left at the same vertical offset. */}
      {backHref && (
        <Link
          href={backHref}
          className="portfolio-back-btn"
          style={{
            position: 'fixed',
            top: '2.4rem',
            left: '4rem',
            zIndex: 101,
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1rem 2rem',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            fontSize: '1.2rem',
            letterSpacing: '0.04em',
          }}
        >
          <SvgIcon id="long-arrow-left" width={14} height={12} style={{ color: '#fff' }} />
          Back
        </Link>
      )}

      {/* Visually-hidden but crawlable — the visual title lives inside the
          hero image itself, so this gives the page a real, descriptive H1
          without duplicating on-screen text. */}
      {title && (
        <h1 style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}>
          {title}
        </h1>
      )}

      <style>{`
        @media (max-width: 640px) {
          .portfolio-back-btn {
            top: 1.6rem !important;
            left: 2rem !important;
            padding: 0.8rem 1.6rem !important;
          }
        }
      `}</style>

      {/* Centered Image Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          zIndex: 1,
        }}
      >
        <motion.div
          style={{
            scale: imgScale,
            position: 'relative',
            width: '100%',
            maxWidth: '1400px',
            height: '80vh',
            minHeight: '500px',
            maxHeight: '800px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={imageSrc}
            alt={imageAlt}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              borderRadius: '4px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          />
        </motion.div>
      </div>

    </section>
  )
}
