interface TagProps {
  children: React.ReactNode
  variant?: 'accent' | 'neutral'
}

export function Tag({ children, variant = 'accent' }: TagProps) {
  const styles =
    variant === 'accent'
      ? 'bg-[var(--accent-light)] text-[var(--fg-brand-deep)]'
      : 'bg-[var(--surface-sunken)] text-[var(--fg-secondary)]'

  return (
    <span
      className={`inline-block px-3 py-[5px] rounded-full label-sm uppercase ${styles}`}
    >
      {children}
    </span>
  )
}
