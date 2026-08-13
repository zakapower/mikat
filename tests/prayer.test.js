import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeDayTimes, getNextPrayer, PRAYER_LABELS_RU } from '../lib/prayer.js'

const moscow = { latitude: 55.7558, longitude: 37.6173 }

describe('computeDayTimes', () => {
  it('returns six slots with Russian labels', () => {
    const day = computeDayTimes({
      date: new Date('2026-06-15T12:00:00+03:00'),
      ...moscow,
      methodId: 'MWL',
      asrMadhab: 'shafi',
    })
    assert.equal(day.list.length, 6)
    assert.equal(day.list[0].labelRu, 'Фаджр')
    assert.ok(day.times.fajr.ms < day.times.dhuhr.ms)
  })
})

describe('getNextPrayer', () => {
  it('picks upcoming salah not sunrise', () => {
    const next = getNextPrayer({
      now: new Date('2026-06-15T08:00:00+03:00'),
      ...moscow,
      methodId: 'MWL',
      asrMadhab: 'shafi',
    })
    assert.ok(next.id !== 'sunrise')
    assert.ok(Object.keys(PRAYER_LABELS_RU).includes(next.id))
    assert.ok(next.msUntil > 0)
  })
})
