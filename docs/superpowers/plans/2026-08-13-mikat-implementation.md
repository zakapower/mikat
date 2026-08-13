# Микат Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать Chrome/Edge MV3-расширение Микат: локальный расчёт намаза, popup в стиле соседних проектов (фиолетовый accent), badge-countdown и отключаемые уведомления.

**Architecture:** Service worker оркестрирует `prayer` / `storage` / `badge` / alarms / notifications. Popup — vanilla HTML/CSS/JS. Расчёт через vendored `adhan`; поиск города — Nominatim. Без React/сборщика UI.

**Tech Stack:** Manifest V3, ES modules, `adhan`, `chrome.storage` / `alarms` / `notifications` / `geolocation`, Node `node:test` для unit-тестов lib.

## Global Constraints

- Название продукта и UI: **Микат**; папка проекта: **`mikat`**
- Браузер: Chrome / Edge, Manifest V3 only
- Акцент: light `#6d28d9`, dark `#a78bfa`; CSS-переменные как у соседних проектов
- Метод по умолчанию: Muslim World League; выбор метода в настройках
- Язык UI: русский
- Уведомления включаемые/выключаемые; badge работает всегда при известной локации
- Не коммитить секреты; коммиты только если пользователь явно попросил (в шагах Commit — пропускать, если не просили)
- Вне scope v1: Firefox, кибла, new-tab, звук азана

## File Structure

```
mikat/
  package.json
  README.md
  manifest.json
  background.js
  popup/popup.html
  popup/popup.css
  popup/popup.js
  lib/badge.js
  lib/prayer.js
  lib/storage.js
  lib/geo.js
  lib/methods.js
  vendor/adhan.js
  icons/icon16.png
  icons/icon48.png
  icons/icon128.png
  tests/badge.test.js
  tests/prayer.test.js
  tests/storage.test.js
  docs/superpowers/specs/2026-08-13-mikat-design.md
  docs/superpowers/plans/2026-08-13-mikat-implementation.md
```

---

### Task 1: Переименовать папку и каркас проекта

**Files:**
- Rename: `c:\Users\Admin\projects\Новая папка` → `c:\Users\Admin\projects\mikat`
- Create: `package.json`, `README.md`, `manifest.json` (минимальный stub)
- Keep: `docs/superpowers/**`

**Interfaces:**
- Consumes: утверждённая спека
- Produces: рабочий корень `mikat` с `manifest.json` name `Микат`

- [ ] **Step 1: Переименовать папку**

В PowerShell (закрыть лишние хендлы к старой папке при необходимости):

```powershell
Rename-Item -LiteralPath "c:\Users\Admin\projects\Новая папка" -NewName "mikat"
```

Expected: существует `c:\Users\Admin\projects\mikat`. Если Cursor держит workspace — после rename открыть папку `mikat` заново.

- [ ] **Step 2: Создать `package.json`**

```json
{
  "name": "mikat",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node --test tests/**/*.test.js"
  },
  "devDependencies": {
    "adhan": "^4.4.3"
  }
}
```

- [ ] **Step 3: Создать минимальный `manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "Микат",
  "description": "Времена намаза, countdown на иконке и уведомления",
  "version": "1.0.0",
  "action": {
    "default_title": "Микат",
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "permissions": ["storage", "alarms", "notifications", "geolocation"],
  "host_permissions": ["https://nominatim.openstreetmap.org/*"],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

- [ ] **Step 4: README с установкой unpacked**

```markdown
# Микат

Расширение Chrome/Edge: времена намаза, badge-countdown, уведомления.

## Установка

1. `chrome://extensions` → Режим разработчика
2. «Загрузить распакованное» → эта папка
3. `npm test` — unit-тесты lib
```

- [ ] **Step 5: Создать заглушки иконок**

Пока PNG 16/48/128 — однотонный фиолетовый квадрат (сгенерировать скриптом Node/Canvas или вручную). Файлы: `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`.

- [ ] **Step 6: Commit (только если пользователь просил)**

```bash
git add -A && git status
# git commit только по явной просьбе
```

---

### Task 2: `lib/badge.js` — формат badge и title

**Files:**
- Create: `lib/badge.js`
- Test: `tests/badge.test.js`

**Interfaces:**
- Consumes: —
- Produces:
  - `formatBadgeText(msUntil: number): string` — `·` если ≤ 60s; иначе `<N>м` если < 60 мин; иначе `<N>ч` (часы округление вниз, минимум 1ч при ≥60 мин)
  - `formatBadgeTitle({ prayerNameRu: string, msUntil: number, placeLabel: string }): string` — `«{prayer} через {N} мин · {place}»` или с часами/минутами согласованно: всегда минуты в title (`через 125 мин`), place пустой → без ` · `

- [ ] **Step 1: Написать failing test**

```js
// tests/badge.test.js
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatBadgeText, formatBadgeTitle } from '../lib/badge.js'

describe('formatBadgeText', () => {
  it('shows dot when under or equal 60s', () => {
    assert.equal(formatBadgeText(0), '·')
    assert.equal(formatBadgeText(60_000), '·')
  })
  it('shows minutes under 60m', () => {
    assert.equal(formatBadgeText(61_000), '2м')
    assert.equal(formatBadgeText(42 * 60_000), '42м')
  })
  it('shows hours at 60m+', () => {
    assert.equal(formatBadgeText(60 * 60_000), '1ч')
    assert.equal(formatBadgeText(125 * 60_000), '2ч')
  })
})

describe('formatBadgeTitle', () => {
  it('formats with place', () => {
    assert.equal(
      formatBadgeTitle({ prayerNameRu: 'Зухр', msUntil: 42 * 60_000, placeLabel: 'Москва' }),
      'Зухр через 42 мин · Москва'
    )
  })
  it('omits place when empty', () => {
    assert.equal(
      formatBadgeTitle({ prayerNameRu: 'Фаджр', msUntil: 5 * 60_000, placeLabel: '' }),
      'Фаджр через 5 мин'
    )
  })
})
```

- [ ] **Step 2: Запустить тест — ожидаем FAIL**

```bash
cd c:\Users\Admin\projects\mikat
node --test tests/badge.test.js
```

Expected: FAIL (module not found / export missing)

- [ ] **Step 3: Реализация**

```js
// lib/badge.js
export function formatBadgeText(msUntil) {
  const ms = Math.max(0, Number(msUntil) || 0)
  if (ms <= 60_000) return '·'
  const minutes = Math.ceil(ms / 60_000)
  if (minutes < 60) return `${minutes}м`
  return `${Math.floor(minutes / 60)}ч`
}

export function formatBadgeTitle({ prayerNameRu, msUntil, placeLabel }) {
  const minutes = Math.max(0, Math.ceil((Number(msUntil) || 0) / 60_000))
  const base = `${prayerNameRu} через ${minutes} мин`
  const place = (placeLabel || '').trim()
  return place ? `${base} · ${place}` : base
}
```

- [ ] **Step 4: Запустить тест — PASS**

```bash
node --test tests/badge.test.js
```

Expected: all pass

- [ ] **Step 5: Commit** — только по просьбе пользователя

---

### Task 3: Vendor `adhan` + `lib/methods.js` + `lib/prayer.js`

**Files:**
- Create: `vendor/adhan.js` (скопировать ESM-сборку из `node_modules/adhan/lib/esm/index.js` или официальный bundle после `npm i -D adhan`)
- Create: `lib/methods.js`, `lib/prayer.js`
- Test: `tests/prayer.test.js`

**Interfaces:**
- Consumes: adhan CalculationMethod / Madhab / Coordinates / PrayerTimes / CalculationParameters
- Produces (`lib/methods.js`):
  - `METHOD_IDS = ['MWL','Egyptian','UmmAlQura','Karachi','NorthAmerica','MuslimWorldLeague']` — использовать id: `MWL`, `Egyptian`, `UmmAlQura`, `Karachi`, `ISNA`
  - `DEFAULT_METHOD_ID = 'MWL'`
  - `METHOD_OPTIONS: { id, labelRu }[]`
  - `buildParams(methodId: string, asrMadhab: 'shafi'|'hanafi'): CalculationParameters`
- Produces (`lib/prayer.js`):
  - `PRAYER_ORDER = ['fajr','sunrise','dhuhr','asr','maghrib','isha']`
  - `PRAYER_LABELS_RU = { fajr:'Фаджр', sunrise:'Восход', dhuhr:'Зухр', asr:'Аср', maghrib:'Магриб', isha:'Иша' }`
  - `computeDayTimes({ date: Date, latitude: number, longitude: number, methodId: string, asrMadhab: 'shafi'|'hanafi' }): { dateKey: string, times: Record<id,{iso:string,ms:number}>, list: {id,labelRu,iso,ms}[] }`
  - `getNextPrayer({ now: Date, latitude, longitude, methodId, asrMadhab }): { id, labelRu, at: Date, msUntil: number }` — ищет в сегодняшнем списке (без sunrise как «намаз» для next? **next = только 5 намазов**, sunrise в списке UI, но next/badge/notifications — fajr/dhuhr/asr/maghrib/isha). Если все прошли — первый намаз завтра.

- [ ] **Step 1: Установить adhan и скопировать vendor**

```bash
cd c:\Users\Admin\projects\mikat
npm install
# скопировать ESM entry в vendor/adhan.js так, чтобы import из lib работал в расширении без node_modules
```

Предпочтительно: один файл `vendor/adhan.esm.js` + re-export. Если пакет multi-file — копировать всю папку `vendor/adhan/` и импортировать entry.

- [ ] **Step 2: Failing tests для prayer**

```js
// tests/prayer.test.js
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
```

- [ ] **Step 3: Run — FAIL**

```bash
node --test tests/prayer.test.js
```

- [ ] **Step 4: Implement `lib/methods.js` and `lib/prayer.js`**

```js
// lib/methods.js
import {
  CalculationMethod,
  Madhab,
} from '../vendor/adhan.js' // путь поправить под фактический vendor

export const DEFAULT_METHOD_ID = 'MWL'

export const METHOD_OPTIONS = [
  { id: 'MWL', labelRu: 'Muslim World League' },
  { id: 'Egyptian', labelRu: 'Egyptian General Authority' },
  { id: 'UmmAlQura', labelRu: 'Umm al-Qura' },
  { id: 'Karachi', labelRu: 'University of Islamic Sciences, Karachi' },
  { id: 'ISNA', labelRu: 'ISNA (North America)' },
]

export function buildParams(methodId, asrMadhab) {
  const factories = {
    MWL: () => CalculationMethod.MuslimWorldLeague(),
    Egyptian: () => CalculationMethod.Egyptian(),
    UmmAlQura: () => CalculationMethod.UmmAlQura(),
    Karachi: () => CalculationMethod.Karachi(),
    ISNA: () => CalculationMethod.NorthAmerica(),
  }
  const params = (factories[methodId] || factories.MWL)()
  params.madhab = asrMadhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi
  return params
}
```

```js
// lib/prayer.js
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
  const base = {
    latitude,
    longitude,
    methodId,
    asrMadhab,
  }
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
```

Подправить imports под реальный export surface `adhan` v4.

- [ ] **Step 5: Run tests — PASS**

```bash
node --test tests/prayer.test.js tests/badge.test.js
```

---

### Task 4: `lib/storage.js`

**Files:**
- Create: `lib/storage.js`
- Test: `tests/storage.test.js` (с in-memory mock `chrome.storage`)

**Interfaces:**
- Consumes: `chrome.storage.sync`, `chrome.storage.local` (в тестах — mock)
- Produces:
  - `DEFAULT_SETTINGS = { theme:'dark', methodId:'MWL', asrMadhab:'shafi', notificationsEnabled:true, notifyBeforeMinutes:10, coords:null, placeLabel:'' }`
  - `getSettings(): Promise<Settings>`
  - `setSettings(partial): Promise<Settings>`
  - `getDayCache(): Promise<null | DayCache>`
  - `setDayCache(cache): Promise<void>`
  - DayCache: `{ dateKey, times, list, next, updatedAt }`

- [ ] **Step 1: Failing test с mock**

```js
// tests/storage.test.js
import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

const syncStore = {}
const localStore = {}
globalThis.chrome = {
  storage: {
    sync: {
      get: async (defaults) => ({ ...defaults, ...syncStore }),
      set: async (obj) => Object.assign(syncStore, obj),
    },
    local: {
      get: async (keys) => {
        if (typeof keys === 'string') return { [keys]: localStore[keys] }
        const out = {}
        for (const k of Object.keys(keys)) out[k] = localStore[k] ?? keys[k]
        return out
      },
      set: async (obj) => Object.assign(localStore, obj),
    },
  },
}

const { getSettings, setSettings, DEFAULT_SETTINGS } = await import('../lib/storage.js')

describe('storage settings', () => {
  beforeEach(() => {
    for (const k of Object.keys(syncStore)) delete syncStore[k]
  })
  it('returns defaults', async () => {
    const s = await getSettings()
    assert.equal(s.methodId, DEFAULT_SETTINGS.methodId)
    assert.equal(s.notificationsEnabled, true)
  })
  it('merges partial updates', async () => {
    await setSettings({ notificationsEnabled: false, notifyBeforeMinutes: 15 })
    const s = await getSettings()
    assert.equal(s.notificationsEnabled, false)
    assert.equal(s.notifyBeforeMinutes, 15)
    assert.equal(s.methodId, 'MWL')
  })
})
```

- [ ] **Step 2: Implement `lib/storage.js`**

```js
export const DEFAULT_SETTINGS = {
  theme: 'dark',
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
```

- [ ] **Step 3: PASS tests**

```bash
node --test tests/storage.test.js
```

---

### Task 5: `lib/geo.js`

**Files:**
- Create: `lib/geo.js`

**Interfaces:**
- Consumes: `navigator.geolocation`, `fetch` → Nominatim
- Produces:
  - `getCurrentCoords(): Promise<{latitude,longitude}>` — reject с кодом `GEO_DENIED` / `GEO_UNAVAILABLE`
  - `searchCities(query: string): Promise<{label,latitude,longitude}[]>` — max 5
  - `USER_AGENT = 'MikatPrayerExtension/1.0 (local; contact: local)'`

- [ ] **Step 1: Реализация**

```js
// lib/geo.js
export const USER_AGENT = 'MikatPrayerExtension/1.0 (local)'

export function getCurrentCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(Object.assign(new Error('unavailable'), { code: 'GEO_UNAVAILABLE' }))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) =>
        reject(
          Object.assign(new Error(err.message), {
            code: err.code === 1 ? 'GEO_DENIED' : 'GEO_UNAVAILABLE',
          })
        ),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  })
}

export async function searchCities(query) {
  const q = query.trim()
  if (!q) return []
  const url =
    'https://nominatim.openstreetmap.org/search?' +
    new URLSearchParams({ q, format: 'json', limit: '5', 'accept-language': 'ru' })
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
  })
  if (!res.ok) throw new Error('SEARCH_FAILED')
  const data = await res.json()
  return data.map((row) => ({
    label: row.display_name,
    latitude: Number(row.lat),
    longitude: Number(row.lon),
  }))
}
```

Примечание: в service worker / extension pages `User-Agent` может игнорироваться браузером — всё равно передавать; host_permissions уже в manifest.

- [ ] **Step 2: Ручная smoke-проверка позже из popup (сеть)**

Нет обязательного unit-теста на сеть.

---

### Task 6: `background.js` — badge, alarms, notifications

**Files:**
- Create: `background.js`
- Create: `popup/popup.html` stub (чтобы manifest не бился) — или пустой html до Task 7

**Interfaces:**
- Consumes: storage, prayer, badge
- Produces:
  - `refreshAll()` — пересчёт, `setBadge`, `setTitle`, schedule alarms
  - Alarm names: `mikat-tick` (каждую 1 мин), `mikat-salah:{id}`, `mikat-pre:{id}`
  - Message types from popup: `{ type: 'SETTINGS_CHANGED' }` | `{ type: 'REFRESH' }` → `refreshAll`

- [ ] **Step 1: Реализовать background**

```js
// background.js
import { formatBadgeText, formatBadgeTitle } from './lib/badge.js'
import { computeDayTimes, getNextPrayer, PRAYER_LABELS_RU, SALAH_IDS } from './lib/prayer.js'
import { getSettings, setDayCache } from './lib/storage.js'

async function clearMikatAlarms() {
  const all = await chrome.alarms.getAll()
  await Promise.all(
    all.filter((a) => a.name.startsWith('mikat-')).map((a) => chrome.alarms.clear(a.name))
  )
}

async function applyBadge(next, placeLabel) {
  const text = formatBadgeText(next.msUntil)
  const title = formatBadgeTitle({
    prayerNameRu: next.labelRu,
    msUntil: next.msUntil,
    placeLabel,
  })
  await chrome.action.setBadgeText({ text })
  await chrome.action.setBadgeBackgroundColor({ color: '#6d28d9' })
  await chrome.action.setTitle({ title })
}

async function scheduleNotifications(settings, nextList) {
  if (!settings.notificationsEnabled) return
  const before = Number(settings.notifyBeforeMinutes) || 0
  for (const item of nextList) {
    const when = item.ms
    if (when > Date.now()) {
      chrome.alarms.create(`mikat-salah:${item.id}`, { when })
      if (before > 0 && when - before * 60_000 > Date.now()) {
        chrome.alarms.create(`mikat-pre:${item.id}`, { when: when - before * 60_000 })
      }
    }
  }
}

export async function refreshAll() {
  const settings = await getSettings()
  if (!settings.coords) {
    await chrome.action.setBadgeText({ text: '' })
    await chrome.action.setTitle({ title: 'Микат — укажите локацию' })
    await clearMikatAlarms()
    chrome.alarms.create('mikat-tick', { periodInMinutes: 1 })
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
    next: { id: next.id, labelRu: next.labelRu, iso: next.at.toISOString(), msUntil: next.msUntil },
    updatedAt: Date.now(),
  })
  await applyBadge(next, settings.placeLabel)
  await clearMikatAlarms()
  chrome.alarms.create('mikat-tick', { periodInMinutes: 1 })
  const upcoming = SALAH_IDS.map((id) => ({ id, ms: day.times[id].ms })).filter((x) => x.ms > Date.now())
  // если сегодня все прошли — alarm на завтрашний фаджр уже покрыт next; добавим tomorrow fajr
  if (upcoming.length === 0) {
    upcoming.push({ id: 'fajr', ms: next.at.getTime() })
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
  if (!settings.notificationsEnabled) return
  if (alarm.name.startsWith('mikat-pre:')) {
    const id = alarm.name.split(':')[1]
    chrome.notifications.create(`pre-${id}-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Микат',
      message: `Скоро ${PRAYER_LABELS_RU[id]} (через ${settings.notifyBeforeMinutes} мин)`,
    })
  }
  if (alarm.name.startsWith('mikat-salah:')) {
    const id = alarm.name.split(':')[1]
    chrome.notifications.create(`salah-${id}-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Микат',
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
```

- [ ] **Step 2: Временный `popup/popup.html`**

```html
<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>Микат</title></head>
<body><p>Микат</p></body></html>
```

- [ ] **Step 3: Загрузить unpacked в Chrome — badge пустой без локации; после Task 7 проверить countdown**

---

### Task 7: Popup UI (стиль соседей + фиолетовый accent)

**Files:**
- Create/overwrite: `popup/popup.html`, `popup/popup.css`, `popup/popup.js`

**Interfaces:**
- Consumes: storage, geo, prayer, METHOD_OPTIONS, messages to SW
- Produces: полный UI по спеке

- [ ] **Step 1: HTML структура**

Секции: header (Микат + theme toggle), next block, list `#prayer-list`, location (label, btn geo, search input + results), settings (method select, asr select, notifications checkbox, before select), `#status` для ошибок.

- [ ] **Step 2: CSS**

Переменные:

```css
:root {
  --font: 'IBM Plex Sans', 'Segoe UI', sans-serif;
  --font-display: 'Literata', Georgia, serif;
  --bg: #f6f4fb;
  --wash: #e8e0f7;
  --surface: #ffffff;
  --ink: #17141f;
  --muted: #5c5668;
  --line: #ddd6e8;
  --accent: #6d28d9;
  --on-accent: #f5f0ff;
}
:root[data-theme='dark'] {
  --bg: #121018;
  --wash: #221a33;
  --surface: #1a1624;
  --ink: #eeeaf6;
  --muted: #a39bb0;
  --line: #2e283c;
  --accent: #a78bfa;
  --on-accent: #120a1f;
}
```

Размер: `html, body { width: 360px; min-height: 520px; }`, radial wash background, display brand, list rows без тяжёлых card-shadow stacks. Подключить Google Fonts Literata + IBM Plex Sans (или system fallbacks если offline).

- [ ] **Step 3: `popup.js` поведение**

1. `boot()`: `getSettings` + `getDayCache` → render сразу
2. Если нет coords — показать онбординг (кнопка гео + поиск)
3. Geo click → `getCurrentCoords` → reverse label опционально через Nominatim reverse или временно `«Широта, долгота»` / search; `setSettings` → message SW
4. Search debounce 400ms → `searchCities` → клик по результату сохраняет coords+label
5. Settings change → `setSettings` → `chrome.runtime.sendMessage({type:'SETTINGS_CHANGED'})`
6. Theme toggle → `document.documentElement.dataset.theme` + persist
7. Ошибки GEO_DENIED / SEARCH_FAILED → текст в `#status`, UI не блокировать
8. Формат времени списка: `HH:MM` локально (`toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})`)
9. Countdown next: обновлять раз в 1s locally (`setInterval`) на основе `next.at`

- [ ] **Step 4: Ручная проверка**

- Light/dark
- Список 6 времён, next подсвечен
- Badge обновляется после выбора города
- Уведомления off → alarms salah/pre не создаются (проверить `chrome.alarms.getAll` в SW console)

---

### Task 8: Иконки финальные + полировка README

**Files:**
- Update: `icons/*` — простой знак (полумесяц/часы) на фиолетовом фоне, читаемый в 16px
- Update: `README.md` — permissions, как выключить уведомления, метод MWL

- [ ] **Step 1: Заменить placeholder icons**
- [ ] **Step 2: Пройти критерии готовности из спеки**

Checklist:

1. Папка `mikat`, имя Микат
2. Popup времена для локации/метода
3. Badge countdown
4. Уведомления on/off
5. Тема + фиолетовый accent
6. Geo deny → поиск города

- [ ] **Step 3: `npm test` — все зелёные**

```bash
npm test
```

Expected: all pass

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Rename to mikat / name Микат | 1 |
| MV3 Chrome/Edge | 1, 6 |
| Local adhan calc | 3 |
| Method select, default MWL | 3, 4, 7 |
| Geo + city search | 5, 7 |
| Purple theme like neighbors | 7 |
| Badge countdown | 2, 6 |
| Notifications toggleable | 4, 6, 7 |
| Error behaviors | 5, 7 |
| Unit tests badge/prayer | 2, 3 |
| Out of scope ignored | — |

Нет открытых TBD в шагах. Сигнатуры `methodId` / `asrMadhab` / message types согласованы между Task 3–7.
