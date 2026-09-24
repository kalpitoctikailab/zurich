'use client'
import { useState } from 'react'
import SplitText from '@/app/components/ui/SplitText'
import AnimateReveal from '@/app/components/ui/AnimateReveal'
import Marquee from '@/app/components/ui/Marquee'
import { cdn } from '@/app/lib/cdn'

const FOUNDER = {
  name: 'Pritesh Gandhi',
  role: 'Founder, Zurich Graphics',
  image: '/images/founder/pritesh-gandhi.jpg',
  quote:
    'A brand is not what you print: it is what people remember. For 32 years we have built brands worth remembering.',
}

/**
 * "What our founder says" — full-bleed asymmetric split: a plain, static
 * portrait pinned to the right edge, an oversized quote mark and editorial
 * quote on the left, and a ghost marquee of the founder's name running
 * behind everything for texture (mirrors the outlined-type move in
 * AboutManifesto).
 */
export default function AboutFounder() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section
      id="about-founder"
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: '#000',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: 'wrap',
      }}
    >
      {/* ghost marquee — the founder's name repeating behind everything */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        transform: 'translateY(-50%) rotate(-3deg)',
        transformOrigin: 'center',
        opacity: 0.05,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <Marquee
          items={[FOUNDER.name]}
          duration={40}
          itemStyle={{
            fontSize: 'clamp(6rem, 14vw, 18rem)',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.9)',
            color: 'transparent',
          }}
        />
      </div>

      {/* eyebrow / index */}
      <div style={{
        position: 'absolute',
        top: '2.8rem',
        left: '4rem',
        zIndex: 3,
        fontSize: '1.1rem',
        letterSpacing: '0.22em',
        color: '#fff',
      }}>
        05 · What our founder says
      </div>

      {/* left column: quote */}
      <div className="founder-quote-col" style={{
        position: 'relative',
        zIndex: 2,
        flex: '1 1 56%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '12rem 4rem',
        minWidth: 'min(100%, 480px)',
      }}>
        <div aria-hidden="true" style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(10rem, 14vw, 18rem)',
          lineHeight: 0.6,
          color: 'rgba(255,255,255,0.15)',
          marginBottom: '1rem',
        }}>
          “
        </div>

        <AnimateReveal y={20}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(2.4rem, 3vw, 4.2rem)',
            fontWeight: 600,
            lineHeight: 1.22,
            letterSpacing: '0.01em',
            color: '#fff',
            marginBottom: '1.6rem',
          }}>
            Founded The Beginning. The Vision Keeps Moving Forward.
          </span>
        </AnimateReveal>

        <SplitText
          as="h2"
          mode="lines"
          text={FOUNDER.quote}
          style={{
            fontSize: 'clamp(1.8rem, 2.2vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.22,
            letterSpacing: '0.01em',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            marginBottom: '5rem',
            maxWidth: 600,
          }}
        />

        <AnimateReveal delay={0.35} y={26}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span aria-hidden="true" style={{
              display: 'block',
              width: '4.8rem',
              height: 1,
              background: '#fff',
              flexShrink: 0,
            }} />
            <div>
              <div style={{
                fontSize: 'clamp(1.6rem, 1.6vw, 2.2rem)',
                letterSpacing: '0.08em',
                color: '#fff',
              }}>
                {FOUNDER.name}
              </div>
              <div style={{
                marginTop: '0.6rem',
                fontSize: '1.15rem',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.45)',
              }}>
                {FOUNDER.role}
              </div>
            </div>
          </div>
        </AnimateReveal>
      </div>

      {/* right column: plain portrait, no animation */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: '1 1 44%',
        minWidth: 'min(100%, 320px)',
        minHeight: '60svh',
        overflow: 'hidden',
      }}>
        {imageFailed ? (
          // placeholder until the founder photo lands at FOUNDER.image
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg, #171310 0%, #0a0a0a 60%)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <span style={{
              fontSize: 'clamp(6rem, 8vw, 10rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#fff',
            }}>
              PG
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            loading="lazy"
            src={cdn(FOUNDER.image)}
            alt={`${FOUNDER.name}, ${FOUNDER.role}`}
            onError={() => setImageFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .founder-quote-col {
            padding: 6rem 2rem !important;
          }
        }
      `}</style>
    </section>
  )
}
