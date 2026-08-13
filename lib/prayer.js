import { Coordinates, PrayerTimes } from '../vendor/adhan.js'
import { buildParams } from './methods.js'

export const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']
export const SALAH_IDS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
export const PRAYER_LABELS_RU = {
  fajr: 'Фаджр',
  sunrise: 'Восход',
  dhuhr: 'Зухр',
  asr: 'Аср',
  maghrib: 'Магриб',
  isha: 'Иша',
}

function dateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function computeDayTimes({ date, latitude, longitude, methodId, asrMadhab }) {
  const coords = new Coordinates(latitude, longitude)
  const params = buildParams(methodId, asrMadhab)
  const pt = new PrayerTimes(coords, date, params)
  const times = {}
  const list = []
  for (const id of PRAYER_ORDER) {
    const at = pt[id]
    const ms = at.getTime()
    times[id] = { iso: at.toISOString(), ms }
    list.push({ id, labelRu: PRAYER_LABELS_RU[id], iso: at.toISOString(), ms })
  }
  return { dateKey: dateKey(date), times, list }
}

export function getNextPrayer({ now, latitude, longitude, methodId, asrMadhab }) {
  const base = { latitude, longitude, methodId, asrMadhab }
  const today = computeDayTimes({ date: now, ...base })
  for (const id of SALAH_IDS) {
    const msUntil = today.times[id].ms - now.getTime()
    if (msUntil > 0) {
      return {
        id,
        labelRu: PRAYER_LABELS_RU[id],
        at: new Date(today.times[id].ms),
        msUntil,
      }
    }
  }
  const tomorrowDate = new Date(now)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = computeDayTimes({ date: tomorrowDate, ...base })
  const fajrMs = tomorrow.times.fajr.ms
  return {
    id: 'fajr',
    labelRu: PRAYER_LABELS_RU.fajr,
    at: new Date(fajrMs),
    msUntil: fajrMs - now.getTime(),
  }
}
