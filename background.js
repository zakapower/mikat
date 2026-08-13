import {
  formatBadgeText,
  formatBadgeTitle,
  badgeUrgency,
  badgePalette,
} from './lib/badge.js'
import { computeDayTimes, getNextPrayer, PRAYER_LABELS_RU, SALAH_IDS } from './lib/prayer.js'
import { getSettings, setDayCache } from './lib/storage.js'

const DEFAULT_ICON = {
  16: 'icons/icon16.png',
  48: 'icons/icon48.png',
  128: 'icons/icon128.png',
}

/** Solid purple square — moon hidden while countdown badge is shown */
const BADGE_ONLY_ICON = {
  16: 'icons/icon-empty16.png',
  48: 'icons/icon-empty48.png',
  128: 'icons/icon-empty128.png',
}

async function clearNotifyAlarms() {
  const all = await chrome.alarms.getAll()
  await Promise.all(
    all
      .filter(
        (a) => a.name.startsWith('mikat-salah:') || a.name.startsWith('mikat-pre:'),
      )
      .map((a) => chrome.alarms.clear(a.name)),
  )
}

async function ensureTickAlarm() {
  const existing = await chrome.alarms.get('mikat-tick')
  if (!existing) {
    chrome.alarms.create('mikat-tick', { periodInMinutes: 1 })
  }
}

async function applyBadge(next, placeLabel) {
  const msUntil = Math.max(0, next.at.getTime() - Date.now())
  const text = formatBadgeText(msUntil)
  const title = formatBadgeTitle({
    prayerNameRu: next.labelRu,
    msUntil,
    placeLabel,
  })
  const { bg, fg } = badgePalette(badgeUrgency(msUntil))

  await chrome.action.setIcon({ path: BADGE_ONLY_ICON })
  await chrome.action.setBadgeText({ text })
  await chrome.action.setBadgeBackgroundColor({ color: bg })
  try {
    await chrome.action.setBadgeTextColor({ color: fg })
  } catch {
    /* older Chromium */
  }
  await chrome.action.setTitle({ title })
}

async function resetIcon() {
  await chrome.action.setBadgeText({ text: '' })
  await chrome.action.setIcon({ path: DEFAULT_ICON })
}

async function scheduleNotifications(settings, upcoming) {
  if (!settings.notificationsEnabled) return
  const before = Number(settings.notifyBeforeMinutes) || 0
  for (const item of upcoming) {
    const when = item.ms
    if (when > Date.now()) {
      chrome.alarms.create(`mikat-salah:${item.id}`, { when })
      if (before > 0 && when - before * 60_000 > Date.now()) {
        chrome.alarms.create(`mikat-pre:${item.id}`, {
          when: when - before * 60_000,
        })
      }
    }
  }
}

export async function refreshAll() {
  const settings = await getSettings()
  await ensureTickAlarm()

  if (!settings.coords) {
    await resetIcon()
    await chrome.action.setTitle({ title: 'Mikat — укажите локацию' })
    await clearNotifyAlarms()
    return
  }

  const { latitude, longitude } = settings.coords
  const now = new Date()
  const day = computeDayTimes({
    date: now,
    latitude,
    longitude,
    methodId: settings.methodId,
    asrMadhab: settings.asrMadhab,
  })
  const next = getNextPrayer({
    now,
    latitude,
    longitude,
    methodId: settings.methodId,
    asrMadhab: settings.asrMadhab,
  })

  await setDayCache({
    dateKey: day.dateKey,
    times: day.times,
    list: day.list,
    next: {
      id: next.id,
      labelRu: next.labelRu,
      iso: next.at.toISOString(),
      msUntil: next.at.getTime() - Date.now(),
    },
    updatedAt: Date.now(),
  })

  await applyBadge(next, settings.placeLabel)
  await clearNotifyAlarms()

  let upcoming = SALAH_IDS.map((id) => ({ id, ms: day.times[id].ms })).filter(
    (x) => x.ms > Date.now(),
  )
  if (upcoming.length === 0) {
    upcoming = [{ id: next.id, ms: next.at.getTime() }]
  }
  await scheduleNotifications(settings, upcoming)
}

chrome.runtime.onInstalled.addListener(() => {
  refreshAll()
})
chrome.runtime.onStartup.addListener(() => {
  refreshAll()
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'mikat-tick') {
    await refreshAll()
    return
  }
  const settings = await getSettings()
  if (!settings.notificationsEnabled) {
    await refreshAll()
    return
  }

  if (alarm.name.startsWith('mikat-pre:')) {
    const id = alarm.name.split(':')[1]
    chrome.notifications.create(`pre-${id}-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Mikat',
      message: `Скоро ${PRAYER_LABELS_RU[id]} (через ${settings.notifyBeforeMinutes} мин)`,
    })
  }
  if (alarm.name.startsWith('mikat-salah:')) {
    const id = alarm.name.split(':')[1]
    chrome.notifications.create(`salah-${id}-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Mikat',
      message: `Время намаза: ${PRAYER_LABELS_RU[id]}`,
    })
  }
  await refreshAll()
})

chrome.notifications.onClicked.addListener(async () => {
  try {
    await chrome.action.openPopup()
  } catch {
    /* ignore */
  }
})

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'SETTINGS_CHANGED' || msg?.type === 'REFRESH') {
    refreshAll().then(() => sendResponse({ ok: true }))
    return true
  }
})
