'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import SvgIcon from '@/app/components/ui/SvgIcon'
import { cdn } from '@/app/lib/cdn'

// Remote image URLs from reference site
const BG_NIGHT = '/herobanner-image-new.jpeg'
const DECOR_MODEL = '/images/Herobanner Model.png'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const logoY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.08])

  useEffect(() => { setMounted(true) }, [])

  return (
    <section
      ref={ref}
      id="top"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: 600,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* ── LEFT solid black strip ── */}
      <div className="hero-left-strip" style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: '33%',
        background: '#000',
        zIndex: 2,
      }} />

      {/* ── RIGHT — night building photo from reference ── */}
      <div className="hero-image-wrap" style={{
        position: 'absolute',
        left: '33%',
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
      }}>
        <motion.div style={{ scale: imgScale, position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-bg-photo"
            src={cdn(BG_NIGHT)}
            alt="Zurich Graphics Real Estate Branding"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'left center',
            }}
          />
        </motion.div>
      </div>

      {/* ── MODEL — anchored bottom, straddles the 33% boundary ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 'calc(33% - 14vw)',
        width: 'clamp(200px, 28vw, 460px)',
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        <motion.div style={{ scale: imgScale, transformOrigin: 'bottom center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* <img
            src={cdn(DECOR_MODEL)}
            alt=""
            style={{ width: '100%', height: 'auto', display: 'block' }}
          /> */}
        </motion.div>
      </div>

      {/* ── TOP-LEFT headline — starts at same top as header ──
          Always rendered (not gated behind `mounted`) so the H1 is present
          in the server-rendered HTML for crawlers; framer-motion already
          renders the `initial` state on the server and animates to
          `animate` once it hydrates, so the reveal looks identical. */}
      <div className="hero-headline" style={{
        position: 'absolute',
        top: '2.4rem',
        left: '4rem',
        zIndex: 6,
        maxWidth: 'calc(33% - 4rem)',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1], delay: 0.3 }}
          style={{
            color: '#fff',
            fontSize: '3.6rem',
            fontWeight: 600,
            lineHeight: '38px',
            letterSpacing: '0.02em',
            marginBottom: '2.8rem',
            whiteSpace: 'pre-line',
          }}
        >
          India&apos;s Premier Agency For Powerful Real Estate Brands
        </motion.h1>

        <motion.img
          src={cdn("/zurich-logo-White.svg")}
          alt="Zurich Graphics"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1], delay: 0.45 }}
          style={{ display: 'block', width: 'clamp(120px, 15vw, 220px)', height: 'auto', marginBottom: '2.4rem' }}
        />

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1], delay: 0.6 }}
          aria-label="Scroll Down"
          style={{ display: 'inline-block', lineHeight: 0, color: '#fff' }}
        >
          <SvgIcon id="long-arrow-down" width={14} height={41} style={{ color: '#fff' }} />
        </motion.a>
      </div>

      {/* ── GIANT BRAND NAME at bottom ── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 6,
          y: logoY,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {mounted && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.3, ease: [0.7, 0, 0.3, 1], delay: 0.1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-wordmark"
              src={cdn("/images/zurich-text.svg")}
              alt="Zurich"
              style={{
                display: 'block',
                width: 'clamp(280px, 55vw, 850px)',
                height: 'auto',
                paddingLeft: '2.4rem',
                margin: 0,
              }}
            />
          </motion.div>
        )}
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .hero-left-strip {
            display: none !important;
          }
          .hero-image-wrap {
            left: 0 !important;
          }
          .hero-bg-photo {
            object-fit: contain !important;
            object-position: center center !important;
            background: #000;
          }
          .hero-headline {
            top: 7rem !important;
            left: 2rem !important;
            right: 2rem !important;
            max-width: calc(100% - 4rem) !important;
          }
          .hero-headline p {
            font-size: clamp(2rem, 6.5vw, 2.8rem) !important;
            line-height: 1.25 !important;
          }
          img.hero-wordmark {
            width: clamp(200px, 70vw, 400px) !important;
            padding-left: 1.2rem !important;
          }
        }
      `}</style>
    </section>
  )
}
