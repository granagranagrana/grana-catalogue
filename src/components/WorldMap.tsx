'use client'

import { useRouter } from 'next/navigation'
import { llToXY } from '@/lib/map'

// Simplified continent paths (equirectangular approximation)
const CONTINENTS = [
  // North America
  {
    id: 'north-america',
    d: 'M 95 100 L 150 80 L 195 75 L 220 90 L 230 120 L 215 145 L 200 155 L 185 170 L 175 190 L 160 210 L 150 230 L 135 220 L 120 200 L 105 185 L 95 170 L 80 155 L 75 135 L 85 115 Z',
  },
  // South America
  {
    id: 'south-america',
    d: 'M 155 235 L 175 225 L 195 235 L 210 255 L 220 280 L 215 310 L 205 335 L 190 360 L 170 375 L 155 370 L 140 355 L 130 330 L 128 305 L 132 280 L 140 260 Z',
  },
  // Europe
  {
    id: 'europe',
    d: 'M 430 70 L 460 65 L 490 70 L 510 80 L 505 95 L 520 100 L 515 115 L 500 120 L 485 115 L 470 120 L 460 130 L 445 125 L 435 115 L 425 105 L 420 90 Z',
  },
  // Africa
  {
    id: 'africa',
    d: 'M 440 130 L 470 125 L 500 130 L 520 150 L 530 175 L 535 205 L 530 235 L 520 265 L 505 295 L 485 320 L 465 335 L 450 330 L 435 315 L 425 290 L 420 260 L 418 230 L 422 200 L 428 170 L 432 150 Z',
  },
  // Asia (split roughly)
  {
    id: 'asia',
    d: 'M 515 70 L 580 60 L 650 65 L 710 70 L 750 80 L 780 90 L 790 110 L 780 135 L 760 150 L 740 160 L 720 165 L 700 175 L 680 185 L 660 190 L 640 185 L 620 175 L 600 165 L 575 155 L 550 145 L 530 135 L 515 120 L 510 100 Z',
  },
  // Indian subcontinent
  {
    id: 'india',
    d: 'M 620 160 L 645 155 L 670 160 L 680 175 L 685 195 L 680 215 L 665 235 L 648 245 L 633 240 L 620 225 L 615 205 L 614 185 Z',
  },
  // Southeast Asia
  {
    id: 'sea',
    d: 'M 700 160 L 730 155 L 755 165 L 760 180 L 750 195 L 735 200 L 715 195 L 700 182 Z',
  },
  // Australia
  {
    id: 'australia',
    d: 'M 700 280 L 740 270 L 775 275 L 800 290 L 805 315 L 790 340 L 765 350 L 735 345 L 710 330 L 698 308 Z',
  },
]

interface RegionDot {
  id: string
  lat: number
  lng: number
  label: string
}

interface WorldMapProps {
  regions: RegionDot[]
  locale: string
}

export function WorldMap({ regions, locale }: WorldMapProps) {
  const router = useRouter()
  const base = locale === 'en' ? '/en' : ''

  // 10°N parallel
  const tenNorth = llToXY(10, 0)

  return (
    <svg
      viewBox="0 0 880 440"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      aria-label="Carte des origines GRANA"
      role="img"
    >
      {/* Lat/long grid lines every 30° */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const { y } = llToXY(lat, 0)
        return (
          <line
            key={`lat-${lat}`}
            x1="0"
            y1={y}
            x2="880"
            y2={y}
            stroke="rgba(17,20,33,0.06)"
            strokeWidth="0.6"
          />
        )
      })}
      {[-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
        const { x } = llToXY(0, lng)
        return (
          <line
            key={`lng-${lng}`}
            x1={x}
            y1="0"
            x2={x}
            y2="440"
            stroke="rgba(17,20,33,0.06)"
            strokeWidth="0.6"
          />
        )
      })}

      {/* Equator */}
      <line x1="0" y1="220" x2="880" y2="220"
        stroke="rgba(17,20,33,0.16)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
      />

      {/* Continent silhouettes */}
      {CONTINENTS.map((c) => (
        <path
          key={c.id}
          d={c.d}
          fill="#e8e7e0"
          stroke="#d0cfc6"
          strokeWidth="0.8"
        />
      ))}

      {/* 10°N parallel — accent */}
      <line
        x1="40"
        y1={tenNorth.y}
        x2="840"
        y2={tenNorth.y}
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <text
        x="845"
        y={tenNorth.y + 4}
        fontFamily="var(--font-mono)"
        fontSize="13"
        letterSpacing="0.08em"
        fill="var(--accent)"
        textAnchor="start"
      >
        10°N
      </text>

      {/* Origin dots */}
      {regions.map((region) => {
        const pos = llToXY(region.lat, region.lng)
        return (
          <g
            key={region.id}
            className="cursor-pointer"
            onClick={() => router.push(`${base}/poivres?region=${region.id}`)}
            role="button"
            aria-label={`Voir les poivres de ${region.label}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`${base}/poivres?region=${region.id}`)}
          >
            {/* Animated halo */}
            <circle cx={pos.x} cy={pos.y} r="12" fill="var(--accent)" opacity="0.16">
              <animate
                attributeName="r"
                values="12;16;12"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.16;0.06;0.16"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Inner dot */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="5"
              fill="var(--accent)"
              stroke="white"
              strokeWidth="1.5"
            />
            {/* Label */}
            <text
              x={pos.x}
              y={pos.y - 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="10"
              fontWeight="500"
              letterSpacing="0.08em"
              fill="var(--fg-primary)"
              style={{ textTransform: 'uppercase' }}
            >
              {region.label}
            </text>
          </g>
        )
      })}

      {/* Corner crosshairs */}
      {[
        { x: 12, y: 12 },
        { x: 868, y: 12 },
        { x: 12, y: 428 },
        { x: 868, y: 428 },
      ].map(({ x, y }, i) => (
        <g key={i} stroke="rgba(17,20,33,0.5)" strokeWidth="1">
          <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
          <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
        </g>
      ))}
    </svg>
  )
}
