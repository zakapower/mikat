import sharp from 'sharp'

function svg(size) {
  const r = Math.round(size * 0.22)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#5B21B6"/></svg>`
}

for (const size of [16, 48, 128]) {
  await sharp(Buffer.from(svg(size))).png().toFile(`icons/icon-empty${size}.png`)
  console.log('wrote', size)
}
