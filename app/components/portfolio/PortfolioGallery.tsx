'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GalleryImage {
  src: string
  alt?: string
}

interface PortfolioGalleryProps {
  images: GalleryImage[]
}

export default function PortfolioGallery({ images }: PortfolioGalleryProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        padding: '0rem 8rem',
      }}
      className="portfolio-gallery"
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              ease: [0.7, 0, 0.3, 1],
              delay: index * 0.15,
            }}
            style={{
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={image.src}
              alt={image.alt || `Portfolio image ${index + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
