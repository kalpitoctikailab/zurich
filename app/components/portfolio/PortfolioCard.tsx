'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { cdn } from '@/app/lib/cdn'

interface PortfolioCardProps {
  title: string
  slug: string
  imageSrc: string
  projectType: string
  location: string
  index: number
}

export default function PortfolioCard({
  title,
  slug,
  imageSrc,
  projectType,
  location,
  index,
}: PortfolioCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        ease: [0.7, 0, 0.3, 1],
        delay: index * 0.1,
      }}
    >
      <Link
        href={`/portfolio/${slug}`}
        style={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          background: '#000',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            overflow: 'hidden',
          }}
        >
          {/* Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={cdn(imageSrc)}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </motion.div>

          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '3rem',
            }}
          >
            <p
              style={{
                fontSize: '1.4rem',
                color: '#aaaaaa',
                marginBottom: '0.5rem',
                letterSpacing: '0.1em',
              }}
            >
              {location}
            </p>
            <h3
              style={{
                fontSize: '2.8rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontSize: '1.6rem',
                color: '#cccccc',
                letterSpacing: '0.05em',
              }}
            >
              {projectType}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
