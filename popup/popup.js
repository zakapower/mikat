import { getSettings, setSettings, getDayCache } from '../lib/storage.js'
import { getCurrentCoords, searchCities, reversePlaceLabel } from '../lib/geo.js'
import { computeDayTimes, getNextPrayer } from '../lib/prayer.js'
import { METHOD_OPTIONS } from '../lib/methods.js'
import { formatBadgeTitle } from '../lib/badge.js'
import { iconHtml } from './lucide-icons.js'
import { t, prayerLabel, GITHUB_URL } from './i18n.js'

const $ = (id) => document.getElementById(id)

const els = {
  app: $('app'),
  viewMain: $('view-main'),
  viewSettings: $('view-settings'),
  githubLink: $('github-link'),
  langToggle: $('lang-toggle'),
  themeToggle: $('theme-toggle'),
  openSettings: $('open-settings'),
  backMain: $('back-main'),
  brand: document.querySelector('.brand'),
  nextBlock: $('next-block'),
  nextLabel: $('next-label'),
  nextName: $('next-name'),
  nextTime: $('next-time'),
  nextCountdownIcon: $('next-countdown-icon'),
  nextCountdownText: $('next-countdown-text'),
  onboarding: $('onboarding'),
  onboardingLead: $('onboarding-lead'),
  locatingSkelNext: $('locating-skel-next'),
  locatingSkelList: $('locating-skel-list'),
  prayerList: $('prayer-list'),
  placeIcon: $('place-icon'),
  placeLabel: $('place-label'),
  settingsTitle: $('settings-title'),
  settingsPlaceLabel: $('settings-place-label'),
  geoBtnMain: $('geo-btn-main'),
  geoBtn: $('geo-btn'),
  geoBtnIcon: $('geo-btn-icon'),
  geoBtnText: $('geo-btn-text'),
  locBlockIcon: $('loc-block-icon'),
  locBlockTitle: $('loc-block-title'),
  searchIcon: $('search-icon'),
  searchCityLabel: $('search-city-label'),
  citySearch: $('city-search'),
  searchResults: $('search-results'),
  calcTitle: $('calc-title'),
  methodLabel: $('method-label'),
  methodTrigger: $('method-trigger'),
  methodValue: $('method-value'),
  methodList: $('method-list'),
  asrLabel: $('asr-label'),
  asrTrigger: $('asr-trigger'),
  asrValue: $('asr-value'),
  asrList: $('asr-list'),
  bellIcon: $('bell-icon'),
  notifyBlockTitle: $('notify-block-title'),
  notifications: $('notifications'),
  notifyEnableLabel: $('notify-enable-label'),
  remindLabel: $('remind-label'),
  notifyBeforeTrigger: $('notify-before-trigger'),
  notifyBeforeValue: $('notify-before-value'),
  notifyBeforeList: $('notify-before-list'),
  status: $('status'),
}

function lang() {
  return settings?.lang === 'en' ? 'en' : 'ru'
}

function asrOptions() {
  return [
    { id: 'shafi', label: t(lang(), 'asrShafi') },
    { id: 'hanafi', label: t(lang(), 'asrHanafi') },
  ]
}

function notifyOptions() {
  return [
    { id: '5', label: t(lang(), 'min5') },
    { id: '10', label: t(lang(), 'min10') },
    { id: '15', label: t(lang(), 'min15') },
  ]
}

function methodOptions() {
  return METHOD_OPTIONS.map((o) => ({ id: o.id, label: o.labelRu }))
}

let settings = null
let nextAt = null
let nextPrayerId = null
let countdownTimer = null
let searchTimer = null
let openMenuEl = null
let lastDay = null
let lastNextId = null
let locating = false
let uiReady = false
let enteringView = null

function setStatus(text, isError = false) {
  els.status.textContent = text || ''
  els.status.classList.toggle('is-error', Boolean(isError && text))
}

function clearEntering(view) {
  if (!view) return
  view.classList.remove('is-entering')
  view.removeEventListener('animationend', onEnteringEnd)
  if (enteringView === view) enteringView = null
}

function onEnteringEnd(e) {
  if (e.target !== enteringView || e.animationName !== 'in') return
  clearEntering(enteringView)
}

function setView(view, { animate = uiReady } = {}) {
  const isSettings = view === 'settings'
  const show = isSettings ? els.viewSettings : els.viewMain
  const hide = isSettings ? els.viewMain : els.viewSettings

  els.app.dataset.view = isSettings ? 'settings' : 'main'
  if (!show.hidden && hide.hidden) return

  hide.hidden = true
  clearEntering(hide)

  show.hidden = false
  clearEntering(show)
  if (!animate) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  void show.offsetWidth
  show.classList.add('is-entering')
  enteringView = show
  show.addEventListener('animationend', onEnteringEnd)
}

function setGeoLoading(loading) {
  els.geoBtn.classList.toggle('is-loading', loading)
  els.geoBtnMain.classList.toggle('is-loading', loading)
  els.geoBtn.disabled = loading
  els.geoBtnMain.disabled = loading
}

/** Ghost skeleton while first-run geolocation (neighbor-style). */
function setLocatingSkeleton(active) {
  locating = active
  els.viewMain.setAttribute('aria-busy', active ? 'true' : 'false')
  els.locatingSkelNext.hidden = !active
  els.locatingSkelList.hidden = !active
  els.locatingSkelNext.setAttribute('aria-hidden', active ? 'false' : 'true')
  els.locatingSkelList.setAttribute('aria-hidden', active ? 'false' : 'true')

  if (!active) return

  els.onboarding.hidden = true
  els.onboardingLead.hidden = true
  els.onboardingLead.textContent = t(lang(), 'locating')
  els.nextBlock.hidden = true
  els.prayerList.hidden = true
  setStatus('')
}

function showNeedLocation() {
  setLocatingSkeleton(false)
  els.onboarding.hidden = false
  els.onboardingLead.hidden = false
  els.onboardingLead.textContent = t(lang(), 'needLocation')
  els.nextBlock.hidden = true
  els.prayerList.hidden = true
}

function applyTheme(theme) {
  const isLight = theme === 'light'
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark'
  const moon = els.themeToggle.querySelector('[data-icon="moon"]')
  const sun = els.themeToggle.querySelector('[data-icon="sun"]')
  moon?.classList.toggle('is-active', isLight)
  sun?.classList.toggle('is-active', !isLight)
  els.themeToggle.setAttribute(
    'aria-label',
    isLight ? t(lang(), 'themeToDark') : t(lang(), 'themeToLight'),
  )
}

function applyLang() {
  const L = lang()
  document.documentElement.lang = L
  els.brand.textContent = t(L, 'brand')
  els.githubLink.setAttribute('aria-label', t(L, 'github'))
  els.githubLink.href = GITHUB_URL
  const enFace = els.langToggle.querySelector('[data-lang-face="en"]')
  const ruFace = els.langToggle.querySelector('[data-lang-face="ru"]')
  enFace?.classList.toggle('is-active', L === 'ru')
  ruFace?.classList.toggle('is-active', L === 'en')
  els.langToggle.setAttribute(
    'aria-label',
    L === 'ru' ? t(L, 'switchToEn') : t(L, 'switchToRu'),
  )
  els.openSettings.setAttribute('aria-label', t(L, 'settings'))
  els.backMain.setAttribute('aria-label', t(L, 'back'))
  els.settingsTitle.textContent = t(L, 'settings')
  els.nextLabel.textContent = t(L, 'nextPrayer')
  els.locBlockTitle.textContent = t(L, 'location')
  els.geoBtnText.textContent = t(L, 'myLocation')
  els.geoBtnMain.setAttribute('aria-label', t(L, 'refreshLocation'))
  els.searchCityLabel.textContent = t(L, 'searchCityLabel')
  els.citySearch.placeholder = t(L, 'searchCity')
  els.calcTitle.textContent = t(L, 'calculation')
  els.methodLabel.textContent = t(L, 'method')
  els.asrLabel.textContent = t(L, 'asrMadhab')
  els.notifyBlockTitle.textContent = t(L, 'notifications')
  els.notifyEnableLabel.textContent = t(L, 'enable')
  els.remindLabel.textContent = t(L, 'remindBefore')
  applyTheme(settings.theme)
  if (locating) {
    els.onboardingLead.hidden = true
    els.onboardingLead.textContent = t(L, 'locating')
  } else if (!settings.coords) {
    els.onboardingLead.hidden = false
    els.onboardingLead.textContent = t(L, 'needLocation')
  }
  if (!settings.coords) {
    setPlaceLabels(t(L, 'locationUnset'))
  }
  syncForm()
  if (lastDay) renderList(lastDay, lastNextId)
  if (nextAt && nextPrayerId) {
    els.nextName.textContent = prayerLabel(L, nextPrayerId)
    tickCountdown()
  }
}

function mountThemeToggle() {
  els.themeToggle.innerHTML = `
    <span class="icon-swap" aria-hidden="true">
      ${iconHtml('moon', 'icon icon--swap')}
      ${iconHtml('sun', 'icon icon--swap')}
    </span>
  `
}

function mountStaticIcons() {
  mountThemeToggle()
  els.githubLink.innerHTML = iconHtml('github')
  els.openSettings.innerHTML = iconHtml('settings')
  els.backMain.innerHTML = iconHtml('x')
  els.nextCountdownIcon.innerHTML = iconHtml('clock')
  els.placeIcon.innerHTML = iconHtml('mapPin')
  els.geoBtnMain.innerHTML = iconHtml('locate')
  els.geoBtnIcon.innerHTML = iconHtml('locate')
  els.locBlockIcon.innerHTML = iconHtml('mapPin')
  els.searchIcon.innerHTML = iconHtml('search')
  els.bellIcon.innerHTML = iconHtml('bell')
}

function formatClock(ms) {
  return new Date(ms).toLocaleTimeString(lang() === 'en' ? 'en-GB' : 'ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCountdown(msUntil) {
  const L = lang()
  const ms = Math.max(0, msUntil)
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) {
    return `${h} ${t(L, 'h')} ${String(m).padStart(2, '0')} ${t(L, 'min')}`
  }
  return `${m} ${t(L, 'min')} ${String(s).padStart(2, '0')} ${t(L, 's')}`
}

function closeMenus() {
  document.querySelectorAll('.menu.is-open').forEach((menu) => {
    menu.classList.remove('is-open')
    const list = menu.querySelector('.menu__list')
    const trigger = menu.querySelector('.menu__trigger')
    if (list) list.hidden = true
    if (trigger) trigger.setAttribute('aria-expanded', 'false')
  })
  openMenuEl = null
}

function openMenu(menu) {
  if (!menu || openMenuEl === menu) {
    closeMenus()
    return
  }
  closeMenus()
  menu.classList.add('is-open')
  const list = menu.querySelector('.menu__list')
  const trigger = menu.querySelector('.menu__trigger')
  if (list) list.hidden = false
  if (trigger) trigger.setAttribute('aria-expanded', 'true')
  openMenuEl = menu
}

function renderMenuOptions(listEl, options, selectedId) {
  listEl.innerHTML = options
    .map(
      (o) => `
    <li>
      <button
        type="button"
        class="menu__option${o.id === selectedId ? ' is-selected' : ''}"
        role="option"
        data-value="${o.id}"
        aria-selected="${o.id === selectedId}"
      >${o.label}</button>
    </li>`,
    )
    .join('')
}

function labelFor(options, id) {
  return options.find((o) => String(o.id) === String(id))?.label || String(id)
}

function mountMenus() {
  renderMenuOptions(els.methodList, methodOptions(), settings?.methodId || 'MWL')
  renderMenuOptions(els.asrList, asrOptions(), settings?.asrMadhab || 'shafi')
  renderMenuOptions(
    els.notifyBeforeList,
    notifyOptions(),
    String(settings?.notifyBeforeMinutes || 10),
  )
  document.querySelectorAll('.menu__chevron').forEach((el) => {
    el.innerHTML = iconHtml('chevronDown', 'icon')
  })
}

function prayerRowHtml(item, nextId, L) {
  return `
      <li class="${item.id === nextId ? 'is-next' : ''}">
        <strong>${prayerLabel(L, item.id)}</strong>
        <span>${formatClock(item.ms)}</span>
      </li>`
}

function patchPrayerRow(li, item, nextId, L) {
  li.classList.toggle('is-next', item.id === nextId)
  const nameEl = li.children[0]
  const timeEl = li.children[1]
  if (nameEl) nameEl.textContent = prayerLabel(L, item.id)
  if (timeEl) timeEl.textContent = formatClock(item.ms)
}

function renderList(day, nextId) {
  lastDay = day
  lastNextId = nextId
  const L = lang()
  els.locatingSkelNext.hidden = true
  els.locatingSkelList.hidden = true
  const items = day.list
  const ul = els.prayerList
  if (ul.children.length === items.length) {
    for (let i = 0; i < items.length; i++) {
      patchPrayerRow(ul.children[i], items[i], nextId, L)
    }
  } else {
    ul.innerHTML = items.map((item) => prayerRowHtml(item, nextId, L)).join('')
  }
  ul.hidden = false
}

function renderNext(next) {
  nextAt = next.at.getTime()
  nextPrayerId = next.id
  els.nextBlock.hidden = false
  els.onboarding.hidden = true
  els.locatingSkelNext.hidden = true
  els.locatingSkelList.hidden = true
  els.nextName.textContent = prayerLabel(lang(), next.id)
  els.nextTime.textContent = formatClock(nextAt)
  tickCountdown()
}

function tickCountdown() {
  if (!nextAt) return
  const msUntil = nextAt - Date.now()
  const L = lang()
  els.nextCountdownText.textContent =
    msUntil <= 0 ? t(L, 'now') : `${t(L, 'through')} ${formatCountdown(msUntil)}`
}

function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(tickCountdown, 1000)
}

function shortPlace(label) {
  if (!label) return ''
  return label.split(',').slice(0, 2).join(',').trim()
}

function setPlaceLabels(text) {
  els.placeLabel.textContent = text
  els.settingsPlaceLabel.textContent = text
}

async function notifySw() {
  try {
    await chrome.runtime.sendMessage({ type: 'SETTINGS_CHANGED' })
  } catch {
    /* SW may be waking */
  }
}

function recomputeLocal() {
  if (!settings?.coords) {
    els.nextBlock.hidden = true
    els.prayerList.hidden = true
    if (!locating) showNeedLocation()
    setPlaceLabels(t(lang(), 'locationUnset'))
    return null
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
  const placeText = settings.placeLabel
    ? shortPlace(settings.placeLabel)
    : `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
  setPlaceLabels(placeText)
  renderList(day, next.id)
  renderNext(next)
  document.title = formatBadgeTitle({
    prayerNameRu: prayerLabel(lang(), next.id),
    msUntil: next.msUntil,
    placeLabel: shortPlace(settings.placeLabel),
  })
  return { day, next }
}

async function persist(partial) {
  settings = await setSettings(partial)
  applyLang()
  recomputeLocal()
  await notifySw()
}

function syncForm() {
  const methodId = settings.methodId
  const asrId = settings.asrMadhab
  const notifyId = String(settings.notifyBeforeMinutes)
  const methods = methodOptions()
  const asrs = asrOptions()
  const notifies = notifyOptions()

  els.methodValue.textContent = labelFor(methods, methodId)
  els.asrValue.textContent = labelFor(asrs, asrId)
  els.notifyBeforeValue.textContent = labelFor(notifies, notifyId)

  renderMenuOptions(els.methodList, methods, methodId)
  renderMenuOptions(els.asrList, asrs, asrId)
  renderMenuOptions(els.notifyBeforeList, notifies, notifyId)

  els.notifications.checked = settings.notificationsEnabled
  els.notifyBeforeTrigger.disabled = !settings.notificationsEnabled
  els.notifyBeforeTrigger.closest('.menu')?.classList.toggle(
    'is-disabled',
    !settings.notificationsEnabled,
  )
}

async function useCoords(coords, placeLabel) {
  setStatus(t(lang(), 'savingLocation'))
  await persist({ coords, placeLabel: placeLabel || '' })
  setStatus('')
  setView('main')
}

async function requestGeo() {
  setGeoLoading(true)
  const firstRun = !settings?.coords
  if (firstRun) {
    setLocatingSkeleton(true)
  } else {
    locating = true
    setStatus('')
  }
  try {
    const coords = await getCurrentCoords()
    let label = ''
    try {
      label = await reversePlaceLabel(coords.latitude, coords.longitude, lang())
    } catch {
      /* reverse optional */
    }
    locating = false
    els.locatingSkelNext.hidden = true
    els.locatingSkelList.hidden = true
    els.viewMain.setAttribute('aria-busy', 'false')
    els.onboarding.hidden = true
    await useCoords(coords, label)
    return true
  } catch (err) {
    locating = false
    const msg =
      err.code === 'GEO_DENIED' ? t(lang(), 'geoDenied') : t(lang(), 'geoFailed')
    setStatus(msg, true)
    if (firstRun) {
      showNeedLocation()
    } else {
      els.locatingSkelNext.hidden = true
      els.locatingSkelList.hidden = true
      els.viewMain.setAttribute('aria-busy', 'false')
    }
    return false
  } finally {
    setGeoLoading(false)
  }
}

els.themeToggle.addEventListener('click', async () => {
  const theme = settings.theme === 'light' ? 'dark' : 'light'
  await persist({ theme })
})

els.langToggle.addEventListener('click', async () => {
  const nextLang = lang() === 'ru' ? 'en' : 'ru'
  await persist({ lang: nextLang })
  if (!settings?.coords) return
  try {
    const label = await reversePlaceLabel(
      settings.coords.latitude,
      settings.coords.longitude,
      nextLang,
    )
    if (label) await persist({ placeLabel: label })
  } catch {
    /* keep previous label */
  }
})

els.openSettings.addEventListener('click', () => {
  closeMenus()
  setView('settings')
})
els.backMain.addEventListener('click', () => {
  closeMenus()
  setView('main')
})

els.geoBtnMain.addEventListener('click', () => {
  requestGeo()
})
els.geoBtn.addEventListener('click', () => {
  requestGeo()
})

els.citySearch.addEventListener('input', () => {
  clearTimeout(searchTimer)
  closeMenus()
  const q = els.citySearch.value
  searchTimer = setTimeout(async () => {
    if (!q.trim()) {
      els.searchResults.hidden = true
      els.searchResults.innerHTML = ''
      return
    }
    try {
      const hits = await searchCities(q, lang())
      if (!hits.length) {
        els.searchResults.hidden = true
        setStatus(t(lang(), 'nothingFound'), true)
        return
      }
      setStatus('')
      els.searchResults.innerHTML = hits
        .map(
          (h, i) => `
          <li><button type="button" data-i="${i}">${h.label}</button></li>`,
        )
        .join('')
      els.searchResults.hidden = false
      els.searchResults.dataset.hits = JSON.stringify(hits)
    } catch {
      setStatus(t(lang(), 'offlineSearch'), true)
      els.searchResults.hidden = true
    }
  }, 400)
})

els.searchResults.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-i]')
  if (!btn) return
  const hits = JSON.parse(els.searchResults.dataset.hits || '[]')
  const hit = hits[Number(btn.dataset.i)]
  if (!hit) return
  els.searchResults.hidden = true
  els.citySearch.value = ''
  await useCoords(
    { latitude: hit.latitude, longitude: hit.longitude },
    hit.label,
  )
})

document.querySelectorAll('.menu').forEach((menu) => {
  const trigger = menu.querySelector('.menu__trigger')
  const list = menu.querySelector('.menu__list')
  trigger?.addEventListener('click', (e) => {
    e.stopPropagation()
    if (menu.classList.contains('is-disabled')) return
    els.searchResults.hidden = true
    openMenu(menu)
  })
  list?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.menu__option')
    if (!btn) return
    const value = btn.dataset.value
    const kind = menu.dataset.menu
    closeMenus()
    if (kind === 'method') await persist({ methodId: value })
    if (kind === 'asr') await persist({ asrMadhab: value })
    if (kind === 'notify-before') await persist({ notifyBeforeMinutes: Number(value) })
  })
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu')) closeMenus()
})

els.notifications.addEventListener('change', async () => {
  await persist({ notificationsEnabled: els.notifications.checked })
})

async function boot() {
  mountStaticIcons()
  settings = await getSettings()
  mountMenus()
  applyLang()
  requestAnimationFrame(() => {
    els.themeToggle.classList.remove('icon-btn--theme-boot')
  })
  setView('main')

  const cache = await getDayCache()
  if (settings.coords && cache?.list?.length) {
    const placeText = settings.placeLabel
      ? shortPlace(settings.placeLabel)
      : t(lang(), 'savedLocation')
    setPlaceLabels(placeText)
    renderList(cache, cache.next?.id)
    if (cache.next?.iso) {
      renderNext({
        id: cache.next.id,
        labelRu: cache.next.labelRu,
        at: new Date(cache.next.iso),
        msUntil: new Date(cache.next.iso).getTime() - Date.now(),
      })
    }
  }

  if (settings.coords) {
    recomputeLocal()
  } else {
    setLocatingSkeleton(true)
  }
  startCountdown()

  if (!settings.coords) {
    const ok = await requestGeo()
    if (!ok) {
      showNeedLocation()
      setView('settings')
    }
  }

  uiReady = true
  await notifySw()
}

boot()
