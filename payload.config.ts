import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Peppers } from './src/collections/Peppers'
import { Producers } from './src/collections/Producers'
import { Regions } from './src/collections/Regions'
import { Pages } from './src/collections/Pages'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— GRANA Admin',
    },
  },
  collections: [Peppers, Producers, Regions, Pages, Media, Users],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL ?? `file:${path.resolve(dirname, './grana.db')}`,
    },
  }),
  editor: lexicalEditor({}),
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? 'grana-dev-secret-change-in-prod',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  sharp,
})
