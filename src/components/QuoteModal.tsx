'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Check, Warning } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from './Button'

const schema = z.object({
  name: z.string().min(2, 'Requis'),
  restaurant: z.string().min(2, 'Requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  volume: z.string().min(1, 'Requis'),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface QuoteModalProps {
  pepperName: string
  selectedQty: string
  onClose: () => void
}

export function QuoteModal({ pepperName, selectedQty, onClose }: QuoteModalProps) {
  const t = useTranslations('quote')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setStatus('sending')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, pepperName, selectedQty }),
      })
      if (!res.ok) throw new Error('server error')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fieldClass =
    'w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] body-md text-[var(--fg-primary)] bg-[var(--surface-primary)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus transition-colors duration-fast placeholder:text-[var(--fg-tertiary)]'
  const labelClass = 'label-sm uppercase text-[var(--fg-secondary)] block mb-1'
  const errorClass = 'caption text-[var(--error)] mt-1'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--surface-overlay)] z-50"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel — modal on desktop, full-screen drawer on mobile */}
      <div
        className="fixed z-50 bg-[var(--surface-primary)] shadow-xl overflow-y-auto
          inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[480px]"
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-[var(--border-subtle)] sticky top-0 bg-[var(--surface-primary)] z-10">
          <h2 className="h2">{t('title')}</h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--fg-tertiary)] hover:text-[var(--fg-primary)] transition-colors duration-fast"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Pre-fill context */}
          <div className="flex gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--accent-light)]">
            <div className="flex-1">
              <p className="label-sm uppercase text-[var(--fg-brand-deep)]">{t('pepper')}</p>
              <p className="h3-mono text-[var(--fg-primary)] mt-0.5">{pepperName}</p>
            </div>
            <div>
              <p className="label-sm uppercase text-[var(--fg-brand-deep)]">{t('qty')}</p>
              <p className="h3-mono text-[var(--fg-primary)] mt-0.5">{selectedQty}</p>
            </div>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--success-light)] flex items-center justify-center">
                <Check size={24} weight="bold" className="text-[var(--success)]" />
              </div>
              <h3 className="h3-mono">{t('successTitle')}</h3>
              <p className="body-md text-[var(--fg-secondary)]">{t('successBody')}</p>
              <Button variant="secondary" onClick={onClose}>Fermer</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label htmlFor="q-name" className={labelClass}>{t('fieldName')}</label>
                <input id="q-name" {...register('name')} className={fieldClass} placeholder="Marie Dupont" />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>
              {/* Restaurant */}
              <div>
                <label htmlFor="q-restaurant" className={labelClass}>{t('fieldRestaurant')}</label>
                <input id="q-restaurant" {...register('restaurant')} className={fieldClass} placeholder="Restaurant L'Étoile" />
                {errors.restaurant && <p className={errorClass}>{errors.restaurant.message}</p>}
              </div>
              {/* Email */}
              <div>
                <label htmlFor="q-email" className={labelClass}>{t('fieldEmail')}</label>
                <input id="q-email" type="email" {...register('email')} className={fieldClass} placeholder="chef@restaurant.fr" />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="q-phone" className={labelClass}>{t('fieldPhone')}</label>
                <input id="q-phone" type="tel" {...register('phone')} className={fieldClass} placeholder="+33 6 12 34 56 78" />
              </div>
              {/* Volume */}
              <div>
                <label htmlFor="q-volume" className={labelClass}>{t('fieldVolume')}</label>
                <input id="q-volume" {...register('volume')} className={fieldClass} placeholder="Ex : 500 g / mois" />
                {errors.volume && <p className={errorClass}>{errors.volume.message}</p>}
              </div>
              {/* Message */}
              <div>
                <label htmlFor="q-message" className={labelClass}>{t('fieldMessage')}</label>
                <textarea
                  id="q-message"
                  {...register('message')}
                  rows={3}
                  className={`${fieldClass} h-auto py-2 resize-none`}
                  placeholder="Questions, précisions…"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--error-light)] text-[var(--error)]">
                  <Warning size={16} />
                  <p className="body-sm">{t('errorBody')}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={status === 'sending'}
                className="w-full"
              >
                {status === 'sending' ? t('sending') : t('submit')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
