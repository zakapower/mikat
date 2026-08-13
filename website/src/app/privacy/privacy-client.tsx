'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GITHUB_PROFILE, GITHUB_URL } from '@/lib/site'

export default function PrivacyPage() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru')
  const isEn = lang === 'en'

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-5 pb-16 pt-6 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icon.png" alt="" width={40} height={40} className="rounded-[0.65rem]" />
          <div>
            <p
              className="m-0 text-[1.35rem] font-bold tracking-[-0.04em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Микат
            </p>
            <p className="m-0 text-[0.88rem] text-[var(--muted)]">Privacy Policy</p>
          </div>
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            className={`h-9 min-w-10 rounded-md border px-3 text-[0.8rem] font-semibold ${
              !isEn
                ? 'border-[color-mix(in_srgb,var(--accent)_40%,var(--line))] text-[var(--ink)]'
                : 'border-[var(--line)] text-[var(--muted)]'
            } bg-[var(--surface)]`}
            onClick={() => setLang('ru')}
          >
            RU
          </button>
          <button
            type="button"
            className={`h-9 min-w-10 rounded-md border px-3 text-[0.8rem] font-semibold ${
              isEn
                ? 'border-[color-mix(in_srgb,var(--accent)_40%,var(--line))] text-[var(--ink)]'
                : 'border-[var(--line)] text-[var(--muted)]'
            } bg-[var(--surface)]`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </header>

      <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-6 sm:px-7">
        {!isEn ? (
          <div className="space-y-4 text-[0.98rem] leading-relaxed text-[color-mix(in_srgb,var(--ink)_92%,var(--muted))]">
            <h1
              className="m-0 text-[1.55rem] font-bold tracking-[-0.02em] text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Политика конфиденциальности
            </h1>
            <p className="m-0 text-[0.88rem] text-[var(--muted)]">Дата обновления: 13 августа 2026</p>
            <p>
              Расширение браузера <strong className="text-[var(--ink)]">Микат</strong> показывает
              времена намаза, таймер на иконке и опциональные уведомления. Эта страница описывает,
              какие данные используются и как они обрабатываются.
            </p>
            <h2 className="mt-6 text-[1.05rem] font-semibold text-[var(--ink)]">1. Разработчик</h2>
            <p>
              Разработчик:{' '}
              <a className="text-[var(--accent)]" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                zakapower
              </a>
              . Репозиторий:{' '}
              <a className="text-[var(--accent)]" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                github.com/zakapower/mikat
              </a>
              .
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">2. Какие данные используются</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[var(--ink)]">Местоположение</strong> — координаты и подпись
                места только для расчёта времён намаза.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Настройки</strong> — тема, язык, метод расчёта,
                мазхаб для Аср, уведомления.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Кэш дня</strong> — локальный список времён для
                попапа и badge.
              </li>
            </ul>
            <p>
              Расширение <strong className="text-[var(--ink)]">не собирает</strong> историю браузера,
              содержимое сайтов, email, аккаунты и платёжные данные.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">3. Где хранятся данные</h2>
            <p>
              В <code>chrome.storage.sync</code> / <code>local</code> вашего браузера. Отдельного
              бэкенда у Микат нет — данные{' '}
              <strong className="text-[var(--ink)]">не отправляются на наши серверы</strong>.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">4. Сетевые запросы</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>OpenStreetMap Nominatim — поиск города / обратная геокодировка.</li>
              <li>Расчёт намаза — локально (библиотека adhan).</li>
            </ul>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">5. Разрешения</h2>
            <p>
              <code>geolocation</code>, <code>storage</code>, <code>alarms</code>,{' '}
              <code>notifications</code> — только для функций расширения.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">6. Продажа данных</h2>
            <p>
              Мы <strong className="text-[var(--ink)]">не продаём</strong> данные и не используем их
              для рекламы.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">7. Удаление</h2>
            <p>Удалите расширение или очистите его данные в настройках браузера.</p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">8. Контакты</h2>
            <p>
              <a
                className="text-[var(--accent)]"
                href={`${GITHUB_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Issues на GitHub
              </a>{' '}
              или{' '}
              <a className="text-[var(--accent)]" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                github.com/zakapower
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-[0.98rem] leading-relaxed text-[color-mix(in_srgb,var(--ink)_92%,var(--muted))]">
            <h1
              className="m-0 text-[1.55rem] font-bold tracking-[-0.02em] text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Privacy Policy
            </h1>
            <p className="m-0 text-[0.88rem] text-[var(--muted)]">Last updated: August 13, 2026</p>
            <p>
              The <strong className="text-[var(--ink)]">Mikat</strong> browser extension shows prayer
              times, a toolbar countdown, and optional notifications. This page explains what data
              is used and how it is handled.
            </p>
            <h2 className="mt-6 text-[1.05rem] font-semibold text-[var(--ink)]">1. Developer</h2>
            <p>
              Developer:{' '}
              <a className="text-[var(--accent)]" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                zakapower
              </a>
              . Repository:{' '}
              <a className="text-[var(--accent)]" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                github.com/zakapower/mikat
              </a>
              .
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">2. Data we use</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[var(--ink)]">Location</strong> — coordinates and place label
                for prayer calculation only.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Settings</strong> — theme, language, method, Asr
                madhab, notifications.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Day cache</strong> — local times for popup and
                badge.
              </li>
            </ul>
            <p>
              Mikat does <strong className="text-[var(--ink)]">not</strong> collect browsing history,
              website content, email, accounts, or payment data.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">3. Storage</h2>
            <p>
              Data stays in <code>chrome.storage</code> in your browser profile. Mikat has no backend
              and does <strong className="text-[var(--ink)]">not send data to our servers</strong>.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">4. Network</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>OpenStreetMap Nominatim for city search / reverse geocoding.</li>
              <li>Prayer times calculated locally with adhan.</li>
            </ul>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">5. Permissions</h2>
            <p>
              <code>geolocation</code>, <code>storage</code>, <code>alarms</code>,{' '}
              <code>notifications</code> — only for extension features.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">6. Sale of data</h2>
            <p>
              We do <strong className="text-[var(--ink)]">not sell</strong> user data or use it for
              ads.
            </p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">7. Deletion</h2>
            <p>Remove the extension or clear its storage in browser settings.</p>
            <h2 className="text-[1.05rem] font-semibold text-[var(--ink)]">8. Contact</h2>
            <p>
              <a
                className="text-[var(--accent)]"
                href={`${GITHUB_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub issues
              </a>{' '}
              or{' '}
              <a className="text-[var(--accent)]" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                github.com/zakapower
              </a>
              .
            </p>
          </div>
        )}
      </article>

      <p className="mt-8 text-[0.88rem] text-[var(--muted)]">
        <Link href="/" className="text-[var(--accent)]">
          ← На главную
        </Link>
      </p>
    </div>
  )
}
