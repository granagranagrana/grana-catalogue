import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    description: 'Pages éditoriales : manifeste, contact, mentions légales.',
  },
  versions: {
    drafts: { autosave: true },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { fr: 'Titre interne', en: 'Internal title' },
      required: true,
    },
    {
      name: 'key',
      type: 'select',
      label: 'Clé de page',
      required: true,
      unique: true,
      options: [
        { label: 'Manifeste / Notre approche', value: 'manifeste' },
        { label: 'Contact', value: 'contact' },
        { label: 'Mentions légales', value: 'mentions' },
      ],
      admin: { position: 'sidebar', description: 'Identifiant stable — ne pas modifier.' },
    },
    // --- Atlas manifesto block ---
    {
      name: 'manifestoOverline',
      type: 'text',
      label: { fr: 'Overline du bloc manifeste (Atlas)', en: 'Manifesto block overline (Atlas)' },
      localized: true,
      admin: { condition: (data) => data.key === 'manifeste' },
    },
    {
      name: 'manifestoQuote',
      type: 'textarea',
      label: { fr: 'Citation (h3-sans italic)', en: 'Pull quote (h3-sans italic)' },
      localized: true,
      admin: { condition: (data) => data.key === 'manifeste' },
    },
    {
      name: 'manifestoByline',
      type: 'text',
      label: { fr: 'Signature (label-sm)', en: 'By-line (label-sm)' },
      localized: true,
      admin: { condition: (data) => data.key === 'manifeste' },
    },
    // --- Atlas hero copy ---
    {
      name: 'atlasOverline',
      type: 'text',
      label: { fr: 'Overline hero Atlas', en: 'Atlas hero overline' },
      localized: true,
      defaultValue: 'Nuancier 2026 · 6 poivres',
    },
    {
      name: 'atlasH1Line1',
      type: 'text',
      label: { fr: 'H1 Atlas — ligne 1', en: 'Atlas H1 — line 1' },
      localized: true,
      defaultValue: 'Sur le 10ᵉ parallèle,',
    },
    {
      name: 'atlasH1Accent',
      type: 'text',
      label: { fr: 'H1 Atlas — phrase en accent', en: 'Atlas H1 — accented phrase' },
      localized: true,
      defaultValue: 'deux terroirs.',
    },
    {
      name: 'atlasLede',
      type: 'textarea',
      label: { fr: 'Lede / chapô Atlas', en: 'Atlas lede / intro' },
      localized: true,
      defaultValue: 'De la Cordillère costaricienne aux Ghâts du Kerala\u00a0: six poivres d\u2019exception, tous cultivés en agroforesterie le long de la même bande tropicale.',
    },
    // --- Generic body ---
    {
      name: 'body',
      type: 'richText',
      label: { fr: 'Corps de page', en: 'Page body' },
      localized: true,
      editor: lexicalEditor({}),
    },
    // --- SEO ---
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title',       type: 'text',     label: { fr: 'Titre méta', en: 'Meta title' },       localized: true },
        { name: 'description', type: 'textarea',  label: { fr: 'Description méta', en: 'Meta description' }, localized: true },
        { name: 'ogImage',     type: 'upload',    label: 'OG Image', relationTo: 'media' },
      ],
    },
  ],
}
