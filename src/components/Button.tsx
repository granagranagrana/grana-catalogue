import type { ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

interface LinkButtonProps {
  variant?: Variant
  size?: Size
  href: string
  children: React.ReactNode
  className?: string
}

const base =
  'inline-flex items-center justify-center gap-2 font-mono font-medium uppercase tracking-[0.06em] rounded-[var(--radius-md)] transition-all duration-fast cursor-pointer focus-visible:outline-none focus-visible:shadow-focus'

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[10px]',
  sm: 'h-8 px-4 text-[10px]',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--accent)] text-[var(--accent-on)] hover:bg-[var(--accent-deep)] shadow-sm',
  secondary:
    'border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-light)] bg-transparent',
  ghost:
    'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--surface-sunken)] bg-transparent',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function LinkButton({ variant = 'primary', size = 'md', href, children, className = '' }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}
