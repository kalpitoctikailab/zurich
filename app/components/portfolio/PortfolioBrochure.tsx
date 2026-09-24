'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cdn } from '@/app/lib/cdn'

interface PortfolioBrochureProps {
  imageSrc: string
  imageAlt?: string
}

export default function PortfolioBrochure({
  imageSrc,
  imageAlt = 'Project Brochure',
}: PortfolioBrochureProps) {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem',
      }}
    >
      <motion.div
        style={{
          y,
          opacity,
          position: 'relative',
          maxWidth: '550px',
          width: '100%',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src={cdn(imageSrc)}
          alt={imageAlt}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.6))',
          }}
        />
      </motion.div>
    </section>
  )
}
