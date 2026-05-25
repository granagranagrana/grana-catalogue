import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/uploads',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card',      width: 800, height: 600, position: 'centre' },
      { name: 'hero',      width: 1600, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  admin: {
    group: 'Catalogue',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { fr: 'Texte alternatif', en: 'Alt text' },
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: { fr: 'Légende', en: 'Caption' },
      localized: true,
    },
  ],
}
