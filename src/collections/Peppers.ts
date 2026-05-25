import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Peppers: CollectionConfig = {
  slug: 'peppers',
  admin: {
    useAsTitle: 'name',
    group: 'Catalogue',
    defaultColumns: ['name', 'country', 'region', 'status'],
    description: 'Les 6 poivres d\'exception du catalogue GRANA.',
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/poivres/${doc?.id}`
    },
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    // --- Identity ---
    {
      name: 'name',
      type: 'text',
      label: { fr: 'Nom du poivre', en: 'Pepper name' },
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        description: 'Identifiant URL. Ex : la-victoria. Ne pas modifier après publication.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: { fr: 'Statut', en: 'Status' },
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
        { label: 'Archivé', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    // --- Origin ---
    {
      name: 'producer',
      type: 'relationship',
      label: { fr: 'Producteur', en: 'Producer' },
      relationTo: 'producers',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'country',
      type: 'select',
      label: { fr: 'Pays', en: 'Country' },
      required: true,
      options: [
        { label: 'Costa Rica', value: 'Costa Rica' },
        { label: 'Inde', value: 'Inde' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'region',
      type: 'text',
      label: { fr: 'Région', en: 'Region' },
      localized: true,
      admin: { description: 'Ex : Horquetas de Sarapiquí, Heredia' },
    },
    {
      name: 'coords',
      type: 'group',
      label: { fr: 'Coordonnées géographiques', en: 'Geographic coordinates' },
      admin: { description: 'Latitude / longitude — utilisées pour positionner le point sur la carte monde.' },
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Latitude',
          min: -90,
          max: 90,
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Longitude',
          min: -180,
          max: 180,
        },
      ],
    },
    // --- Agronomic ---
    {
      name: 'variety',
      type: 'text',
      label: { fr: 'Variété', en: 'Variety' },
      localized: true,
    },
    {
      name: 'altitude',
      type: 'text',
      label: { fr: 'Altitude', en: 'Altitude' },
      admin: { description: 'Ex : 86 m ou 900–1700 m' },
    },
    {
      name: 'harvest',
      type: 'text',
      label: { fr: 'Récolte', en: 'Harvest' },
      localized: true,
      admin: { description: 'Ex : Jan–Mar · Juin–Sep' },
    },
    // --- Aromatique (localized) ---
    {
      name: 'aromaticTitle',
      type: 'text',
      label: { fr: 'Titre aromatique', en: 'Aromatic title' },
      localized: true,
      admin: { description: 'Ex : Frais, floral, mentholé' },
    },
    {
      name: 'aromatic',
      type: 'richText',
      label: { fr: 'Description aromatique', en: 'Aromatic description' },
      localized: true,
      editor: lexicalEditor({}),
    },
    {
      name: 'notes',
      type: 'array',
      label: { fr: 'Notes de dégustation', en: 'Tasting notes' },
      admin: { description: 'Chips affichées sur la fiche.' },
      fields: [
        {
          name: 'note',
          type: 'text',
          label: { fr: 'Note', en: 'Note' },
          localized: true,
          required: true,
        },
      ],
    },
    // --- Aromatic profile (0-5 radar) ---
    {
      name: 'profile',
      type: 'group',
      label: { fr: 'Profil aromatique (0–5)', en: 'Aromatic profile (0–5)' },
      fields: [
        { name: 'fraicheur', type: 'number', label: 'Fraîcheur', min: 0, max: 5 },
        { name: 'agrumes',   type: 'number', label: 'Agrumes',   min: 0, max: 5 },
        { name: 'piquant',   type: 'number', label: 'Piquant',   min: 0, max: 5 },
        { name: 'longueur',  type: 'number', label: 'Longueur',  min: 0, max: 5 },
        { name: 'umami',     type: 'number', label: 'Umami',     min: 0, max: 5 },
      ],
    },
    // --- Pricing ---
    {
      name: 'prices',
      type: 'array',
      label: { fr: 'Tarifs (€ HT)', en: 'Prices (€ excl. VAT)' },
      minRows: 1,
      maxRows: 5,
      admin: { description: 'Grilles de prix — au moins 100g, 250g et 1kg.' },
      fields: [
        {
          name: 'qty',
          type: 'select',
          label: { fr: 'Conditionnement', en: 'Pack size' },
          required: true,
          options: [
            { label: '100 g', value: '100g' },
            { label: '250 g', value: '250g' },
            { label: '1 kg',  value: '1kg' },
            { label: '5 kg',  value: '5kg' },
            { label: '10 kg', value: '10kg' },
          ],
        },
        {
          name: 'price',
          type: 'number',
          label: { fr: 'Prix (€ HT)', en: 'Price (€ excl. VAT)' },
          required: true,
          min: 0,
        },
      ],
    },
    // --- Media ---
    {
      name: 'heroImage',
      type: 'upload',
      label: { fr: 'Image hero (4:5)', en: 'Hero image (4:5)' },
      relationTo: 'media',
      admin: { description: 'Photo principale du poivre. Format portrait 4:5.' },
    },
    {
      name: 'gallery',
      type: 'array',
      label: { fr: 'Galerie', en: 'Gallery' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { fr: 'Image', en: 'Image' },
        },
      ],
    },
  ],
}
