'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface RowImage {
  src: string
  alt?: string
}

interface PortfolioImageRowProps {
  images: RowImage[]
}

const ROW_HEIGHT = '42rem'

/**
 * A "justified row" — every image shares the same height, and each one's
 * width is proportional to its own natural aspect ratio (read via onLoad),
 * so a wide image takes more of the row than a narrow one instead of every
 * column being forced to an equal fraction.
 */
export default function PortfolioImageRow({
  images,
}: PortfolioImageRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  // flex-grow per image, proportional to width/height — starts even (1)
  // until each image loads and reports its real aspect ratio
  const [ratios, setRatios] = useState<number[]>(() => images.map(() => 1))

  const onLoad = (index: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (!naturalHeight) return
    setRatios(prev => {
      const next = [...prev]
      next[index] = naturalWidth / naturalHeight
      return next
    })
  }

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        width: '100%',
        padding: '0rem 8rem',
      }}
      className="portfolio-image-row"
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="portfolio-row-item"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: [0.7, 0, 0.3, 1],
            delay: index * 0.15,
          }}
          style={{
            flex: `${ratios[index]} 1 0`,
            height: ROW_HEIGHT,
            overflow: 'hidden',
            transition: 'flex-grow 0.4s ease',
         }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={image.src}
            alt={image.alt || `Portfolio image ${index + 1}`}
            onLoad={onLoad(index)}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </motion.div>
      ))}

      <style>{`
        @media (max-width: 768px) {
          .portfolio-image-row {
            padding: 0 2rem !important;
            flex-direction: column !important;
          }
          .portfolio-row-item {
            height: auto !important;
            aspect-ratio: 4 / 3;
            flex: 0 0 auto !important;
          }
        }
      `}</style>
    </div>
  )
}
