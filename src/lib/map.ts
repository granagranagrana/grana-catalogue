// Equirectangular projection helper
// ViewBox 0 0 880 440 — equator at y=220, prime meridian at x=440
// 1° ≈ 2.44 px

export function llToXY(lat: number, lng: number): { x: number; y: number } {
  return {
    x: 440 + lng * 2.44,
    y: 220 - lat * 2.44,
  }
}
