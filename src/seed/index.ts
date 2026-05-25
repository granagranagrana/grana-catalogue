/**
 * Seed script — migrate data.js content into Payload CMS.
 * Run: npm run seed
 * (requires a running DB / first run initialises SQLite automatically)
 */
import { getPayload } from 'payload'
import configPromise from '../../payload.config'

// ---- Canonical data (from data.js) ----

const PRODUCERS_DATA = [
  {
    id_slug: 'hernaldo-arrieta',
    name: 'Hernaldo Arrieta Rojas',
    farm: 'Ferme La Tabla',
    surface: '2,6 ha',
    altitude: '178 m',
    region: 'Río Cuarto, Alajuela',
    country: 'Costa Rica' as const,
    bio: 'Implantée dans la communauté rurale de La Tabla, dans le district de Río Cuarto, cette ferme est exploitée par Hernaldo Arrieta Rojas. Située à 178 mètres d\'altitude, elle bénéficie de conditions climatiques légèrement plus fraîches, au pied du Volcan Congo.',
    practices: 'Bien que non certifiée biologique, la ferme applique des pratiques conformes aux principes de l\'agriculture biologique et aux standards Rainforest Alliance. Aucun pesticide ni engrais de synthèse n\'est employé. La fertilisation repose exclusivement sur des intrants naturels produits sur place — composts, bioles et préparations végétales.',
    ecology: 'Le poivre est cultivé en agroforesterie, associé à des essences locales comme la Gliricidia sepium et l\'Erythrina. Environ 10 % de la surface est protégée pour préserver les rivières et les corridors biologiques.',
    badges: ['Pratiques bio', 'Rainforest Alliance', 'Agroforesterie'],
  },
  {
    id_slug: 'rigoberto-vindas',
    name: 'Rigoberto Vindas Chacón',
    farm: 'Finca La Victoria',
    surface: '2,5 ha',
    altitude: '86 m',
    region: 'Horquetas de Sarapiquí, Heredia',
    country: 'Costa Rica' as const,
    bio: 'Au bord du fleuve Sarapiquí, Rigoberto Vindas Chacón et sa famille sont installés sur une ferme de 2,5 hectares\u00a0: la Finca La Victoria. Implantée à basse altitude, le climat tropical et très humide favorise une croissance rapide et un profil aromatique vert et floral.',
    practices: 'La production est certifiée biologique selon la réglementation costaricienne. Après récolte, le poivre est transformé dans une installation certifiée USDA Organic et Bio UE, assurant une continuité des exigences biologiques tout au long de la chaîne de valeur.',
    ecology: 'La culture repose sur un système agroforestier\u00a0: les poivriers s\'appuient sur des arbres indigènes comme l\'Erythrina, créant un écosystème équilibré propice à la biodiversité et à la régénération des sols. La fertilité est entretenue exclusivement par le compost et le recyclage de la matière organique.',
    badges: ['Bio CR', 'USDA Organic', 'Bio UE', 'Agroforesterie'],
  },
  {
    id_slug: 'aadhimalai',
    name: 'Coopérative Aadhimalai',
    farm: 'Communauté native Aadhimalai',
    surface: 'multi-parcellaire',
    altitude: '900\u20131700 m',
    region: 'Massif des Nilgiris, Tamil Nadu',
    country: 'Inde' as const,
    bio: 'Le poivre de la coopérative Aadhimalai pousse au cœur de la Réserve de Biosphère des Nilgiris, un territoire de montagnes et de forêts luxuriantes du Tamil Nadu.',
    practices: 'L\'organisation est entièrement possédée et gouvernée par les producteurs tribaux, qui sont tous actionnaires de la coopérative. Ils supervisent collectivement la production, la transformation et la commercialisation, avec une forte implication des femmes dans les activités de production et de vente.',
    ecology: 'Dans les systèmes agroforestiers locaux, les lianes grimpent sur des arbres et coexistent avec d\'autres espèces, créant un écosystème diversifié et fertile. Grâce à l\'altitude, à la fertilité des sols et aux températures plus fraîches, la maturation est plus lente.',
    badges: ['Coopérative tribale', 'Agroforesterie', 'Réserve de Biosphère'],
  },
  {
    id_slug: 'makuvally',
    name: 'Groupement de Makuvally',
    farm: 'Village de Makuvally',
    surface: 'plusieurs dizaines de familles',
    altitude: '800 m',
    region: 'Idukki, Kerala',
    country: 'Inde' as const,
    bio: 'Le village de Makuvally est situé au bord de la réserve forestière d\'Idukki, dans un environnement montagneux préservé où cohabitent poivre, café et cacao. Une cinquantaine de familles préservent collectivement plusieurs variétés indigènes anciennes.',
    practices: 'Les producteurs pratiquent une polyculture sans intrants chimiques. Les lianes de poivre poussent sur des arbres tuteurs, et la fertilité des sols est maintenue grâce au paillage et aux fertilisants naturels.',
    ecology: 'La récolte se fait en plusieurs passages, avec comme particularité que les grappes ne sont récoltées qu\'à pleine maturité. Après séchage au soleil, les grains sont triés à la main et conditionnés séparément, assurant une traçabilité complète.',
    badges: ['Polyculture', 'Variétés anciennes', 'Tri main'],
  },
]

const PEPPERS_DATA = [
  {
    slug: 'la-tabla',
    name: 'La Tabla',
    producer_slug: 'hernaldo-arrieta',
    country: 'Costa Rica' as const,
    region: 'Río Cuarto, Alajuela',
    lat: 10.4, lng: -84.2,
    variety: 'Balankotta',
    altitude: '178 m',
    harvest: 'Jan–Mar · Juin–Sep',
    aromaticTitle: 'Aigre-doux & umami',
    aromatic: 'Une attaque intense et des notes de tomate séchée et de mélasse, qui dévoilent un profil aigre-doux singulier et umami. Ces notes balsamiques et concentrées sont le fruit d\'un terroir aux sols volcaniques et d\'une méthode de séchage unique.',
    notes: ['Tomate séchée', 'Mélasse', 'Balsamique', 'Umami'],
    profile: { fraicheur: 2, agrumes: 1, piquant: 3, longueur: 4, umami: 5 },
    prices: [{ qty: '100g', price: 48 }, { qty: '250g', price: 110 }, { qty: '1kg', price: 380 }],
  },
  {
    slug: 'la-victoria',
    name: 'La Victoria',
    producer_slug: 'rigoberto-vindas',
    country: 'Costa Rica' as const,
    region: 'Horquetas de Sarapiquí, Heredia',
    lat: 10.3, lng: -83.95,
    variety: 'Balankotta',
    altitude: '86 m',
    harvest: 'Jan–Mar · Juin–Sep',
    aromaticTitle: 'Frais, floral, mentholé',
    aromatic: 'Un poivre d\'une grande élégance, à la complexité et au spectre aromatique rare. L\'attaque, fraîche et légèrement sucrée, ouvre sur des notes mentholées et florales évoquant la peau de mangue et les fleurs blanches. Le séchage précis à basse température révèle une aromatique particulièrement riche et nuancée.',
    notes: ['Menthe', 'Fleurs blanches', 'Peau de mangue', 'Frais', 'Sucré'],
    profile: { fraicheur: 5, agrumes: 3, piquant: 2, longueur: 4, umami: 1 },
    prices: [{ qty: '100g', price: 52 }, { qty: '250g', price: 118 }, { qty: '1kg', price: 420 }],
  },
  {
    slug: 'aadhimalai',
    name: 'Aadhimalai',
    producer_slug: 'aadhimalai',
    country: 'Inde' as const,
    region: 'Massif des Nilgiris, Tamil Nadu',
    lat: 11.4, lng: 76.7,
    variety: 'Karimunda',
    altitude: '900\u20131700 m',
    harvest: 'Février–Mars',
    aromaticTitle: 'Agrumes & bois nobles',
    aromatic: 'Un nez frais, des notes d\'agrumes (citron vert) et herbacées (aneth, fenouil)\u00a0: une belle intensité qui reste très élégante. En bouche le piquant est rond et chaud, suivi d\'une superbe longueur en bouche, qui ouvre sur des arômes boisés particulièrement nobles.',
    notes: ['Citron vert', 'Aneth', 'Fenouil', 'Bois noble', 'Piquant rond'],
    profile: { fraicheur: 4, agrumes: 5, piquant: 4, longueur: 5, umami: 2 },
    prices: [{ qty: '100g', price: 58 }, { qty: '250g', price: 130 }, { qty: '1kg', price: 460 }],
  },
  {
    slug: 'neelamundi',
    name: 'Neelamundi',
    producer_slug: 'makuvally',
    country: 'Inde' as const,
    region: 'Idukki, Kerala',
    lat: 9.85, lng: 76.97,
    variety: 'Neelamundi',
    altitude: '800 m',
    harvest: 'Jan–Mar · Juin–Sep',
    aromaticTitle: 'Frais, agrumes, longueur',
    aromatic: 'Variété ancienne aux jeunes pousses violet-bleu (« Neel » signifie bleu en malayalam). Récolté grappe par grappe à pleine maturité. Nez frais, agrumes et herbacé\u00a0; piquant rond et chaud, belle longueur boisée.',
    notes: ['Citron vert', 'Herbacé', 'Bois', 'Maturité tardive'],
    profile: { fraicheur: 4, agrumes: 4, piquant: 4, longueur: 4, umami: 2 },
    prices: [{ qty: '100g', price: 62 }, { qty: '250g', price: 140 }, { qty: '1kg', price: 490 }],
  },
  {
    slug: 'vellamundi',
    name: 'Vellamundi',
    producer_slug: 'makuvally',
    country: 'Inde' as const,
    region: 'Idukki, Kerala',
    lat: 9.85, lng: 77.05,
    variety: 'Vellamundi',
    altitude: '800 m',
    harvest: 'Jan–Mar · Juin–Sep',
    aromaticTitle: 'Variété d\'ombre, rare',
    aromatic: 'Variété indigène rare et peu productive (« Vella » signifie blanc, en référence à la teinte vert pâle des baies fraîches). Variété d\'ombre, grappes courtes mais grains volumineux et denses. Profil frais et élégant, longueur boisée.',
    notes: ['Frais', 'Élégant', 'Bois', 'Grains denses'],
    profile: { fraicheur: 4, agrumes: 4, piquant: 4, longueur: 4, umami: 2 },
    prices: [{ qty: '100g', price: 68 }, { qty: '250g', price: 154 }, { qty: '1kg', price: 540 }],
  },
  {
    slug: 'kanjiramundi',
    name: 'Kanjiramundi',
    producer_slug: 'makuvally',
    country: 'Inde' as const,
    region: 'Idukki, Kerala',
    lat: 9.92, lng: 77.0,
    variety: 'Kanjiramundi',
    altitude: '800 m',
    harvest: 'Jan–Mar · Juin–Sep',
    aromaticTitle: 'Robuste, ridé, rare',
    aromatic: 'Variété indigène encore peu documentée. Feuilles épaisses, grappes de taille moyenne, grains noirs très ridés après séchage en raison d\'un péricarpe particulièrement fin. Cultivé en polyculture, tri main.',
    notes: ['Bois', 'Frais', 'Péricarpe fin', 'Grains ridés'],
    profile: { fraicheur: 4, agrumes: 3, piquant: 4, longueur: 4, umami: 3 },
    prices: [{ qty: '100g', price: 72 }, { qty: '250g', price: 162 }, { qty: '1kg', price: 580 }],
  },
]

const REGIONS_DATA = [
  {
    slug: 'costa-rica',
    name: 'Costa Rica',
    country: 'Costa Rica',
    summary: 'Volcan Congo · Sarapiquí',
    sub: '2 fermes · agroforesterie · sols volcaniques',
    lat: 10.3, lng: -84.1,
    pepper_slugs: ['la-tabla', 'la-victoria'],
  },
  {
    slug: 'tamil-nadu',
    name: 'Tamil Nadu',
    country: 'Inde · Tamil Nadu',
    summary: 'Massif des Nilgiris',
    sub: 'Coopérative tribale · 900\u20131700 m',
    lat: 11.4, lng: 76.7,
    pepper_slugs: ['aadhimalai'],
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    country: 'Inde · Kerala',
    summary: 'Hauts plateaux d\'Idukki',
    sub: 'Village de Makuvally · 3 variétés anciennes',
    lat: 9.9, lng: 77.0,
    pepper_slugs: ['neelamundi', 'vellamundi', 'kanjiramundi'],
  },
]

const MANIFESTO_DATA = {
  key: 'manifeste',
  manifestoOverline: 'Notre approche',
  manifestoQuote: 'Nous sélectionnons des poivres comme d\'autres sélectionnent des vins de domaine\u00a0: par le terroir, par le producteur, par la récolte.',
  manifestoByline: 'GRANA · Manifeste',
  atlasOverline: 'Nuancier 2026 · 6 poivres',
  atlasH1Line1: 'Sur le 10\u1d49 parallèle,',
  atlasH1Accent: 'deux terroirs.',
  atlasLede: 'De la Cordillère costaricienne aux Gh\u00e2ts du Kerala\u00a0: six poivres d\'exception, tous cultivés en agroforesterie le long de la même bande tropicale.',
}

// ---- Seed function ----

async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱  Starting GRANA seed…')

  // 1. Producers
  console.log('  → Seeding producers…')
  const producerIds: Record<string, string> = {}
  for (const p of PRODUCERS_DATA) {
    const existing = await payload.find({
      collection: 'producers',
      where: { name: { equals: p.name } },
    })
    if (existing.docs.length > 0) {
      producerIds[p.id_slug] = existing.docs[0].id as string
      console.log(`    skip (exists): ${p.name}`)
      continue
    }

    function makeLexical(text: string) {
      return {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text, version: 1 }],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      }
    }

    const doc = await payload.create({
      collection: 'producers',
      locale: 'fr',
      data: {
        name: p.name,
        farm: p.farm,
        surface: p.surface,
        altitude: p.altitude,
        region: p.region,
        country: p.country,
        bio: makeLexical(p.bio),
        practices: makeLexical(p.practices),
        ecology: makeLexical(p.ecology),
        badges: p.badges.map((label) => ({ label })),
      },
    })
    producerIds[p.id_slug] = doc.id as string
    console.log(`    created: ${p.name}`)
  }

  // 2. Peppers
  console.log('  → Seeding peppers…')
  const pepperIds: Record<string, string> = {}
  for (const p of PEPPERS_DATA) {
    const existing = await payload.find({
      collection: 'peppers',
      where: { slug: { equals: p.slug } },
    })
    if (existing.docs.length > 0) {
      pepperIds[p.slug] = existing.docs[0].id as string
      console.log(`    skip (exists): ${p.name}`)
      continue
    }

    function makeLexical(text: string) {
      return {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text, version: 1 }],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      }
    }

    const doc = await payload.create({
      collection: 'peppers',
      locale: 'fr',
      data: {
        slug: p.slug,
        name: p.name,
        producer: producerIds[p.producer_slug],
        country: p.country,
        region: p.region,
        coords: { lat: p.lat, lng: p.lng },
        variety: p.variety,
        altitude: p.altitude,
        harvest: p.harvest,
        aromaticTitle: p.aromaticTitle,
        aromatic: makeLexical(p.aromatic),
        notes: p.notes.map((note) => ({ note })),
        profile: p.profile,
        prices: p.prices,
        status: 'published',
      },
    })
    pepperIds[p.slug] = doc.id as string
    console.log(`    created: ${p.name}`)
  }

  // 3. Regions
  console.log('  → Seeding regions…')
  for (const r of REGIONS_DATA) {
    const existing = await payload.find({
      collection: 'regions',
      where: { slug: { equals: r.slug } },
    })
    if (existing.docs.length > 0) {
      console.log(`    skip (exists): ${r.name}`)
      continue
    }

    await payload.create({
      collection: 'regions',
      locale: 'fr',
      data: {
        slug: r.slug,
        name: r.name,
        country: r.country,
        summary: r.summary,
        sub: r.sub,
        coords: { lat: r.lat, lng: r.lng },
        peppers: r.pepper_slugs.map((slug) => pepperIds[slug]).filter(Boolean),
      },
    })
    console.log(`    created: ${r.name}`)
  }

  // 4. Manifesto page
  console.log('  → Seeding manifesto page…')
  const existingPage = await payload.find({
    collection: 'pages',
    where: { key: { equals: 'manifeste' } },
  })
  if (existingPage.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      locale: 'fr',
      data: {
        title: 'Manifeste',
        key: 'manifeste',
        manifestoOverline: MANIFESTO_DATA.manifestoOverline,
        manifestoQuote: MANIFESTO_DATA.manifestoQuote,
        manifestoByline: MANIFESTO_DATA.manifestoByline,
        atlasOverline: MANIFESTO_DATA.atlasOverline,
        atlasH1Line1: MANIFESTO_DATA.atlasH1Line1,
        atlasH1Accent: MANIFESTO_DATA.atlasH1Accent,
        atlasLede: MANIFESTO_DATA.atlasLede,
      },
    })
    console.log('    created: manifeste page')
  } else {
    console.log('    skip (exists): manifeste page')
  }

  console.log('✅  Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
