"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cdn } from '@/app/lib/cdn'

const BG_IMAGE = "/zurich-bg-image.jpeg";

export default function Panorama() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <>
      <section
        ref={ref}
        id="panorama"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "140svh",
          overflow: "hidden",
          background: "#0a1628",
          color: "#fff",
        }}
      >
        {/* ── Background image with parallax ── */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-15% 0",
            y: imgY,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={cdn(BG_IMAGE)}
            alt="Zurich Graphics real estate branding studio at work"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </motion.div>

        {/* ── Dark overlay ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.25) 45%, rgba(10,22,40,0.15) 70%, rgba(10,22,40,0.6) 100%)",
            zIndex: 1,
          }}
        />

        {/* ── Content ── */}
        <div
          className="panorama-content"
          style={{
            position: "relative",
            zIndex: 2,
            padding: "8rem 4rem 12rem",
            minHeight: "140svh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top row: small label left, nothing right */}
          <div
            className="panorama-toprow"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
            }}
          >
            {/* Left — small heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
              style={{
                fontSize: "clamp(1.2rem, 1.3vw, 1.6rem)",
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: "0.04em",
                color: "#fff",
                margin: 0,
                maxWidth: 200,
              }}
            >
              Our Operating
              <br />
              System
            </motion.h2>
          </div>

          {/* Full-width horizontal rule */}
          <motion.hr
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.7, 0, 0.3, 1], delay: 0.1 }}
            style={{
              border: "none",
              borderTop: "1px solid rgba(255,255,255,0.25)",
              margin: "3.2rem 0 4rem",
            }}
          />

          {/* Body text — right half only */}
          <div
            className="panorama-bodyrow"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 0.6fr",
              gap: "4rem",
            }}
          >
            <div>{/* empty left column */}</div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                ease: [0.7, 0, 0.3, 1],
                delay: 0.15,
              }}
              style={{
                fontSize: "clamp(2rem, 2vw, 2.5rem)",
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: "0.02em",
                color: "#fff",
                margin: 0,
              }}
            >
              We think before we create, position before we promote and connect
              every touchpoint. Strategy defines the project&apos;s place in the
              market, while creativity turns it into a distinct brand experience.
              Every element works together to create one powerful impression.
            </motion.p>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .panorama-bodyrow {
              grid-template-columns: 1fr !important;
            }
            .panorama-content {
              padding: 5rem 2rem 6rem !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
