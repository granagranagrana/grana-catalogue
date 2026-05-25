# GRANA Catalogue

Application web B2B de catalogue pour **GRANA**, marque française de poivres d'exception.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Payload CMS v3** — back office embarqué à `/admin`, SQLite
- **Tailwind CSS** — tokens GRANA mappés
- **next-intl** — FR (défaut) + EN
- **React Hook Form + Zod** — formulaire devis
- **Resend** — envoi des leads
- **Phosphor Icons**

## Démarrage rapide

### Prérequis

- Node.js ≥ 20 ([nodejs.org](https://nodejs.org))
- npm ≥ 10

### Installation

```bash
cd grana-catalogue
cp .env.example .env.local
npm install
```

### Variables d'environnement (`.env.local`)

| Variable | Description |
|---|---|
| `PAYLOAD_SECRET` | Secret aléatoire pour Payload (min 32 chars) |
| `DATABASE_URL` | `file:./grana.db` (SQLite, défaut) |
| `RESEND_API_KEY` | Clé API [resend.com](https://resend.com) pour les devis |
| `QUOTE_RECIPIENT_EMAIL` | Email de destination des demandes de devis |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (ex : `http://localhost:3000`) |

### Lancer le dev

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### Back office

[http://localhost:3000/admin](http://localhost:3000/admin)

Au premier lancement, Payload vous invite à créer le premier compte admin.

### Seed (données initiales)

Une fois le serveur démarré :

```bash
npm run seed
```

Cela charge les 6 poivres, 4 producteurs, 3 régions et le manifeste depuis les données canoniques.

## Structure

```
grana-catalogue/
├── payload.config.ts          Config Payload CMS
├── src/
│   ├── app/
│   │   ├── (app)/[locale]/    Pages front (Atlas, gamme, fiches)
│   │   ├── (payload)/admin/   Back office Payload
│   │   └── api/               Routes API (Payload + devis)
│   ├── collections/           Schemas CMS (Peppers, Producers…)
│   ├── components/            Composants React
│   ├── i18n/                  Traductions FR/EN
│   ├── lib/                   Helpers (payload, map)
│   └── seed/                  Script de seed
├── public/
│   ├── fonts/                 Martian Mono + Hanken Grotesk
│   └── assets/                Logos GRANA
└── grana.db                   Base SQLite (créée au premier run)
```

## Pages

| Route | Description |
|---|---|
| `/` | Atlas — carte monde + origines |
| `/poivres` | La gamme — liste filtrée par région |
| `/poivres/[slug]` | Fiche poivre — hero, aromatique, devis |
| `/producteurs/[slug]` | Fiche producteur — biographie, pratiques |
| `/admin` | Back office Payload CMS |

## Back office — tout est modifiable

Dans Payload `/admin` :

- **Poivres** — nom, slug, pays, région, coordonnées GPS, variété, altitude, récolte, titre aromatique, description, notes de dégustation, profil (radar 0-5), prix par conditionnement, images, statut draft/publié
- **Producteurs** — nom, ferme, pays, région, surface, altitude, biographie, pratiques agricoles, écologie & terroir, certifications, portrait, galerie
- **Régions** — nom, pays, résumé, sous-titre, coordonnées carte, poivres liés
- **Pages** — manifeste Atlas (overline, citation, byline, lede hero), pages éditoriales (contact, mentions)
- **Médias** — upload photos avec alt text localisé, 3 tailles générées automatiquement
- **Utilisateurs** — gestion des accès admin / éditeur

Tout le contenu est bilingue FR/EN, avec publication indépendante par locale.

## Build production

```bash
npm run build
npm start
```
