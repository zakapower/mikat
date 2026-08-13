export const GITHUB_URL = 'https://github.com/zakapower'

/** @typedef {'ru' | 'en'} Lang */

export const STRINGS = {
  brand: { ru: 'Mikat', en: 'Mikat' },
  github: { ru: 'GitHub', en: 'GitHub' },
  switchToEn: { ru: 'Switch to English', en: 'Switch to English' },
  switchToRu: { ru: 'Переключить на русский', en: 'Переключить на русский' },
  themeToDark: { ru: 'Включить тёмную тему', en: 'Enable dark theme' },
  themeToLight: { ru: 'Включить светлую тему', en: 'Enable light theme' },
  settings: { ru: 'Настройки', en: 'Settings' },
  back: { ru: 'Закрыть', en: 'Close' },
  nextPrayer: { ru: 'Следующий намаз', en: 'Next prayer' },
  now: { ru: 'Сейчас', en: 'Now' },
  through: { ru: 'через', en: 'in' },
  locating: { ru: 'Определяю местоположение…', en: 'Detecting location…' },
  needLocation: {
    ru: 'Укажите город или разрешите геолокацию',
    en: 'Choose a city or allow geolocation',
  },
  locationUnset: { ru: 'Локация не задана', en: 'Location not set' },
  savedLocation: { ru: 'Сохранённая локация', en: 'Saved location' },
  refreshLocation: { ru: 'Обновить местоположение', en: 'Refresh location' },
  location: { ru: 'Локация', en: 'Location' },
  myLocation: { ru: 'Моё местоположение', en: 'My location' },
  searchCity: { ru: 'Поиск города…', en: 'Search city…' },
  searchCityLabel: { ru: 'Поиск города', en: 'City search' },
  calculation: { ru: 'Расчёт', en: 'Calculation' },
  method: { ru: 'Метод расчёта', en: 'Calculation method' },
  asrMadhab: { ru: 'Аср (мазхаб)', en: 'Asr (madhab)' },
  notifications: { ru: 'Уведомления', en: 'Notifications' },
  enable: { ru: 'Включить', en: 'Enable' },
  remindBefore: { ru: 'Напомнить за', en: 'Remind before' },
  savingLocation: { ru: 'Сохраняю локацию…', en: 'Saving location…' },
  geoDenied: {
    ru: 'Геолокация отклонена — найдите город вручную',
    en: 'Geolocation denied — search for a city',
  },
  geoFailed: {
    ru: 'Не удалось получить координаты',
    en: 'Could not get coordinates',
  },
  nothingFound: { ru: 'Ничего не найдено', en: 'Nothing found' },
  offlineSearch: {
    ru: 'Нет сети для поиска. Можно продолжить с прошлой локацией.',
    en: 'No network for search. You can keep the previous location.',
  },
  asrShafi: { ru: 'Стандарт (шафии)', en: 'Standard (Shafi)' },
  asrHanafi: { ru: 'Ханафи', en: 'Hanafi' },
  min5: { ru: '5 мин', en: '5 min' },
  min10: { ru: '10 мин', en: '10 min' },
  min15: { ru: '15 мин', en: '15 min' },
  fajr: { ru: 'Фаджр', en: 'Fajr' },
  sunrise: { ru: 'Восход', en: 'Sunrise' },
  dhuhr: { ru: 'Зухр', en: 'Dhuhr' },
  asr: { ru: 'Аср', en: 'Asr' },
  maghrib: { ru: 'Магриб', en: 'Maghrib' },
  isha: { ru: 'Иша', en: 'Isha' },
  h: { ru: 'ч', en: 'h' },
  min: { ru: 'мин', en: 'min' },
  s: { ru: 'с', en: 's' },
}

export function t(lang, key) {
  const row = STRINGS[key]
  if (!row) return key
  return row[lang === 'en' ? 'en' : 'ru']
}

export function prayerLabel(lang, id) {
  return t(lang, id)
}
