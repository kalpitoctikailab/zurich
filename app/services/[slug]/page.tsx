import { notFound } from 'next/navigation'
import Header from '@/app/components/layout/Header'
import Footer from '@/app/components/layout/Footer'
import ServiceDetailClient from '@/app/components/services/ServiceDetailClient'
import { getAllServices, getServiceBySlug } from '@/app/lib/servicesData'
import { portfolioProjects } from '@/app/lib/portfolioData'
import { buildMetadata } from '@/app/lib/seo'

export async function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: 'Service Not Found' }

  return buildMetadata({
    title: `${service.title} | Zurich Graphics Services`,
    description: service.tagline,
    path: `/services/${slug}`,
    image: service.image,
  })
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const allServices = getAllServices()
  const currentIndex = allServices.findIndex((s) => s.slug === service.slug)
  const prevService = currentIndex > 0 ? allServices[currentIndex - 1] : null
  const nextService = currentIndex < allServices.length - 1 ? allServices[currentIndex + 1] : null

  const relatedProjects = service.relatedPortfolioCategories?.length
    ? portfolioProjects
        .filter(p => service.relatedPortfolioCategories.includes(p.category))
        .slice(0, 6)
    : []

  return (
    <>
      <Header />
      <ServiceDetailClient
        service={service}
        prevService={prevService}
        nextService={nextService}
        relatedProjects={relatedProjects}
      />
      <Footer />
    </>
  )
}
