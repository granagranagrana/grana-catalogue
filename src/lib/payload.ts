import { getPayload } from 'payload'
import configPromise from '@payload-config'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (cached) return cached
  cached = await getPayload({ config: configPromise })
  return cached
}

// ---- Typed helpers ----

export async function getPeppers(locale: 'fr' | 'en' = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'peppers',
    locale,
    where: { status: { equals: 'published' } },
    depth: 2,
    limit: 100,
  })
  return docs
}

export async function getPepperBySlug(slug: string, locale: 'fr' | 'en' = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'peppers',
    locale,
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getProducers(locale: 'fr' | 'en' = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'producers',
    locale,
    depth: 1,
    limit: 100,
  })
  return docs
}

export async function getProducerById(id: string, locale: 'fr' | 'en' = 'fr') {
  const payload = await getPayloadClient()
  const doc = await payload.findByID({
    collection: 'producers',
    id,
    locale,
    depth: 1,
  })
  return doc
}

export async function getRegions(locale: 'fr' | 'en' = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'regions',
    locale,
    depth: 2,
    limit: 20,
  })
  return docs
}

export async function getPageByKey(key: string, locale: 'fr' | 'en' = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    where: { key: { equals: key } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}
