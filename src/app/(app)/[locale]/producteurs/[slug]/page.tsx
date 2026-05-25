import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AppBar } from '@/components/AppBar'
import { BackBar } from '@/components/BackBar'
import { Tag } from '@/components/Tag'
import { PepperRow } from '@/components/PepperRow'
import { getProducerById, getPeppers, getPayloadClient } from '@/lib/payload'

interface Props {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = params.locale === 'en' ? 'en' : 'fr'
  const producer = await getProducerById(params.slug, loc)
  if (!producer) return { title: 'Producteur introuvable' }
  return { title: producer.name as string }
}

export default async function ProducerPage({ params }: Props) {
  const { locale, slug } = params
  const loc = locale === 'en' ? 'en' : 'fr'
  const t = await getTranslations({ locale: loc, namespace: 'producer' })
  const tNav = await getTranslations({ locale: loc, namespace: 'nav' })
  const base = loc === 'en' ? '/en' : ''

  let producer
  try {
    producer = await getProducerById(slug, loc)
  } catch {
    notFound()
  }
  if (!producer) notFound()

  // Related peppers
  const allPeppers = await getPeppers(loc)
  const related = allPeppers.filter((p) => {
    const pid =
      typeof p.producer === 'object' && p.producer !== null
        ? (p.producer as { id: string }).id
        : p.producer
    return pid === producer.id
  })

  function richTextToPlain(rt: unknown): string {
    if (!rt || typeof rt !== 'object') return ''
    const obj = rt as { root?: { children?: { children?: { text?: string }[] }[] } }
    return (
      obj.root?.children
        ?.flatMap((block) => block.children?.map((n) => n.text ?? '') ?? [])
        .join(' ') ?? ''
    )
  }

  const bioText       = richTextToPlain(producer.bio)
  const practicesText = richTextToPlain(producer.practices)
  const ecologyText   = richTextToPlain(producer.ecology)

  const badges = Array.isArray(producer.badges)
    ? (producer.badges as { label: string }[])
    : []

  function getPrice(p: (typeof allPeppers)[number]) {
    const prices = Array.isArray(p.prices) ? (p.prices as { qty: string; price: number }[]) : []
    return prices.find((pr) => pr.qty === '100g')?.price ?? 0
  }

  return (
    <div className="screen theme-navy">
      <AppBar />
      <BackBar href={`${base}/poivres`} label={t('backBar')} />

      {/* Hero */}
      <section
        className="px-[22px] pt-7 pb-8 lg:px-14 lg:pt-16 lg:pb-10"
        style={{ background: 'var(--surface-ink)' }}
      >
        <p className="overline mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {producer.region as string} · {producer.country as string}
        </p>
        <h1
          className="text-white mb-2"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.05, fontWeight: 600, letterSpacing: '-0.015em' }}
        >
          {producer.name as string}
        </h1>
        <p className="label-lg uppercase mb-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {producer.farm as string}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 border border-[rgba(255,255,255,0.15)] rounded-[var(--radius-md)] overflow-hidden">
          {[
            { label: t('statsAltitude'), value: producer.altitude as string },
            { label: t('statsSurface'),  value: producer.surface as string },
            { label: t('statsPeppers'),  value: String(related.length) },
          ].map((stat, i) => (
            <div
              key={i}
              className={`px-4 py-4 ${i > 0 ? 'border-l border-[rgba(255,255,255,0.15)]' : ''}`}
            >
              <p className="overline mb-1" style={{ color: 'var(--accent)', fontSize: '9px' }}>
                {stat.label}
              </p>
              <p className="h3-mono text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial sections */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-0 lg:max-w-[1200px] lg:mx-auto">
        {/* Le producteur */}
        {bioText && (
          <section className="px-[22px] py-6 border-b border-[var(--border-subtle)] lg:border-r lg:px-10 lg:py-10">
            <p className="overline !text-[var(--accent-deep)] mb-4">{t('sectionProducer')}</p>
            <p className="body-md text-[var(--fg-primary)]" style={{ lineHeight: 1.65 }}>
              {bioText}
            </p>
          </section>
        )}

        {/* Pratiques agricoles */}
        {practicesText && (
          <section className="px-[22px] py-6 border-b border-[var(--border-subtle)] lg:px-10 lg:py-10">
            <p className="overline !text-[var(--accent-deep)] mb-4">{t('sectionPractices')}</p>
            <p className="body-md text-[var(--fg-primary)]" style={{ lineHeight: 1.65 }}>
              {practicesText}
            </p>
            {/* Cert badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {badges.map((b, i) => (
                  <Tag key={i} variant="accent">{b.label}</Tag>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Écologie & terroir */}
        {ecologyText && (
          <section className="px-[22px] py-6 border-b border-[var(--border-subtle)] lg:col-span-2 lg:border-r-0 lg:px-10 lg:py-10">
            <p className="overline !text-[var(--accent-deep)] mb-4">{t('sectionEcology')}</p>
            <p className="body-md text-[var(--fg-primary)] max-w-2xl" style={{ lineHeight: 1.65 }}>
              {ecologyText}
            </p>
          </section>
        )}
      </div>

      {/* Related peppers */}
      {related.length > 0 && (
        <section className="bg-[var(--surface-sunken)] pt-6 pb-10">
          <div className="px-[22px] lg:px-10 mb-4">
            <p className="overline !text-[var(--fg-tertiary)]">{t('relatedHeading')}</p>
          </div>
          {related.map((p) => (
            <PepperRow
              key={p.id}
              slug={p.slug as string}
              name={p.name as string}
              variety={p.variety as string}
              altitude={p.altitude as string}
              harvest={p.harvest as string}
              price={getPrice(p)}
              locale={loc}
            />
          ))}
        </section>
      )}
    </div>
  )
}
