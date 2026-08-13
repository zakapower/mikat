# Chrome Web Store — Микат / Mikat

## Краткое описание (до 132 символов)

**RU:**
Времена намаза по вашей локации: countdown на иконке, уведомления и выбор метода расчёта.

**EN:**
Prayer times for your location: toolbar countdown, notifications, and calculation method choice.

## Полное описание

### Русский

Микат — простое расширение для Chrome и Edge: актуальные времена намаза рядом с адресной строкой.

Что умеет
• Показывает следующий намаз и полный список на сегодня
• Countdown на иконке расширения (HH:MM)
• Уведомления с напоминанием за 5, 10 или 15 минут
• Геолокация или поиск города
• Методы расчёта (включая Muslim World League) и мазхаб для Аср
• Русский / English и светлая / тёмная тема

Расчёт выполняется локально (библиотека adhan). Координаты нужны только для вычисления времён и поиска города; данные не продаются.

Откройте иконку Микат, разрешите геолокацию или укажите город в настройках — и времена намаза всегда под рукой.

### English

Mikat is a simple Chrome and Edge extension that keeps prayer times next to your toolbar.

Features
• Next prayer and today’s full schedule
• Countdown badge on the extension icon (HH:MM)
• Optional notifications 5, 10, or 15 minutes before
• Geolocation or city search
• Calculation methods (including Muslim World League) and Asr madhab
• Russian / English and light / dark theme

Times are calculated locally with the adhan library. Location is used only to compute times and search cities — we don’t sell your data.

Open Mikat, allow location or pick a city in settings, and prayer times stay one click away.

## Поля в кабинете

- **Category:** Lifestyle (или Productivity)
- **Language:** Russian (primary), English
- **Single purpose:** Display Islamic prayer times and reminders for the user’s location

## Обоснование разрешений

- `storage` — сохранение локации, метода, темы и языка
- `alarms` — обновление badge и напоминаний
- `notifications` — уведомления о намазе (можно выключить)
- `geolocation` — определение координат для расчёта
- `https://nominatim.openstreetmap.org/*` — поиск города

## Privacy policy URL

После включения GitHub Pages из папки `/docs`:

`https://zakapower.github.io/mikat/privacy.html`

Локальный файл: `docs/privacy.html` (RU/EN).

## Скриншоты

Файлы в `store/shots/` (1280×800 PNG):
1. `01-main-dark.png` — главный экран (тёмная тема)
2. `02-settings-dark.png` — настройки
3. `03-main-light.png` — главный экран (светлая тема)

## Promo tiles (без alpha, 24-bit PNG)

- Small: `store/promo/small-promo-440x280.png` (440×280)
- Marquee: `store/promo/marquee-promo-1400x560.png` (1400×560)
