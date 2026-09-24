const BASE = (process.env.NEXT_PUBLIC_CDN_URL ?? '').replace(/\/$/, '')

/**
 * Prepends the CloudFront CDN domain to a public-folder path.
 * Falls back to the path as-is when NEXT_PUBLIC_CDN_URL is not set.
 * Absolute URLs (http/https) are returned unchanged.
 */
export function cdn(path: string | undefined): string {
  if (!BASE || !path) return path ?? ''
  if (path.startsWith('http')) return path
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`
}
