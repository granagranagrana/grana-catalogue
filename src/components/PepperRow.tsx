import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

interface PepperRowProps {
  slug: string
  name: string
  variety: string
  altitude: string
  harvest: string
  price: number
  locale: string
}

export function PepperRow({ slug, name, variety, altitude, harvest, price, locale }: PepperRowProps) {
  return (
    <Link
      href={`${locale === 'en' ? '/en' : ''}/poivres/${slug}`}
      className="flex items-center gap-4 px-[22px] py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--accent-light)] transition-colors duration-fast group"
    >
      {/* Thumbnail placeholder */}
      <div
        className="w-16 h-16 rounded-full flex-shrink-0"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #3a2d1c 0%, #1a1208 100%)',
        }}
        aria-hidden
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="h3-mono text-[var(--fg-primary)] truncate">{name}</p>
        <p className="caption mt-0.5">
          {variety} · {altitude} · {harvest}
        </p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right flex items-center gap-2">
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
