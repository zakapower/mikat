# Ghost loading while locating — Mikat popup

**Date:** 2026-08-14  
**Status:** Approved  

## Goal

Replace the visible «Определяю местоположение…» copy with a shimmer skeleton that mirrors the main prayer UI, matching neighbor extensions (`quran-hadith` bone/shimmer).

## Behavior

- While `locating === true`: hide lead text; show skeleton for next-block + 6 prayer rows; `aria-busy` on main view; locating string only for screen readers / optional status.
- On geo failure: hide skeleton; show need-location lead; open settings (existing flow).
- On success: hide skeleton; show real next + list (existing `renderNext` / `renderList`).
- Geo buttons keep existing `is-loading` spinner state.

## Visual

- CSS bones: same gradient/shimmer as neighbors (`list-skel-shimmer` / `reader-skel__bone` pattern).
- Layout mirrors `.next` + `.prayer-list` spacing in `popup.css`.
- `prefers-reduced-motion`: static bone, no animation.

## Files

- `popup/popup.html` — skeleton markup
- `popup/popup.css` — bone + shimmer
- `popup/popup.js` — toggle skeleton with `locating`
- `popup/i18n.js` — keep `locating` for a11y only (may stay)

## Non-goals

- Skeleton for settings view
- Changing geo / persist logic beyond UI state
