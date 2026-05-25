'use client'

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { List, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function AppBar() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const otherLocale = locale === 'fr' ? 'en' : 'fr'

  // Build the alternate locale URL
  function switchLocale() {
    const segments = pathname.split('/')
    if (locale === 'en') {
      // remove the /en prefix
      const without = segments.filter((s) => s !== 'en').join('/') || '/'
      router.push(without || '/')
    } else {
      // add /en prefix
      router.push(`/en${pathname}`)
    }
  }

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-[22px] h-[52px] bg-[var(--surface-primary)] border-b border-[var(--border-subtle)]"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Logo */}
      <Link href={locale === 'en' ? '/en' : '/'} className="flex items-center" aria-label="GRANA — Accueil">
        <Image
          src="/assets/grana-blue.png"
          alt="GRANA"
          width={80}
          height={22}
          style={{ height: '22px', width: 'auto' }}
          priority
        />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href={locale === 'en' ? '/en/poivres' : '/poivres'}
          className="label-sm uppercase text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-colors duration-fast"
        >
          {t('catalogue')}
        </Link>
        <button
          onClick={switchLocale}
          className="label-sm uppercase text-[var(--fg-tertiary)] hover:text-[var(--fg-primary)] transition-colors duration-fast"
          aria-label={`Passer en ${otherLocale.toUpperCase()}`}
        >
          <span className={locale === 'fr' ? 'font-semibold text-[var(--fg-primary)]' : ''}>FR</span>
          {' / '}
          <span className={locale === 'en' ? 'font-semibold text-[var(--fg-primary)]' : ''}>EN</span>
        </button>
      </nav>

      {/* Mobile: locale toggle + hamburger */}
      <div className="flex items-center gap-4 md:hidden">
        <button
          onClick={switchLocale}
          className="label-sm uppercase text-[var(--fg-tertiary)]"
          aria-label={`Langue : ${otherLocale.toUpperCase()}`}
        >
          <span className={locale === 'fr' ? 'font-semibold text-[var(--fg-primary)]' : ''}>FR</span>
          {' / '}
          <span className={locale === 'en' ? 'font-semibold text-[var(--fg-primary)]' : ''}>EN</span>
        </button>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-1 text-[var(--fg-primary)]"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="regular" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="absolute top-[52px] left-0 right-0 bg-[var(--surface-primary)] border-b border-[var(--border-subtle)] p-6 flex flex-col gap-4 md:hidden z-50">
          <Link
            href={locale === 'en' ? '/en/poivres' : '/poivres'}
            className="h3-mono text-[var(--fg-primary)]"
            onClick={() => setMenuOpen(false)}
          >
            {t('catalogue')}
          </Link>
          <Link
            href={locale === 'en' ? '/en/notre-approche' : '/notre-approche'}
            className="h3-mono text-[var(--fg-primary)]"
            onClick={() => setMenuOpen(false)}
          >
            {t('approach')}
          </Link>
        </div>
      )}
    </header>
  )
}
