'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cdn } from '@/app/lib/cdn'

type ParallaxImageProps = {
  src: string
  alt?: string
  className?: string
  /** style for the clipping container (set width/height/aspectRatio here) */
  style?: React.CSSProperties
  /** style forwarded to the <img> element */
  imgStyle?: React.CSSProperties
  /** parallax travel as a percentage of the container height (default 8) */
  strength?: number
  objectPosition?: string
}

/**
 * Scroll-driven vertical parallax image.
 * The inner layer is over-sized by `strength` on each side so the image can
 * translate without ever exposing an empty edge.
 */
export default function ParallaxImage({
  src,
  alt = '',
  className,
  style,
  imgStyle,
  strength = 8,
  objectPosition = 'center',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`${strength}%`, `-${strength}%`])
  const pad = strength + 4

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <motion.div
        style={{ y, position: 'absolute', inset: `-${pad}% 0`, willChange: 'transform' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src={cdn(src)}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            display: 'block',
            ...imgStyle,
          }}
        />
      </motion.div>
    </div>
  )
}
