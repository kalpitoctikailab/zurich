import type { BlogBlock } from '@/app/lib/blogData'

const bodyText: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 1.3vw, 1.75rem)',
  lineHeight: 1.8,
  color: 'rgba(255, 255, 255, 0.72)',
}

export function slugifyHeading(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `heading-${slug || index}`
}

export default function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="blog-content-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={i} style={{ ...bodyText, marginBottom: '2.4rem' }}>
                {block.text}
              </p>
            )

          case 'heading': {
            const Tag = block.level === 2 ? 'h2' : 'h3'
            const headingId = slugifyHeading(block.text, i)
            return (
              <Tag
                key={i}
                id={headingId}
                style={{
                  fontSize: block.level === 2 ? 'clamp(2.4rem, 3vw, 3.4rem)' : 'clamp(1.9rem, 2.2vw, 2.4rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                  margin: 0,
                  marginTop: block.level === 2 ? '5.2rem' : '3.6rem',
                  marginBottom: '2rem',
                  scrollMarginTop: '130px',
                }}
              >
                {block.text}
              </Tag>
            )
          }

          case 'list': {
            const isOrdered = block.ordered
            return (
              <div
                key={i}
                style={{
                  marginBottom: '2.8rem',
                  marginTop: '1.2rem',
                }}
              >
                <ul
                  style={{
                    ...bodyText,
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.4rem',
                  }}
                >
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: isOrdered ? '1.4rem' : '1.2rem',
                      }}
                    >
                      {isOrdered ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            minWidth: '26px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            marginTop: '0.2rem',
                          }}
                        >
                          {j + 1}
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            minWidth: '8px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
                            marginTop: '1.1rem',
                          }}
                        />
                      )}
                      <span style={{ flex: 1 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          case 'table':
            return (
              <div
                key={i}
                style={{
                  margin: '3.6rem 0',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                    {block.headers.length > 0 && (
                      <thead>
                        <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          {block.headers.map((h, j) => (
                            <th
                              key={j}
                              style={{
                                textAlign: 'left',
                                fontSize: '1.3rem',
                                fontWeight: 600,
                                color: '#ffffff',
                                padding: '1.6rem 2rem',
                                borderBottom: '1px solid rgba(255,255,255,0.12)',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {block.rows.map((row, j) => (
                        <tr
                          key={j}
                          style={{
                            borderBottom:
                              j === block.rows.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                            transition: 'background 0.2s ease',
                          }}
                        >
                          {row.map((cell, k) => (
                            <td
                              key={k}
                              style={{
                                fontSize: '1.35rem',
                                lineHeight: 1.65,
                                color: 'rgba(255,255,255,0.7)',
                                padding: '1.6rem 2rem',
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )

          case 'image':
            return (
              <figure key={i} style={{ margin: '4.4rem 0' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    loading="lazy"
                    src={block.src}
                    alt={block.alt}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                {block.caption && (
                  <figcaption
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '1.25rem',
                      color: 'rgba(255, 255, 255, 0.45)',
                      marginTop: '1.2rem',
                      paddingLeft: '0.4rem',
                      fontStyle: 'italic',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'quote':
            return (
              <blockquote
                key={i}
                style={{
                  margin: '3.8rem 0',
                  padding: '2.8rem 3.2rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(12px)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    lineHeight: 1,
                    color: 'rgba(255, 255, 255, 0.3)',
                    marginBottom: '1rem',
                    fontFamily: 'serif',
                  }}
                >
                  “
                </div>
                <p
                  style={{
                    fontSize: 'clamp(1.6rem, 1.5vw, 2.1rem)',
                    lineHeight: 1.6,
                    color: '#ffffff',
                    fontStyle: 'italic',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {block.text}
                </p>
              </blockquote>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
