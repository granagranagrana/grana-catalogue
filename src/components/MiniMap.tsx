import { llToXY } from '@/lib/map'

// The mini-map uses the same continent paths scaled to a 88x56 viewport
// We achieve this by applying a viewBox scale transform
const SCALE_X = 88 / 880
const SCALE_Y = 56 / 440

interface MiniMapProps {
  lat: number
  lng: number
  label?: string
}

const CONTINENTS_SCALED = [
  { id: 'north-america', d: 'M 95 100 L 150 80 L 195 75 L 220 90 L 230 120 L 215 145 L 200 155 L 185 170 L 175 190 L 160 210 L 150 230 L 135 220 L 120 200 L 105 185 L 95 170 L 80 155 L 75 135 L 85 115 Z' },
  { id: 'south-america', d: 'M 155 235 L 175 225 L 195 235 L 210 255 L 220 280 L 215 310 L 205 335 L 190 360 L 170 375 L 155 370 L 140 355 L 130 330 L 128 305 L 132 280 L 140 260 Z' },
  { id: 'europe', d: 'M 430 70 L 460 65 L 490 70 L 510 80 L 505 95 L 520 100 L 515 115 L 500 120 L 485 115 L 470 120 L 460 130 L 445 125 L 435 115 L 425 105 L 420 90 Z' },
  { id: 'africa', d: 'M 440 130 L 470 125 L 500 130 L 520 150 L 530 175 L 535 205 L 530 235 L 520 265 L 505 295 L 485 320 L 465 335 L 450 330 L 435 315 L 425 290 L 420 260 L 418 230 L 422 200 L 428 170 L 432 150 Z' },
  { id: 'asia', d: 'M 515 70 L 580 60 L 650 65 L 710 70 L 750 80 L 780 90 L 790 110 L 780 135 L 760 150 L 740 160 L 720 165 L 700 175 L 680 185 L 660 190 L 640 185 L 620 175 L 600 165 L 575 155 L 550 145 L 530 135 L 515 120 L 510 100 Z' },
  { id: 'india', d: 'M 620 160 L 645 155 L 670 160 L 680 175 L 685 195 L 680 215 L 665 235 L 648 245 L 633 240 L 620 225 L 615 205 L 614 185 Z' },
  { id: 'sea', d: 'M 700 160 L 730 155 L 755 165 L 760 180 L 750 195 L 735 200 L 715 195 L 700 182 Z' },
  { id: 'australia', d: 'M 700 280 L 740 270 L 775 275 L 800 290 L 805 315 L 790 340 L 765 350 L 735 345 L 710 330 L 698 308 Z' },
]

export function MiniMap({ lat, lng }: MiniMapProps) {
  const pos = llToXY(lat, lng)

  return (
    <svg
      viewBox="0 0 880 440"
      width="88"
      height="56"
      aria-hidden
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Equator */}
      <line x1="0" y1="220" x2="880" y2="220"
        stroke="rgba(17,20,33,0.12)"
        strokeWidth="1.2"
        strokeDasharray="4 8"
      />

      {/* Continents */}
      {CONTINENTS_SCALED.map((c) => (
        <path key={c.id} d={c.d} fill="#e8e7e0" stroke="#d0cfc6" strokeWidth="1.5" />
      ))}

      {/* 10°N */}
      <line
        x1="0"
        y1={llToXY(10, 0).y}
        x2="880"
        y2={llToXY(10, 0).y}
        stroke="var(--accent)"
        strokeWidth="2"
      />

      {/* Active dot — no animation */}
      <circle cx={pos.x} cy={pos.y} r="20" fill="var(--accent)" opacity="0.18" />
      <circle cx={pos.x} cy={pos.y} r="8" fill="var(--accent)" stroke="white" strokeWidth="2.5" />
    </svg>
  )
}
