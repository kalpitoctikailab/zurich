'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import type { BlogPost } from '@/app/lib/blogData'
import { cdn } from '@/app/lib/cdn'

export default function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const date = new Date(post.date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1], delay: (index % 3) * 0.1 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', marginBottom: '2rem' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={cdn(post.cover)}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </motion.div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.2rem' }}>
          <span style={{ fontSize: '1.1rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)' }}>
            {post.category}
          </span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: '1.1rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.4)' }}>
            {date}
          </span>
        </div>

        <h3 style={{
          fontSize: 'clamp(1.8rem, 2.2vw, 2.4rem)',
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          margin: 0,
          marginBottom: '1rem',
        }}>
          {post.title}
        </h3>
        <p style={{
          fontSize: '1.3rem',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.55)',
          margin: 0,
        }}>
          {post.excerpt}
        </p>
      </Link>
    </motion.div>
  )
}
