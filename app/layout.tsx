import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Preloader from '@/app/components/ui/Preloader'
import SmoothScroll from '@/app/components/ui/SmoothScroll'
import ScrollToTop from '@/app/components/ui/ScrollToTop'
import ScrollSnap from '@/app/components/ui/ScrollSnap'
import { pageSeo } from '@/app/lib/seoData'
import { buildMetadata, organizationJsonLd } from '@/app/lib/seo'
import { cdn } from '@/app/lib/cdn'

// Same GTM container and Google tag (gtag.js) IDs live on zurichgraphics.com.
const GTM_ID = 'GTM-PNFXSXZC'
const GOOGLE_TAG_ID = 'GT-P3MNJNH'

export const metadata: Metadata = {
  ...buildMetadata({
    title: pageSeo.home.title,
    description: pageSeo.home.description,
    keywords: pageSeo.home.keywords,
    path: '/',
  }),
  metadataBase: new URL('https://zurichgraphics.com'),
  verification: {
    other: {
      'msvalidate.01': 'D17B2FBA4DB9B71D276B1A6CE3622C93',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href={cdn('/assets/fonts/Gilroy-SemiBold.woff2')}
        crossOrigin="anonymous"
      />
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG_ID}');`}
      </Script>
      <body>
        {/* Plain <script>, not next/script — next/script (even with
            strategy="beforeInteractive") injects this via a client-side
            bootstrap array instead of emitting a literal
            <script type="application/ld+json"> tag, so JS-less crawlers
            never see it in the raw HTML. */}
        <script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Preloader />
        <SmoothScroll />
        <ScrollToTop />
        <ScrollSnap />
        {children}
      </body>
    </html>
  )
}
