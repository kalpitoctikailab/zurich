'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface RowImage {
  src: string
  alt?: string
  /** manual flex-grow weight (e.g. 30 / 70 for a 30:70 split). Omit to size
   * this image by its own natural aspect ratio instead (the default). */
  width?: number
}

interface CaseStudyImageRowProps {
  images: RowImage[]
  /** render each image at its natural size (no shared height, no cropping),
   * centered side by side — instead of the justified full-bleed row */
  actualSize?: boolean
  /** add breathing room (6rem) below the row */
  spaceBelow?: boolean
  /** gap between images in the actualSize row, in rem (default 2). Set 0 to
   * have the images sit flush against each other. */
  gap?: number
}

const ROW_HEIGHT = '42rem'
const GAP_REM = 2

/**
 * Same "justified row" behavior as PortfolioImageRow (shared height, width
 * proportional to aspect ratio, read via onLoad) — kept as a separate
 * component so portfolio pages stay untouched. Two additions: an image can
 * set `width` to a manual flex-grow weight to override its automatic
 * aspect-ratio share (e.g. 30 / 70 for a deliberate 30:70 split), and the
 * row can opt into `actualSize` to show every image uncropped at its
 * natural dimensions (each capped to its fair share of the row so they
 * still sit side by side).
 */
export default function CaseStudyImageRow({ images, actualSize, spaceBelow, gap = GAP_REM }: CaseStudyImageRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  // flex-grow per image — manual `width` wins immediately; otherwise starts
  // even (1) until the image loads and reports its real aspect ratio
  const [ratios, setRatios] = useState<number[]>(() => images.map(img => img.width ?? 1))

  const onLoad = (index: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (images[index].width != null) return // manual override — don't let the aspect ratio clobber it
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (!naturalHeight) return
    setRatios(prev => {
      const next = [...prev]
      next[index] = naturalWidth / naturalHeight
      return next
    })
  }

  if (actualSize) {
    const slotMaxWidth = `calc((100% - ${gap * (images.length - 1)}rem) / ${images.length})`
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: `${gap}rem`,
          width: '100%',
          padding: '0rem 8rem',
          marginBottom: '6rem',
        }}
        className="case-study-image-row cs-row-actual"
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1], delay: index * 0.15 }}
            style={{ maxWidth: slotMaxWidth }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={image.src}
              alt={image.alt || `Case study image ${index + 1}`}
              style={{ maxWidth: '100%', width: 'auto', height: 'auto', display: 'block' }}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        width: '100%',
        padding: '0rem 8rem',
        marginBottom: spaceBelow ? '6rem' : undefined,
      }}
      className="case-study-image-row cs-row-justified"
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="cs-row-justified-item"
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
            alt={image.alt || `Case study image ${index + 1}`}
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
          .case-study-image-row {
            padding: 0 2rem !important;
          }
          .cs-row-justified {
            flex-direction: column !important;
          }
          .cs-row-justified-item {
            height: auto !important;
            aspect-ratio: 4 / 3;
            flex: 0 0 auto !important;
          }
        }
      `}</style>
    </div>
  )
}
