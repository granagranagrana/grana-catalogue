import Link from 'next/link'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr'

interface BackBarProps {
  href: string
  label: string
}

export function BackBar({ href, label }: BackBarProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-[22px] h-10 border-b border-[var(--border-subtle)] text-[var(--fg-tertiary)] hover:text-[var(--fg-primary)] transition-colors duration-fast"
    >
      <CaretLeft size={12} weight="bold" />
      <span className="label-sm uppercase tracking-[0.06em]">{label}</span>
    </Link>
  )
}
