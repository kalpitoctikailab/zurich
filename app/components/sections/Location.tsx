'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { motion, useScroll, useTransform } from 'framer-motion'
import TurnJSBook from '@/app/components/ui/TurnJSBook'
import type { ProjectCategory } from '@/app/lib/portfolioData'
import { cdn } from '@/app/lib/cdn'

const EXPERTISE = [
  {
    title: 'Real Estate Branding',
    description: 'Crafting unique brand identities that resonate.',
  },
  {
    title: 'Real Estate Marketing Strategies',
    description: 'Innovative marketing solutions designed to convert prospects into buyers.',
  },
  {
    title: 'Creative Design Services',
    description: 'Exceptional visuals including logos, brochures, and marketing collaterals tailored for real estate businesses.',
  },
]

const CARDS: {
  label: string
  image: string
  category: ProjectCategory
}[] = [
  { label: 'Residential Projects', image: '/images/Residential Projects.webp', category: 'residential' },
  { label: 'Commercial Projects', image: '/images/Commercial Projects.webp', category: 'commercial' },
  { label: 'Duplex Villa Projects', image: '/images/Duplex - Villa Projects.webp', category: 'duplex-villa' },
  { label: 'Mall Projects', image: '/images/Mall Projects.webp', category: 'mall' },
  { label: 'Farmhouse Projects', image: '/images/Farmhouse Projects.webp', category: 'farmhouse' },
  { label: 'Open Plot Projects', image: '/images/Open Plot Projects.webp', category: 'open-plot' },
  { label: 'Industrial Projects', image: '/images/Industrial Projects.webp', category: 'industrial-park' },
  { label: 'Corporate Projects', image: '/images/Corporate Projects.webp', category: 'corporate-brochure' },
]

function LocationCard({
  image,
  label,
  href,
}: {
  image: string
  label: string
  href: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <div className="keen-slider__slide" style={{ overflow: 'hidden' }}>
      <Link
        href={href}
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
          <motion.div style={{ y, position: 'absolute', inset: '-12% 0' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={cdn(image)}
              alt={label}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.9s cubic-bezier(.7,0,.3,1)',
              }}
              className="loc-slide-img"
            />
          </motion.div>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 50%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '3.2rem', left: '3.2rem',
            color: '#fff',
          }}>
            <p style={{
              fontSize: 'clamp(2rem, 3vw, 3.6rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              lineHeight: 1,
              margin: 0,
            }}>
              {label}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Location({ brochureImages }: { brochureImages?: string[] }) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: 'free-snap',
    slides: {
      perView: 2,
      spacing: 10,
    },
    breakpoints: {
      '(max-width: 768px)': {
        slides: { perView: 1.15, spacing: 10 },
      },
    },
  })

  return (
    <section id="location" style={{ background: '#fff', color: '#000', overflow: 'hidden' }}>
      <TurnJSBook images={brochureImages} />

      <div className="location-expertise" style={{ padding: '3.2rem 4rem 0', marginLeft: '25%' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
          style={{
            fontSize: '1.1rem',
            letterSpacing: '0.14em',
            color: 'rgba(0,0,0,0.45)',
            marginBottom: '2.4rem',
          }}
        >
          Our expertise
        </motion.p>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxWidth: 860 }}>
          {EXPERTISE.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1], delay: 0.1 + i * 0.08 }}
              style={{
                display: 'flex',
                gap: '1.4rem',
                marginBottom: i < EXPERTISE.length - 1 ? '2rem' : 0,
              }}
            >
              <span style={{ fontSize: '1.6rem', lineHeight: 1.3, flexShrink: 0 }}>•</span>
              <div>
                <p style={{
                  fontSize: 'clamp(1.3rem, 1.8vw, 2rem)',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  margin: '0 0 0.4rem',
                }}>
                  {item.title}
                </p>
                <p style={{
                  fontSize: 'clamp(1rem, 1.1vw, 1.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'rgba(0,0,0,0.6)',
                  margin: 0,
                }}>
                  {item.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="location-heading" style={{ padding: '6rem 4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
            style={{
              fontSize: 'clamp(5rem, 2vw, 11rem)',
              fontWeight: 600,
              lineHeight: 1.0,
              letterSpacing: '0.01em',
            }}
          >
            Different Realty. One Specialist.
          </motion.p>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.15)', margin: 0 }} />
      </div>

      <div
        ref={sliderRef}
        className="keen-slider"
        style={{ marginTop: '0.8rem', cursor: 'grab' }}
      >
        {CARDS.map((card) => (
          <LocationCard
            key={card.label}
            image={card.image}
            label={card.label}
            href={`/portfolio?category=${card.category}`}
          />
        ))}
      </div>

      <style>{`
        .loc-slide-img { user-select: none; -webkit-user-drag: none; }
        .keen-slider__slide:hover .loc-slide-img { transform: scale(1.04) !important; }
        .keen-slider { cursor: grab; }
        .keen-slider:active { cursor: grabbing; }

        @media (max-width: 768px) {
          .location-expertise {
            padding: 2.4rem 2rem 0 !important;
            margin-left: 0 !important;
          }
          .location-heading {
            padding: 4rem 2rem 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
