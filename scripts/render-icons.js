import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

/** Rounded-square app icon: Lucide moon-star on purple, transparent outside radius. */
function makeSvg(size) {
  const r = Math.round(size * 0.22)
  const stroke = size <= 16 ? 2.5 : size <= 48 ? 2.15 : 2
  const scale = ((size <= 16 ? 2.4 : 2.95) * size) / 128
  const half = size / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#5B21B6"/>
  <g transform="translate(${half} ${half}) scale(${scale}) translate(-12 -12)" stroke="#F5F0FF" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    <path d="M20 3v4"/>
    <path d="M22 5h-4"/>
  </g>
</svg>`
}

const master = makeSvg(128)
writeFileSync('icons/icon.svg', master)

for (const size of [16, 48, 128]) {
  const out = `icons/icon${size}.png`
  await sharp(Buffer.from(makeSvg(size))).png().toFile(out)
  console.log('wrote', out)
}
