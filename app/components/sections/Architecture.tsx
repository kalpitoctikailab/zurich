'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Remote style images from reference site
const IMG = {
  image1: '/images/banner-section-image.jpeg',
  image2: 'https://zorge9.estate/assets/images/media/landing/6.style/image-2@xxl.webp?v=1779376336',
  image3: 'https://zorge9.estate/assets/images/media/landing/6.style/image-3@xxl.webp?v=1779376336',
  image4: 'https://zorge9.estate/assets/images/media/landing/6.style/image-4@xxl.webp?v=1779376336',
  image5: 'https://zorge9.estate/assets/images/media/landing/6.style/image-5@xxl.webp?v=1779376336',
  decor1: '/images/3d-hoarding.png',
  decor2: '/images/3d-Brochure.png',
  decor3: '/images/3d-letterhead.png',
  decor4: '/images/3d-Logo.png',
  decor5: '/images/3d-magazine.png',
  decor6: '/images/3d-mobile app.png',
}

function ParallaxImg({ src, alt = '', style, imgStyle }: {
  src: string
  alt?: string
  style?: React.CSSProperties
  imgStyle?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <div ref={ref} style={{ overflow: 'hidden', ...style }}>
      <motion.div style={{ y, position: 'relative', height: '116%', top: '-8%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src={src}
          alt={alt}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            ...imgStyle,
          }}
        />
      </motion.div>
    </div>
  )
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.85, ease: [0.7, 0, 0.3, 1] as [number, number, number, number], delay },
  }
}

export default function Architecture() {
  return (
    <section
      id="style"
      style={{ background: '#fff', color: '#000', overflow: 'hidden' }}
    >
      {/* ─────────────────────────────────────────────────────────────
          BLOCK 1 — large paragraph (right half) + image-1 full width
      ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '10rem 4rem 6rem' }}>
        {/* Heading — right 50% */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', marginBottom: '6rem' }}>
          <div /> {/* empty left */}
          <motion.p {...fadeUp(0)} style={{
            fontSize: 'clamp(2.4rem, 3.2vw, 2rem)',
            fontWeight: 600, lineHeight: 1.3,
            letterSpacing: '0.01em',
            margin: 0,
          }}>
            We build the complete creative journey of a real estate brand. Every strategy,
            design and message works together to create a consistent market impact. Naming,
            identity, brochures, campaigns and digital experiences: all brought together under
            one roof. The result is one powerful brand story, carried seamlessly across every
            buyer touchpoint.
          </motion.p>
        </div>
      </div>

      {/* image-1 — full width, tall */}
      <ParallaxImg
        src={IMG.image1}
        alt="Real estate brand identity and campaign work by Zurich Graphics"
        style={{ width: '100%', aspectRatio: '16/7' }}
      />

      {/* "Panoramic windows / architectural lighting" — left padded */}
      <div style={{ padding: '4rem 4rem 8rem' }}>
        <motion.p {...fadeUp(0.05)} style={{
          fontSize: 'clamp(3.2rem, 5vw, 7.2rem)',
          fontWeight: 600, lineHeight: 1.0,
          letterSpacing: '0.01em',
          margin: 0,
        }}>
          Think Sharp<br />
          Create Brave
        </motion.p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BLOCK 2 — image-2 (portrait, left) + image-3 (square, right)
                    with "Premium materials" label bottom-right
      ───────────────────────────────────────────────────────────── */}
      {/* <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'end',
        gap: 0,
      }}>
        <div style={{ paddingLeft: '25%', paddingBottom: '6rem' }}>
          <ParallaxImg src={IMG.image2} style={{ aspectRatio: '5/6' }} />
        </div>

        <ParallaxImg src={IMG.image3} style={{ aspectRatio: '1/1' }} />
      </div> */}

      {/* "Premium materials" — right-aligned */}
      <div style={{ padding: '4rem 4rem 8rem', textAlign: 'right' }}>
        <motion.p {...fadeUp(0)} style={{
          fontSize: 'clamp(3.2rem, 5vw, 7.2rem)',
          fontWeight: 600, lineHeight: 1.0,
          letterSpacing: '0.01em',
          margin: 0,
        }}>
          Deliver Results<br />Be Remembered
        </motion.p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BLOCK 3 — decorative materials collage (stacked parallax layers)
      ───────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', padding: '0 4rem 8rem' }}>
        <DecorLayers />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BLOCK 4 — luxury text (small, left half)
      ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '0 4rem 6rem' }}>
        <motion.p className="arch-luxury-text" {...fadeUp(0)} style={{
          fontSize: 'clamp(1.2rem, 1.4vw, 1.6rem)',
          fontWeight: 600, lineHeight: 1.6,
          letterSpacing: '0.06em',
          maxWidth: '52%',
          margin: 0,
        }}>
          Built in the studio. Tested in the market. Remembered across cities.
        </motion.p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BLOCK 5 — image-4 + image-5 side by side (square)
      ───────────────────────────────────────────────────────────── */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <ParallaxImg src={IMG.image4} style={{ aspectRatio: '1/1' }} />
        <ParallaxImg src={IMG.image5} style={{ aspectRatio: '1/1' }} />
      </div> */}

      <style>{`
        @media (max-width: 768px) {
          #style > div {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          .arch-luxury-text {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}

// Decorative material collage — multiple parallax layers stacked
function DecorLayers() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // Reduced parallax range for smoother performance
  const y1 = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const y4 = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const y5 = useTransform(scrollYProgress, [0, 1], ['12%', '-12%'])
  const y6 = useTransform(scrollYProgress, [0, 1], ['14%', '-14%']) 

  const layers = [
    { src: IMG.decor1, alt: 'Real estate logo design mockup', y: y1, size: '33%', top: '15%', left: '10%' },        // Logo - top far left
    { src: IMG.decor2, alt: 'Real estate brochure design mockup', y: y2, size: '20%', top: '42%', left: '48%' },       // Brochure - top left-center
    { src: IMG.decor3, alt: 'Corporate letterhead design mockup', y: y3, size: '20%', top: '41.5%', left: '69%' },      // Letterhead - top right-center
    { src: IMG.decor6, alt: 'Real estate mobile app design mockup', y: y6, size: '8%', top: '15%', left: '48%' },      // Mobile app - bottom far left
    { src: IMG.decor5, alt: 'Real estate magazine ad design mockup', y: y5, size: '15%', top: '65%', left: '32%' },     // Magazine - bottom left-center
    { src: IMG.decor4, alt: 'Real estate hoarding design mockup', y: y4, size: '12%', top: '15%', left: '58%' },     // Hoarding - bottom right-center (largest)
  ]

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {layers.map((layer, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: layer.top,
            left: layer.left,
            width: layer.size,
            height: 'auto',
            y: layer.y,
            willChange: 'transform',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={layer.src}
            alt={layer.alt}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
