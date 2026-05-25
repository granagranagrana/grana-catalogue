import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Producers: CollectionConfig = {
  slug: 'producers',
  admin: {
    useAsTitle: 'name',
    group: 'Catalogue',
    defaultColumns: ['name', 'farm', 'country', 'region'],
    description: 'Les producteurs partenaires de GRANA.',
  },
  fields: [
    // --- Identity ---
    {
      name: 'name',
      type: 'text',
      label: 'Nom complet',
      required: true,
      admin: { description: 'Ex : Rigoberto Vindas Chacón' },
    },
    {
      name: 'farm',
      type: 'text',
      label: { fr: 'Nom de la ferme / structure', en: 'Farm / organisation name' },
      required: true,
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
    },
    {
      name: 'region',
      type: 'text',
      label: { fr: 'Région', en: 'Region' },
      required: true,
      admin: { description: 'Ex : Horquetas de Sarapiquí, Heredia' },
    },
    // --- Agronomic data ---
    {
      name: 'surface',
      type: 'text',
      label: { fr: 'Surface cultivée', en: 'Cultivated area' },
      admin: { description: 'Ex : 2,5 ha' },
    },
    {
      name: 'altitude',
      type: 'text',
      label: { fr: 'Altitude', en: 'Altitude' },
      admin: { description: 'Ex : 86 m ou 900–1700 m' },
    },
    // --- Editorial content (localized) ---
    {
      name: 'bio',
      type: 'richText',
      label: { fr: 'Le producteur', en: 'The producer' },
      localized: true,
      editor: lexicalEditor({}),
    },
    {
      name: 'practices',
      type: 'richText',
      label: { fr: 'Pratiques agricoles', en: 'Agricultural practices' },
      localized: true,
      editor: lexicalEditor({}),
    },
    {
      name: 'ecology',
      type: 'richText',
      label: { fr: 'Écologie & terroir', en: 'Ecology & terroir' },
      localized: true,
      editor: lexicalEditor({}),
    },
    // --- Certifications / badges ---
    {
      name: 'badges',
      type: 'array',
      label: { fr: 'Certifications & badges', en: 'Certifications & badges' },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: { fr: 'Label', en: 'Label' },
          localized: true,
          required: true,
        },
      ],
    },
    // --- Media ---
    {
      name: 'portrait',
      type: 'upload',
      label: { fr: 'Portrait (1:1)', en: 'Portrait (1:1)' },
      relationTo: 'media',
      admin: { description: 'Photo du producteur, format carré.' },
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
