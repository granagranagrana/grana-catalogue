import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

import { AppBar } from '@/components/AppBar'
import { WorldMap } from '@/components/WorldMap'
import { getPeppers, getRegions, getPageByKey } from '@/lib/payload'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    title: 'Atlas des origines',
  }
}

export default async function AtlasPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const loc = locale === 'en' ? 'en' : 'fr'
  const t = await getTranslations({ locale: loc, namespace: 'atlas' })
  const base = loc === 'en' ? '/en' : ''

  const [peppers, regions, page] = await Promise.all([
    getPeppers(loc),
    getRegions(loc),
    getPageByKey('manifeste', loc),
  ])

  // Build region dots for world map
  const regionDots = regions.map((r) => ({
    id: r.slug as string,
    lat: (r.coords as { lat: number; lng: number })?.lat ?? 0,
    lng: (r.coords as { lat: number; lng: number })?.lng ?? 0,
    label: (r.name as string) ?? '',
  }))

  const manifestoOverline = (page?.manifestoOverline as string) ?? t('manifestoOverline')
  const manifestoQuote    = (page?.manifestoQuote as string) ?? ''
  const manifestoByline   = (page?.manifestoByline as string) ?? t('manifestoByline')
  const atlasOverline     = (page?.atlasOverline as string) ?? t('overline')
  const atlasH1Line1      = (page?.atlasH1Line1 as string) ?? t('h1line1')
  const atlasH1Accent     = (page?.atlasH1Accent as string) ?? t('h1accent')
  const atlasLede         = (page?.atlasLede as string) ?? t('lede')

  return (
    <div className="screen">
      <AppBar />

      {/* ---- Mobile layout (default) / Desktop: split ---- */}
      <div className="lg:flex lg:min-h-[calc(100vh-52px)]">

        {/* LEFT — map + hero */}
        <div className="lg:flex-1 lg:bg-[var(--surface-sunken)] flex flex-col">

          {/* Hero text */}
          <section className="px-[22px] pt-[18px] pb-2 lg:pt-12 lg:px-14">
            <p className="overline !text-[var(--accent)] mb-3">{atlasOverline}</p>
            <h1
              className="display-lg lg:display-xl mb-4"
              style={{ fontSize: 'clamp(32px,5vw,64px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              {atlasH1Line1}{' '}
              <span style={{ color: 'var(--accent)' }}>{atlasH1Accent}</span>
            </h1>
            <p className="body-md text-[var(--fg-secondary)] max-w-prose">{atlasLede}</p>
          </section>

          {/* World map */}
          <div
            className="w-full bg-[var(--surface-sunken)] mt-2"
            style={{ height: 'clamp(180px,40vw,400px)' }}
          >
            <WorldMap regions={regionDots} locale={loc} />
          </div>
        </div>

        {/* RIGHT — origins + manifesto */}
        <div className="lg:w-[380px] lg:border-l lg:border-[var(--border-subtle)] flex flex-col">

          {/* Origins list */}
          <section className="px-[22px] pt-6 lg:pt-10">
            <p className="overline !text-[var(--fg-tertiary)] mb-3">{t('originsHeading')}</p>

            {regions.map((region) => {
              const pepperCount = Array.isArray(region.peppers) ? region.peppers.length : 0
              return (
                <Link
                  key={region.slug as string}
                  href={`${base}/poivres?region=${region.slug}`}
                  className="flex items-center gap-3 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--accent-light)] -mx-[22px] px-[22px] transition-colors duration-fast group"
                >
                  {/* Dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden
                  />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="h3-mono text-[var(--fg-primary)] truncate">
                      {region.country as string}
                    </p>
                    <p className="caption mt-0.5">{region.summary as string}</p>
                  </div>
                  {/* Count + arrow */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="label-sm uppercase text-[var(--fg-brand-deep)]">
                      {pepperCount} {pepperCount > 1 ? 'poivres' : 'poivre'}
                    </span>
                    <ArrowRight
                      size={12}
                      weight="regular"
                      className="text-[var(--fg-tertiary)] group-hover:text-[var(--accent)]"
                    />
                  </div>
                </Link>
              )
            })}
          </section>

          {/* Manifesto block */}
          <section
            className="mt-auto mx-4 mb-6 lg:mx-0 lg:mb-0 lg:mt-auto rounded-[var(--radius-lg)] lg:rounded-none p-6 lg:border-t lg:border-[var(--border-subtle)]"
            style={{ background: 'var(--surface-vivid)' }}
          >
            <p className="overline !text-white/70 mb-3">{manifestoOverline}</p>
            {manifestoQuote && (
              <p
                className="h3-sans"
                style={{ color: 'white', fontStyle: 'italic', marginBottom: '12px' }}
              >
                {manifestoQuote}
              </p>
            )}
            <p className="label-sm uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {manifestoByline}
            </p>
          </section>

          {/* Footer link */}
          <div className="text-center py-4 border-t border-[var(--border-subtle)]">
            <Link
              href={`${base}/poivres`}
              className="label-sm uppercase text-[var(--fg-brand-deep)] underline underline-offset-2 hover:text-[var(--accent)]"
            >
              {t('seeAll')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
