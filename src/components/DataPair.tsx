interface DataPairProps {
  label: string
  value: string
}

export function DataPair({ label, value }: DataPairProps) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-[var(--accent)] pl-3">
      <span className="data-label">{label}</span>
      <span className="data-value">{value}</span>
    </div>
  )
}
