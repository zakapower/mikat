/** Countdown for action icon: HH:MM remaining (floor, same as popup). */
export function formatBadgeText(msUntil) {
  const ms = Math.max(0, Number(msUntil) || 0)
  const totalSec = Math.floor(ms / 1000)
  const h = Math.min(99, Math.floor(totalSec / 3600))
  const m = Math.floor((totalSec % 3600) / 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** white ≥1ч, yellow <1ч, red <15м */
export function badgeUrgency(msUntil) {
  const ms = Math.max(0, Number(msUntil) || 0)
  if (ms < 15 * 60_000) return 'red'
  if (ms < 60 * 60_000) return 'yellow'
  return 'white'
}

export function badgePalette(urgency) {
  if (urgency === 'red') return { bg: '#DC2626', fg: '#FFFFFF' }
  if (urgency === 'yellow') return { bg: '#FACC15', fg: '#111111' }
  return { bg: '#F5F5F5', fg: '#111111' }
}

export function formatBadgeTitle({ prayerNameRu, msUntil, placeLabel }) {
  const ms = Math.max(0, Number(msUntil) || 0)
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const when =
    h > 0 ? `${h} ч ${String(m).padStart(2, '0')} мин` : `${m} мин`
  const base = `${prayerNameRu} через ${when}`
  const place = (placeLabel || '').trim()
  return place ? `${base} · ${place}` : base
}
