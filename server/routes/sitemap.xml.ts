import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://agroshoptg.store'
  const config = useRuntimeConfig()

  // Pages statiques et sections du site
  const staticPages = [
    '',
    '/produits',
    '/services',
    '/quincaillerie',
    '/contact',
    '/faq',
    '/agrodop',
    '/blog',
    '/blog/guide-optimiser-rendement-mais-uree-46',
    '/blog/prevention-chenilles-legionnaires-protocole'
  ]

  let productRoutes: { slug: string; updated_at?: string }[] = []

  // Produits statiques de secours (fallbacks) au cas où l'API est temporairement indisponible
  const fallbackSlugs = [
    'uree-yara-46-n',
    'engrais-npk-15-15-15-superfert',
    'insecticide-katana-50-ec'
  ]

  try {
    const apiBaseUrl = config.public?.apiBaseUrl || 'https://api.agroshoptg.store/api'
    const res: any = await $fetch(`${apiBaseUrl}/produits`, {
      timeout: 5000
    })

    const rawList = res?.data?.produits || res?.produits || res?.data || res
    if (Array.isArray(rawList) && rawList.length > 0) {
      productRoutes = rawList
        .map((p: any) => ({
          slug: p.slug || p.nom_commercial?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          updated_at: p.updated_at || p.created_at
        }))
        .filter((p: any) => Boolean(p.slug))
    }
  } catch (e) {
    productRoutes = fallbackSlugs.map(s => ({ slug: s }))
  }

  if (productRoutes.length === 0) {
    productRoutes = fallbackSlugs.map(s => ({ slug: s }))
  }

  const currentDate = new Date().toISOString().split('T')[0]

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
  ${productRoutes
    .map(
      (prod) => `
  <url>
    <loc>${baseUrl}/produits/${prod.slug}</loc>
    <lastmod>${prod.updated_at ? new Date(prod.updated_at).toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join('')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'text/xml; charset=UTF-8')
  event.node.res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return sitemapXml
})
