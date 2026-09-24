'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { APARTMENT_TYPES } from '@/app/lib/data'
import ParallaxImage from '@/app/components/ui/ParallaxImage'
import { cdn } from '@/app/lib/cdn'

export default function Apartments() {
  const [activeTab, setActiveTab] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const activeType = APARTMENT_TYPES[activeTab]

  return (
    <section
      ref={sectionRef}
      id="apartments"
      style={{
        position: 'relative',
        height: '100vh',
        background: '#000',
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: '50% 50%',
          overflow: 'hidden',
        }}
      >
        {/* LEFT - Tabs and Floor Plan */}
        <div
          className="apt-left"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '4rem',
            background: '#000',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <div>
            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '2rem',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '1rem',
              }}
            >
              {APARTMENT_TYPES.map((type, index) => (
                <button
                  key={type.label}
                  onClick={() => setActiveTab(index)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: activeTab === index ? '#fff' : 'rgba(255,255,255,0.4)',
                    fontSize: '1.2rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    borderBottom: activeTab === index ? '2px solid #fff' : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    fontWeight: 600,
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '2rem 0' }} />

            {/* Area Display */}
            <div style={{ marginBottom: '2rem' }}>
              <motion.p
                key={`area-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: 'clamp(4rem, 7vw, 8rem)',
                  fontWeight: 600,
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {activeType.range}
              </motion.p>
            </div>
          </div>

          {/* Floor Plan - Centered */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 0',
            }}
          >
            <motion.div
              key={`plan-${activeTab}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={cdn(activeType.image)}
                alt={`${activeType.label} floor plan`}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  filter: 'invert(1)',
                }}
              />
            </motion.div>
          </div>

          {/* Purchase Conditions - At Bottom */}
          <div style={{ paddingTop: '2rem' }}>
            <p
              style={{
                fontSize: '1.2rem',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ color: '#fff' }}>Purchase conditions:</span>
            </p>
            <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)' }}>
              Mortgage, 0% installment plan, trade-in
            </p>
          </div>
        </div>

        {/* RIGHT - Hero Image */}
        <div
          className="apt-right"
          style={{
            position: 'relative',
            overflow: 'hidden',
            height: '100vh',
          }}
        >
          <ParallaxImage
            src={cdn("/assets/images/apartments/hero.webp")}
            alt="Splendid Apartments"
            strength={10}
            style={{ position: 'absolute', inset: 0 }}
          />

          {/* Text Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '6rem',
              right: '4rem',
              textAlign: 'right',
              zIndex: 10,
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(3.5rem, 5vw, 7rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '0.02em',
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              }}
            >
              Splendid
              <br />
              Apartments
            </h2>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 968px) {
          section {
            height: auto !important;
          }
          section > div {
            grid-template-columns: 1fr !important;
            position: relative !important;
            height: auto !important;
          }
          .apt-left {
            height: auto !important;
            padding: 3.2rem 2rem !important;
          }
          .apt-right {
            height: 60vh !important;
            min-height: 420px !important;
          }
        }
      `}</style>
    </section>
  )
}
