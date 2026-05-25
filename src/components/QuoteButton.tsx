'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from './Button'
import { QuoteModal } from './QuoteModal'
import { DownloadSimple } from '@phosphor-icons/react'

interface QuoteButtonProps {
  pepperName: string
  prices: { qty: string; price: number }[]
  locale: string
}

export function QuoteButton({ pepperName, prices, locale }: QuoteButtonProps) {
  const t = useTranslations('pepper')
  const [selectedQty, setSelectedQty] = useState(prices[0]?.qty ?? '100g')
  const [modalOpen, setModalOpen] = useState(false)

  const currentPrice = prices.find((p) => p.qty === selectedQty)?.price ?? 0

  const qtyLabels: Record<string, string> = {
    '100g': '100 g',
    '250g': '250 g',
    '1kg': '1 kg',
    '5kg': '5 kg',
    '10kg': '10 kg',
  }

  return (
    <>
      {/* Price tier selector */}
      <div className="px-[22px] py-5 border-b border-[var(--border-subtle)] lg:px-0">
        <div className="flex border border-[var(--border-strong)] rounded-[var(--radius-md)] overflow-hidden">
          {prices.map((p) => (
            <button
              key={p.qty}
              onClick={() => setSelectedQty(p.qty)}
              className={`
                flex-1 py-3 label-sm uppercase text-center transition-colors duration-fast
                ${
                  selectedQty === p.qty
                    ? 'bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]'
                    : 'text-[var(--fg-secondary)] hover:bg-[var(--surface-sunken)]'
                }
              `}
            >
              {qtyLabels[p.qty] ?? p.qty}
            </button>
          ))}
        </div>
      </div>

      {/* Price block + CTA */}
      <div className="px-[22px] py-5 lg:px-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="display-lg"
            style={{ fontSize: '30px', color: 'var(--accent)', lineHeight: 1 }}
          >
            €{currentPrice}
          </span>
          <span className="label-sm text-[var(--fg-tertiary)] uppercase">{t('priceHelper')}</span>
        </div>
        <p className="caption text-[var(--fg-tertiary)] mb-4">
          Conditionnement {qtyLabels[selectedQty] ?? selectedQty} · franco port &gt; 500 €
        </p>

        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => setModalOpen(true)}
          >
            {t('requestQuote')}
          </Button>
          <Button variant="secondary">
            <DownloadSimple size={16} />
            <span className="hidden sm:inline">{t('downloadSheet')}</span>
          </Button>
        </div>
      </div>

      {modalOpen && (
        <QuoteModal
          pepperName={pepperName}
          selectedQty={qtyLabels[selectedQty] ?? selectedQty}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
