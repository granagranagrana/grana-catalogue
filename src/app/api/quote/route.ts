import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, restaurant, email, phone, volume, message, pepperName, selectedQty } = body

    const recipient = process.env.QUOTE_RECIPIENT_EMAIL ?? 'bonjour@grana.fr'

    const { error } = await resend.emails.send({
      from: 'GRANA Catalogue <noreply@grana.fr>',
      to: [recipient],
      replyTo: email,
      subject: `Demande de devis — ${pepperName} (${selectedQty})`,
      text: [
        `Nouveau devis reçu via le catalogue GRANA.`,
        ``,
        `Poivre : ${pepperName}`,
        `Conditionnement : ${selectedQty}`,
        ``,
        `Contact`,
        `-------`,
        `Nom      : ${name}`,
        `Restaurant : ${restaurant}`,
        `Email    : ${email}`,
        `Téléphone : ${phone ?? '—'}`,
        `Volume estimé : ${volume}`,
        ``,
        `Message`,
        `-------`,
        message ?? '(aucun)',
      ].join('\n'),
      html: `
        <h2>Demande de devis — GRANA Catalogue</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Poivre</b></td><td style="padding:8px;border-bottom:1px solid #eee">${pepperName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Conditionnement</b></td><td style="padding:8px;border-bottom:1px solid #eee">${selectedQty}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Nom</b></td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Restaurant</b></td><td style="padding:8px;border-bottom:1px solid #eee">${restaurant}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Email</b></td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Téléphone</b></td><td style="padding:8px;border-bottom:1px solid #eee">${phone ?? '—'}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Volume estimé</b></td><td style="padding:8px;border-bottom:1px solid #eee">${volume}</td></tr>
        </table>
        ${message ? `<p style="margin-top:16px"><b>Message :</b><br>${message}</p>` : ''}
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'email_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Quote API error:', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
