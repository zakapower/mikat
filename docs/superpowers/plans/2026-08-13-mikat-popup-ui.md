# Микат Popup UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Редизайн popup: два view, Lucide-иконки, theme/settings кнопки, автогео при первом запуске, новая иконка приложения.

**Architecture:** Vanilla popup с `data-view` на `.app`. Lucide SVG вендорятся в `popup/lucide-icons.js` как строки. Логика гео/настроек уже в `popup.js` — перенос разметки и boot-автогео. Иконки приложения — PNG в `icons/`.

**Tech Stack:** HTML/CSS/JS MV3, Lucide SVG paths, chrome.storage, GenerateImage + resize для icons.

## Global Constraints

- Язык UI: русский
- Без CDN для иконок; без нового бандлера
- Коммиты только по явной просьбе пользователя
- Сохранить фиолетовый accent и CSS-переменные

## File Structure

- Create: `popup/lucide-icons.js`
- Modify: `popup/popup.html`, `popup/popup.css`, `popup/popup.js`
- Replace: `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`

---

### Task 1: Lucide helper + разметка двух view

**Files:**
- Create: `popup/lucide-icons.js`
- Modify: `popup/popup.html`

- [x] Export SVG helper + нужные иконки
- [x] Перестроить HTML: view-main / view-settings, icon-кнопки

### Task 2: CSS шапки, icon-кнопок, views

**Files:**
- Modify: `popup/popup.css`

- [x] Стили `.icon-btn`, `.view`, шапок, компактной строки локации

### Task 3: JS — views, theme icons, автогео

**Files:**
- Modify: `popup/popup.js`

- [x] Переключение view, иконка темы, boot автогео, wire settings back

### Task 4: Иконка приложения

**Files:**
- Replace: `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`

- [x] Сгенерировать мастер-арт и экспортировать 16/48/128

### Task 5: Проверка

- [x] `npm test`
- [x] Визуальная сверка разметки/классов
