import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AppBar } from '@/components/AppBar'
import { BackBar } from '@/components/BackBar'
import { DataPair } from '@/components/DataPair'
import { Tag } from '@/components/Tag'
import { MiniMap } from '@/components/MiniMap'
import { PepperRow } from '@/components/PepperRow'
import { QuoteButton } from '@/components/QuoteButton'
import { getPepperBySlug, getProducerById, getPeppers } from '@/lib/payload'

interface Props {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = params.locale === 'en' ? 'en' : 'fr'
  const pepper = await getPepperBySlug(params.slug, loc)
  if (!pepper) return { title: 'Poivre introuvable' }
  return {
    title: pepper.name as string,
    description: pepper.aromaticTitle as string,
  }
}

export default async function PepperDetailPage({ params }: Props) {
  const { locale, slug } = params
  const loc = locale === 'en' ? 'en' : 'fr'
  const t = await getTranslations({ locale: loc, namespace: 'pepper' })
  const tNav = await getTranslations({ locale: loc, namespace: 'nav' })
  const base = loc === 'en' ? '/en' : ''

  const pepper = await getPepperBySlug(slug, loc)
  if (!pepper) notFound()

  const producerId =
    typeof pepper.producer === 'object' && pepper.producer !== null
      ? (pepper.producer as { id: string }).id
      : (pepper.producer as string)

  const producer = producerId ? await getProducerById(producerId, loc) : null

  // Related peppers from same producer
  const allPeppers = await getPeppers(loc)
  const related = allPeppers
    .filter((p) => {
      const pid =
        typeof p.producer === 'object' && p.producer !== null
          ? (p.producer as { id: string }).id
          : p.producer
      return pid === producerId && p.id !== pepper.id
    })
    .slice(0, 3)

  const coords = pepper.coords as { lat: number; lng: number } | null
  const prices = Array.isArray(pepper.prices) ? (pepper.prices as { qty: string; price: number }[]) : []
  const notes  = Array.isArray(pepper.notes)  ? (pepper.notes  as { note: string }[]) : []

  // Lexical rich text → plain text fallback
  function richTextToPlain(rt: unknown): string {
    if (!rt || typeof rt !== 'object') return ''
    const obj = rt as { root?: { children?: { children?: { text?: string }[] }[] } }
    return (
      obj.root?.children
        ?.flatMap((block) => block.children?.map((n) => n.text ?? '') ?? [])
        .join(' ') ?? ''
    )
  }

  const aromaticText = richTextToPlain(pepper.aromatic)

  function getPrice(qty: string) {
    return prices.find((p) => p.qty === qty)?.price ?? 0
  }

  return (
    <div className="screen theme-blue">
      <AppBar />
      <BackBar href={`${base}/poivres`} label={t('backBar')} />

      {/* ---- Desktop: 2-col / Mobile: single col ---- */}
      <div className="lg:flex lg:max-w-[1200px] lg:mx-auto lg:gap-12 lg:px-12 lg:py-12">

        {/* LEFT — hero image (desktop) */}
        <div className="hidden lg:block lg:w-1/2">
          {/* Hero placeholder 4:5 */}
          <div
            className="w-full rounded-[var(--radius-lg)] overflow-hidden"
            style={{
              aspectRatio: '4/5',
              background: 'radial-gradient(circle at 35% 35%, #3a2d1c 0%, #1a1208 70%), rgba(50,113,217,0.22)',
            }}
            aria-hidden
          />
          {/* Map context band (desktop) */}
          <a
            href={`${base}/`}
            className="flex items-center gap-4 mt-4 p-4 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] hover:bg-[var(--accent-light)] transition-colors duration-fast"
          >
            {coords && <MiniMap lat={coords.lat} lng={coords.lng} />}
            <div className="flex-1">
              <p className="overline !text-[var(--accent)] mb-1">{t('youAreHere')}</p>
              <p className="label-lg uppercase">{pepper.region as string}</p>
            </div>
          </a>
        </div>

        {/* RIGHT / Mobile full */}
        <div className="lg:w-1/2 flex flex-col">

          {/* Hero band (mobile only) */}
          <section
            className="relative px-[22px] pt-16 pb-6 lg:hidden"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #3a2d1c 0%, #1a1208 70%), rgba(50,113,217,0.22)',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <p className="overline mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {pepper.region as string} · {pepper.country as string}
            </p>
            <h1
              className="display-lg text-white mb-2"
              style={{ fontSize: '44px', lineHeight: 1.0 }}
            >
              {pepper.name as string}
            </h1>
            <p className="label-lg uppercase" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {pepper.variety as string} · {pepper.altitude as string}
            </p>
          </section>

          {/* Desktop: overline + h1 */}
          <div className="hidden lg:block mb-6">
            <p className="overline !text-[var(--accent)] mb-2">
              {pepper.region as string} · {pepper.country as string}
            </p>
            <h1
              className="display-xl mb-2"
              style={{ fontSize: '72px', lineHeight: 0.9, letterSpacing: '-0.02em' }}
            >
              {pepper.name as string}
            </h1>
            <p className="h3-sans text-[var(--fg-secondary)]">{pepper.aromaticTitle as string}</p>
          </div>

          {/* Map context band (mobile) */}
          <a
            href={`${base}/`}
            className="flex items-center gap-4 px-[22px] py-4 bg-[var(--surface-sunken)] hover:bg-[var(--accent-light)] transition-colors duration-fast lg:hidden"
          >
            {coords && <MiniMap lat={coords.lat} lng={coords.lng} />}
            <div className="flex-1">
              <p className="overline !text-[var(--accent)] mb-1">{t('youAreHere')}</p>
              <p className="label-lg uppercase">{pepper.region as string}</p>
            </div>
          </a>

          {/* Data grid */}
          <div className="grid grid-cols-2 gap-5 px-[22px] py-6 border-b border-[var(--border-subtle)] lg:border lg:border-[var(--border-ink)] lg:rounded-[var(--radius-md)] lg:p-6 lg:mb-6">
            <DataPair label="Variété" value={pepper.variety as string} />
            <DataPair label="Altitude" value={pepper.altitude as string} />
            <DataPair label="Récolte" value={pepper.harvest as string} />
            {producer && (
              <DataPair
                label="Producteur"
                value={(producer.name as string).split(' ').slice(-1)[0]}
              />
            )}
          </div>

          {/* Aromatic section */}
          <section className="px-[22px] py-6 border-b border-[var(--border-subtle)] lg:px-0">
            <p className="overline !text-[var(--accent-deep)] mb-3">{t('aromaticHeading')}</p>
            <h2 className="h3-mono mb-3">{pepper.aromaticTitle as string}</h2>
            {aromaticText && (
              <p className="body-md text-[var(--fg-primary)]" style={{ lineHeight: 1.55 }}>
                {aromaticText}
              </p>
            )}
            {/* Notes chips */}
            {notes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {notes.map((n, i) => (
                  <Tag key={i} variant="accent">{n.note}</Tag>
                ))}
              </div>
            )}
          </section>

          {/* Producer card */}
          {producer && (
            <a
              href={`${base}/producteurs/${producer.id}`}
              className="block mx-[22px] my-5 rounded-[var(--radius-md)] p-[22px] hover:opacity-90 transition-opacity duration-fast lg:mx-0"
              style={{ background: 'var(--surface-ink)' }}
            >
              <p className="overline mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {t('producerHeading')}
              </p>
              <h3 className="h2 text-white mb-1">{producer.name as string}</h3>
              <p className="body-sm mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {producer.farm as string} · {producer.surface as string} · {producer.region as string}
              </p>
              {/* Badges */}
              {Array.isArray(producer.badges) && producer.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(producer.badges as { label: string }[]).map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full label-sm uppercase"
                      style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              )}
              <p className="label-sm uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {t('seeProducer')}
              </p>
            </a>
          )}

          {/* Price tier selector + CTA (client component) */}
          <QuoteButton
            pepperName={pepper.name as string}
            prices={prices}
            locale={loc}
          />
        </div>
      </div>
    </div>
  )
}
