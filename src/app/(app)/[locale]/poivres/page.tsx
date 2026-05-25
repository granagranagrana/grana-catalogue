import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { AppBar } from '@/components/AppBar'
import { BackBar } from '@/components/BackBar'
import { PepperRow } from '@/components/PepperRow'
import { PepperCard } from '@/components/PepperCard'
import { getPeppers, getRegions } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'La gamme',
}

interface Props {
  params: { locale: string }
  searchParams: { region?: string }
}

export default async function ListPage({ params, searchParams }: Props) {
  const { locale } = params
  const loc = locale === 'en' ? 'en' : 'fr'
  const t = await getTranslations({ locale: loc, namespace: 'list' })
  const tNav = await getTranslations({ locale: loc, namespace: 'nav' })
  const base = loc === 'en' ? '/en' : ''

  const [peppers, regions] = await Promise.all([getPeppers(loc), getRegions(loc)])

  const activeRegion = searchParams.region ?? 'all'

  // Filter
  const filtered =
    activeRegion === 'all'
      ? peppers
      : peppers.filter((p) => {
          // find if this pepper belongs to the active region
          const reg = regions.find((r) => r.slug === activeRegion)
          if (!reg) return false
          const ids = Array.isArray(reg.peppers)
            ? reg.peppers.map((rp: unknown) =>
                typeof rp === 'object' && rp !== null && 'id' in rp
                  ? (rp as { id: string }).id
                  : rp
              )
            : []
          return ids.includes(p.id)
        })

  // Group by region for mobile list
  interface GroupedRegion {
    region: (typeof regions)[number]
    peppers: typeof peppers
  }
  const groups: GroupedRegion[] = regions
    .filter((r) => activeRegion === 'all' || r.slug === activeRegion)
    .map((region) => {
      const regPepperIds = Array.isArray(region.peppers)
        ? region.peppers.map((rp: unknown) =>
            typeof rp === 'object' && rp !== null && 'id' in rp
              ? (rp as { id: string }).id
              : rp
          )
        : []
      return {
        region,
        peppers: filtered.filter((p) => regPepperIds.includes(p.id)),
      }
    })
    .filter((g) => g.peppers.length > 0)

  const chips = [
    { id: 'all', label: t('filterAll') },
    ...regions.map((r) => ({ id: r.slug as string, label: r.country as string })),
  ]

  function getPrice(p: (typeof peppers)[number]) {
    const prices = Array.isArray(p.prices) ? p.prices : []
    const first = prices.find((pr: unknown) => {
      const entry = pr as { qty: string; price: number }
      return entry.qty === '100g'
    }) as { qty: string; price: number } | undefined
    return first?.price ?? 0
  }

  return (
    <div className="screen">
      <AppBar />
      <BackBar href={base || '/'} label={tNav('atlas')} />

      <div className="max-w-[1200px] mx-auto px-[22px] lg:px-10">
        {/* Header */}
        <div className="pt-6 pb-4 lg:pt-10 lg:pb-6">
          <h1 className="h1 mb-2">{t('title')}</h1>
          <p className="body-md text-[var(--fg-secondary)]">{t('sub')}</p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap pb-5">
          {chips.map((chip) => (
            <a
              key={chip.id}
              href={`${base}/poivres${chip.id === 'all' ? '' : `?region=${chip.id}`}`}
              className={`
                inline-flex items-center px-3 py-1.5 rounded-full border label-sm uppercase transition-colors duration-fast
                ${
                  activeRegion === chip.id || (chip.id === 'all' && activeRegion === 'all')
                    ? 'bg-[var(--fg-primary)] text-white border-[var(--fg-primary)]'
                    : 'border-[var(--border-strong)] text-[var(--fg-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }
              `}
            >
              {chip.label}
            </a>
          ))}
        </div>

        {/* Mobile: grouped list */}
        <div className="lg:hidden">
          {groups.map(({ region, peppers: rPeppers }) => (
            <div key={region.slug as string}>
              {/* Origin head */}
              <div className="border-t-2 border-[var(--fg-primary)] bg-[var(--surface-sunken)] px-[22px] py-4 -mx-[22px] flex items-baseline justify-between">
                <div>
                  <p className="overline !text-[var(--accent)] mb-1">{region.country as string}</p>
                  <p className="h3-mono">{region.summary as string}</p>
                </div>
                <span className="label-sm text-[var(--fg-tertiary)]">
                  {rPeppers.length} poivre{rPeppers.length > 1 ? 's' : ''}
                </span>
              </div>
              {/* Rows */}
              {rPeppers.map((p) => (
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
            </div>
          ))}
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5 pb-20">
          {filtered.map((p) => {
            const regionDoc = regions.find((r) =>
              Array.isArray(r.peppers) &&
              r.peppers.some((rp: unknown) => {
                const entry = rp as { id: string }
                return entry.id === p.id
              })
            )
            return (
              <PepperCard
                key={p.id}
                slug={p.slug as string}
                name={p.name as string}
                region={p.region as string}
                country={p.country as string}
                variety={p.variety as string}
                altitude={p.altitude as string}
                harvest={p.harvest as string}
                price={getPrice(p)}
                locale={loc}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
