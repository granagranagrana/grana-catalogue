import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

interface PepperCardProps {
  slug: string
  name: string
  region: string
  country: string
  variety: string
  altitude: string
  harvest: string
  price: number
  locale: string
}

export function PepperCard({
  slug, name, region, country, variety, altitude, harvest, price, locale,
}: PepperCardProps) {
  return (
    <Link
      href={`${locale === 'en' ? '/en' : ''}/poivres/${slug}`}
      className="flex flex-col border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-fast group"
    >
      {/* Image placeholder 4:3 */}
      <div
        className="aspect-[4/3] w-full flex-shrink-0"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #3a2d1c 0%, #1a1208 100%)',
        }}
        aria-hidden
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6 gap-2">
        <p className="overline !text-[var(--fg-brand-deep)]">
          {country} · {region}
        </p>
        <p className="h3-mono text-[var(--fg-primary)]">{name}</p>
        <p className="body-sm text-[var(--fg-secondary)]">
          {variety} · {altitude} · {harvest}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 pb-5 mt-auto">
        <div>
          <span className="h4 text-[var(--accent)]">€{price}</span>
          <span className="label-sm text-[var(--fg-tertiary)]">/100g</span>
        </div>
        <ArrowRight
          size={14}
          weight="regular"
          className="text-[var(--fg-tertiary)] group-hover:text-[var(--accent)] transition-colors duration-fast"
        />
      </div>
    </Link>
  )
}
