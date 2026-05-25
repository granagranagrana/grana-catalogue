import type { CollectionConfig } from 'payload'

export const Regions: CollectionConfig = {
  slug: 'regions',
  admin: {
    useAsTitle: 'name',
    group: 'Catalogue',
    defaultColumns: ['name', 'country', 'summary'],
    description: 'Regroupement géographique des origines.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { fr: 'Nom de la région', en: 'Region name' },
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
    },
    {
      name: 'country',
      type: 'text',
      label: { fr: 'Pays / libellé', en: 'Country / label' },
      localized: true,
      admin: { description: 'Ex : Inde · Kerala' },
    },
    {
      name: 'summary',
      type: 'text',
      label: { fr: 'Résumé géographique', en: 'Geographic summary' },
      localized: true,
      admin: { description: 'Ligne courte affiché sous le nom. Ex : Hauts plateaux d\'Idukki' },
    },
    {
      name: 'sub',
      type: 'text',
      label: { fr: 'Sous-titre / meta', en: 'Subtitle / meta' },
      localized: true,
      admin: { description: 'Ex : Village de Makuvally · 3 variétés anciennes' },
    },
    {
      name: 'coords',
      type: 'group',
      label: { fr: 'Coordonnées carte (centre de la région)', en: 'Map coordinates (region centre)' },
      fields: [
        { name: 'lat', type: 'number', label: 'Latitude', min: -90, max: 90 },
        { name: 'lng', type: 'number', label: 'Longitude', min: -180, max: 180 },
      ],
    },
    {
      name: 'peppers',
      type: 'relationship',
      label: { fr: 'Poivres de cette région', en: 'Peppers from this region' },
      relationTo: 'peppers',
      hasMany: true,
    },
  ],
}
