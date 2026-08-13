import Image from 'next/image'
import Link from 'next/link'
import { CHROME_STORE_URL, GITHUB_URL } from '@/lib/site'

function InstallCta({ className = '' }: { className?: string }) {
  if (CHROME_STORE_URL) {
    return (
      <a
        href={CHROME_STORE_URL}
        className={`inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-[0.95rem] font-semibold text-[var(--on-accent)] transition hover:brightness-110 ${className}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Установить в Chrome
      </a>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-[0.95rem] font-semibold text-[var(--muted)] ${className}`}
      title="Ссылка появится после публикации в Chrome Web Store"
    >
      Скоро в Chrome Web Store
    </span>
  )
}

function PopupMock() {
  return (
    <div className="w-[min(100%,20rem)] overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent)_25%,var(--line))] bg-[var(--surface)] shadow-[0_28px_70px_rgba(0,0,0,0.45)]">
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[1.55rem] font-bold tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Микат
          </p>
          <div className="flex gap-1.5 text-[0.65rem] font-semibold text-[var(--muted)]">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)]">EN</span>
            <span className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)]">☾</span>
            <span className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)]">⚙</span>
          </div>
        </div>
        <div className="border-b border-[var(--line)] pb-3">
          <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
            Следующий намаз
          </p>
          <p
            className="m-0 mt-1 text-[1.55rem] font-bold text-[var(--accent)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Магриб
          </p>
          <p className="m-0 text-[1.7rem] font-semibold leading-none">18:42</p>
          <p className="m-0 mt-2 text-[0.85rem] text-[var(--muted)]">через 1 ч 24 мин</p>
        </div>
        <ul className="m-0 list-none space-y-0.5 p-0 text-[0.88rem]">
          {(
            [
              { name: 'Фаджр', time: '04:18' },
              { name: 'Зухр', time: '12:14' },
              { name: 'Аср', time: '15:47' },
              { name: 'Магриб', time: '18:42', next: true },
              { name: 'Иша', time: '20:12' },
            ] as const
          ).map((row) => (
            <li
              key={row.name}
              className={`flex justify-between rounded-md px-2 py-1.5 ${
                'next' in row && row.next
                  ? 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]'
                  : ''
              }`}
            >
              <strong className={'next' in row && row.next ? 'text-[var(--accent)]' : ''}>
                {row.name}
              </strong>
              <span>{row.time}</span>
            </li>
          ))}
        </ul>
        <p className="m-0 border-t border-[var(--line)] pt-2 text-[0.82rem] text-[var(--muted)]">
          Махачкала, Дагестан
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <header className="anim-rise mb-10 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icon.png" alt="" width={40} height={40} className="rounded-[0.65rem]" />
          <span
            className="text-[1.35rem] font-bold tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Микат
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-[0.9rem] text-[var(--muted)]">
          <Link href="/privacy" className="hover:text-[var(--ink)]">
            Privacy
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)]">
            GitHub
          </a>
        </nav>
      </header>

      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div>
          <h1
            className="anim-rise m-0 text-[clamp(2.6rem,7vw,4.4rem)] font-bold leading-[1.02] tracking-[-0.045em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Микат
          </h1>
          <p className="anim-rise-delay m-0 mt-4 max-w-md text-[1.15rem] leading-relaxed text-[var(--muted)]">
            Времена намаза всегда под рукой: таймер на иконке, уведомления и расчёт по вашей локации.
          </p>
          <div className="anim-rise-late mt-8 flex flex-wrap items-center gap-3">
            <InstallCta />
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--line)] px-5 py-3 text-[0.95rem] font-semibold text-[var(--ink)] transition hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--line))]"
            >
              Политика конфиденциальности
            </Link>
          </div>
        </div>

        <div className="anim-rise-late anim-float flex justify-center lg:justify-end">
          <PopupMock />
        </div>
      </section>

      <section className="mt-20 border-t border-[var(--line)] pt-12">
        <h2
          className="m-0 text-[1.6rem] font-bold tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Возможности
        </h2>
        <p className="mt-2 max-w-xl text-[var(--muted)]">
          Локальный расчёт (adhan), без своего сервера. Настройки и локация хранятся в браузере.
        </p>
        <ul className="mt-8 m-0 grid list-none gap-5 p-0 sm:grid-cols-2">
          {[
            ['Таймер на иконке', 'Countdown HH:MM до следующего намаза прямо на badge.'],
            ['Уведомления', 'Напоминание за 5, 10 или 15 минут — можно выключить.'],
            ['Локация', 'Геолокация или поиск города через OpenStreetMap.'],
            ['Гибкий расчёт', 'Методы (в т.ч. Muslim World League) и мазхаб для Аср.'],
            ['RU / EN', 'Интерфейс на русском и английском.'],
            ['Темы', 'Светлая и тёмная — как вам удобнее.'],
          ].map(([title, text]) => (
            <li key={title} className="border-t border-[var(--line)] pt-4">
              <h3 className="m-0 text-[1.05rem] font-semibold">{title}</h3>
              <p className="m-0 mt-1.5 text-[0.95rem] text-[var(--muted)]">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-[0.88rem] text-[var(--muted)]">
        <p className="m-0">© Микат</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-[var(--ink)]">
            Privacy Policy
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)]">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
