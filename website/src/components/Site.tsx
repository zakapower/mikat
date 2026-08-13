'use client'

import { useEffect, useState } from 'react'
import { CHROME_STORE_URL, GITHUB_PROFILE, GITHUB_URL } from '@/lib/site'

type Lang = 'ru' | 'en'
type Theme = 'light' | 'dark'

const copy = {
  ru: {
    brand: 'Mikat',
    navFeatures: 'Возможности',
    navPrivacy: 'Конфиденциальность',
    headline: 'Времена намаза всегда под рукой',
    lead: 'Таймер на иконке, уведомления и расчёт по вашей локации — расширение для Chrome и Edge.',
    install: 'Установить в Chrome',
    soon: 'Скоро в Chrome Web Store',
    toPrivacy: 'Политика конфиденциальности',
    featuresTitle: 'Возможности',
    featuresLead: 'Локальный расчёт (adhan). Настройки хранятся в браузере — без своего сервера.',
    features: [
      ['Таймер', 'Countdown HH:MM до следующего намаза на иконке.'],
      ['Уведомления', 'Напоминание за 5, 10 или 15 минут — можно выключить.'],
      ['Локация', 'Геолокация или поиск города через OpenStreetMap.'],
      ['Расчёт', 'Методы (в т.ч. Muslim World League) и мазхаб для Аср.'],
      ['Языки', 'Интерфейс на русском и английском (RU / EN).'],
      ['Темы', 'Светлая и тёмная тема.'],
    ] as const,
    privacyTitle: 'Политика конфиденциальности',
    updated: 'Дата обновления: 13 августа 2026',
    themeToDark: 'Включить тёмную тему',
    themeToLight: 'Включить светлую тему',
  },
  en: {
    brand: 'Mikat',
    navFeatures: 'Features',
    navPrivacy: 'Privacy',
    headline: 'Prayer times always at hand',
    lead: 'Icon timer, notifications, and calculation for your location — a Chrome and Edge extension.',
    install: 'Install for Chrome',
    soon: 'Coming soon to Chrome Web Store',
    toPrivacy: 'Privacy Policy',
    featuresTitle: 'Features',
    featuresLead: 'Local calculation (adhan). Settings stay in your browser — no backend.',
    features: [
      ['Countdown', 'HH:MM timer to the next prayer on the toolbar icon.'],
      ['Notifications', 'Remind 5, 10, or 15 minutes ahead — can be disabled.'],
      ['Location', 'Geolocation or city search via OpenStreetMap.'],
      ['Calculation', 'Methods (incl. Muslim World League) and Asr madhab.'],
      ['Languages', 'Russian and English UI (RU / EN).'],
      ['Themes', 'Light and dark theme.'],
    ] as const,
    privacyTitle: 'Privacy Policy',
    updated: 'Last updated: August 13, 2026',
    themeToDark: 'Enable dark theme',
    themeToLight: 'Enable light theme',
  },
}

export function Site() {
  const [lang, setLang] = useState<Lang>('ru')
  const [theme, setTheme] = useState<Theme>('dark')
  const [themeReady, setThemeReady] = useState(false)
  const t = copy[lang]

  useEffect(() => {
    const savedTheme = localStorage.getItem('mikat-theme') as Theme | null
    const savedLang = localStorage.getItem('mikat-lang') as Lang | null
    const nextTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
    const nextLang = savedLang === 'en' || savedLang === 'ru' ? savedLang : 'ru'
    setTheme(nextTheme)
    setLang(nextLang)
    document.documentElement.dataset.theme = nextTheme
    document.documentElement.lang = nextLang
    requestAnimationFrame(() => setThemeReady(true))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('mikat-theme', theme)
    const icon = document.getElementById('site-favicon') as HTMLLinkElement | null
    if (icon) {
      icon.href =
        theme === 'dark' ? '/favicon-dark.svg?v=1' : '/favicon-light.svg?v=1'
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('mikat-lang', lang)
    document.title =
      lang === 'en' ? 'Mikat — prayer times in the browser' : 'Mikat — времена намаза в браузере'
  }, [lang])

  function toggleTheme() {
    setTheme((v) => (v === 'light' ? 'dark' : 'light'))
  }

  function toggleLang() {
    setLang((v) => (v === 'ru' ? 'en' : 'ru'))
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand" href="#top">
            <svg className="brand__mark" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
            </svg>
            <span className="brand__name">{t.brand}</span>
          </a>
          <nav className="site-nav" aria-label="Section">
            <a href="#features">{t.navFeatures}</a>
            <a href="#privacy">{t.navPrivacy}</a>
          </nav>
          <div className="site-controls">
            <a
              className="ctrl"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg className="ctrl__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <button
              type="button"
              className="ctrl"
              onClick={toggleLang}
              aria-label={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
            >
              <span className="ctrl__icon-swap" aria-hidden>
                <span className={`ctrl__label${lang === 'ru' ? ' is-active' : ''}`}>EN</span>
                <span className={`ctrl__label${lang === 'en' ? ' is-active' : ''}`}>RU</span>
              </span>
            </button>
            <button
              type="button"
              className={`ctrl${themeReady ? '' : ' ctrl--theme-boot'}`}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? t.themeToDark : t.themeToLight}
            >
              <span className="ctrl__icon-swap" aria-hidden>
                <span className={`ctrl__label${theme === 'light' ? ' is-active' : ''}`}>
                  <svg className="ctrl__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                </span>
                <span className={`ctrl__label${theme === 'dark' ? ' is-active' : ''}`}>
                  <svg className="ctrl__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero__bg" aria-hidden />
          <div className="hero__inner">
            <p className="hero__brand">{t.brand}</p>
            <h1>{t.headline}</h1>
            <p className="hero__lead">{t.lead}</p>
            <div className="hero__actions">
              {CHROME_STORE_URL ? (
                <a className="btn" href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer">
                  {t.install}
                </a>
              ) : (
                <span className="btn btn--soon">{t.soon}</span>
              )}
              <a className="btn btn--ghost" href="#privacy">
                {t.toPrivacy}
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <h2>{t.featuresTitle}</h2>
          <p className="section__lead">{t.featuresLead}</p>
          <ul className="feature-list">
            {t.features.map(([title, text]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="privacy">
          <h2>{t.privacyTitle}</h2>
          <p className="privacy-updated">{t.updated}</p>
          <div className="privacy-panel">
            {lang === 'ru' ? (
              <>
                <p>
                  Расширение браузера <strong>Mikat</strong> показывает времена намаза, таймер на
                  иконке и опциональные уведомления.
                </p>
                <h3>1. Разработчик</h3>
                <p>
                  <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                    zakapower
                  </a>
                  ·{' '}
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    github.com/zakapower/mikat
                  </a>
                </p>
                <h3>2. Какие данные используются</h3>
                <ul>
                  <li>
                    <strong>Местоположение</strong> — координаты и подпись места для расчёта намаза.
                  </li>
                  <li>
                    <strong>Настройки</strong> — тема, язык, метод, мазхаб Аср, уведомления.
                  </li>
                  <li>
                    <strong>Кэш дня</strong> — локальный список времён для попапа и badge.
                  </li>
                </ul>
                <p>Не собираем историю браузера, содержимое сайтов, email, аккаунты и платежи.</p>
                <h3>3. Где хранятся данные</h3>
                <p>
                  В <code>chrome.storage</code> вашего браузера. Отдельного бэкенда нет — данные не
                  отправляются на наши серверы.
                </p>
                <h3>4. Сеть</h3>
                <ul>
                  <li>OpenStreetMap Nominatim — поиск города / обратная геокодировка.</li>
                  <li>Расчёт намаза — локально (adhan).</li>
                </ul>
                <h3>5. Разрешения</h3>
                <p>
                  <code>geolocation</code>, <code>storage</code>, <code>alarms</code>,{' '}
                  <code>notifications</code>.
                </p>
                <h3>6. Продажа данных</h3>
                <p>Не продаём данные и не используем их для рекламы.</p>
                <h3>7. Удаление</h3>
                <p>Удалите расширение или очистите его данные в настройках браузера.</p>
                <h3>8. Контакты</h3>
                <p>
                  <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                    github.com/zakapower
                  </a>
                </p>
              </>
            ) : (
              <>
                <p>
                  The <strong>Mikat</strong> browser extension shows prayer times, an icon countdown,
                  and optional notifications.
                </p>
                <h3>1. Developer</h3>
                <p>
                  <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                    zakapower
                  </a>
                  ·{' '}
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    github.com/zakapower/mikat
                  </a>
                </p>
                <h3>2. Data we use</h3>
                <ul>
                  <li>
                    <strong>Location</strong> — coordinates and place label for prayer calculation.
                  </li>
                  <li>
                    <strong>Settings</strong> — theme, language, method, Asr madhab, notifications.
                  </li>
                  <li>
                    <strong>Day cache</strong> — local times for popup and badge.
                  </li>
                </ul>
                <p>
                  We do not collect browsing history, website content, email, accounts, or payments.
                </p>
                <h3>3. Storage</h3>
                <p>
                  Data stays in <code>chrome.storage</code>. No backend — nothing is sent to our
                  servers.
                </p>
                <h3>4. Network</h3>
                <ul>
                  <li>OpenStreetMap Nominatim for city search / reverse geocoding.</li>
                  <li>Prayer times calculated locally with adhan.</li>
                </ul>
                <h3>5. Permissions</h3>
                <p>
                  <code>geolocation</code>, <code>storage</code>, <code>alarms</code>,{' '}
                  <code>notifications</code>.
                </p>
                <h3>6. Sale of data</h3>
                <p>We do not sell user data or use it for ads.</p>
                <h3>7. Deletion</h3>
                <p>Remove the extension or clear its storage in browser settings.</p>
                <h3>8. Contact</h3>
                <p>
                  <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                    github.com/zakapower
                  </a>
                </p>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="site-footer__brand">{t.brand}</span>
        <span className="site-footer__dot">·</span>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  )
}
