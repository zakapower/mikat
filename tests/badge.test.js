import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  formatBadgeText,
  formatBadgeTitle,
  badgeUrgency,
  badgePalette,
} from '../lib/badge.js'

describe('formatBadgeText', () => {
  it('shows 00:00 when due', () => {
    assert.equal(formatBadgeText(0), '00:00')
    assert.equal(formatBadgeText(59_000), '00:00')
  })
  it('shows remaining minutes under one hour', () => {
    assert.equal(formatBadgeText(61_000), '00:01')
    assert.equal(formatBadgeText(42 * 60_000), '00:42')
  })
  it('shows HH:MM matching floor countdown', () => {
    assert.equal(formatBadgeText(60 * 60_000), '01:00')
    assert.equal(formatBadgeText(125 * 60_000), '02:05')
    assert.equal(formatBadgeText((2 * 3600 + 37 * 60) * 1000), '02:37')
    assert.equal(formatBadgeText((2 * 3600 + 54 * 60 + 30) * 1000), '02:54')
  })
})

describe('badgeUrgency', () => {
  it('maps remaining time to colors', () => {
    assert.equal(badgeUrgency(2 * 60 * 60_000), 'white')
    assert.equal(badgeUrgency(60 * 60_000), 'white')
    assert.equal(badgeUrgency(59 * 60_000), 'yellow')
    assert.equal(badgeUrgency(15 * 60_000), 'yellow')
    assert.equal(badgeUrgency(14 * 60_000), 'red')
    assert.equal(badgeUrgency(0), 'red')
  })
})

describe('badgePalette', () => {
  it('returns contrasting pairs', () => {
    assert.equal(badgePalette('white').bg, '#F5F5F5')
    assert.equal(badgePalette('yellow').bg, '#FACC15')
    assert.equal(badgePalette('red').bg, '#DC2626')
  })
})

describe('formatBadgeTitle', () => {
  it('formats with place', () => {
    assert.equal(
      formatBadgeTitle({
        prayerNameRu: 'Зухр',
        msUntil: 42 * 60_000,
        placeLabel: 'Москва',
      }),
      'Зухр через 42 мин · Москва',
    )
  })
  it('formats hours like popup', () => {
    assert.equal(
      formatBadgeTitle({
        prayerNameRu: 'Магриб',
        msUntil: (2 * 3600 + 54 * 60) * 1000,
        placeLabel: '',
      }),
      'Магриб через 2 ч 54 мин',
    )
  })
})
