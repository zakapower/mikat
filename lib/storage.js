export const DEFAULT_SETTINGS = {
  theme: 'dark',
  lang: 'ru',
  methodId: 'MWL',
  asrMadhab: 'shafi',
  notificationsEnabled: true,
  notifyBeforeMinutes: 10,
  coords: null,
  placeLabel: '',
}

export async function getSettings() {
  const data = await chrome.storage.sync.get(DEFAULT_SETTINGS)
  return { ...DEFAULT_SETTINGS, ...data }
}

export async function setSettings(partial) {
  const next = { ...(await getSettings()), ...partial }
  await chrome.storage.sync.set(next)
  return next
}

export async function getDayCache() {
  const { dayCache } = await chrome.storage.local.get({ dayCache: null })
  return dayCache
}

export async function setDayCache(cache) {
  await chrome.storage.local.set({ dayCache: cache })
}
