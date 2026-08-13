export const USER_AGENT = 'MikatPrayerExtension/1.0 (local)'

function nominatimLang(language) {
  return language === 'en' ? 'en' : 'ru'
}

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
          Object.assign(new Error(err.message || 'geolocation failed'), {
            code: err.code === 1 ? 'GEO_DENIED' : 'GEO_UNAVAILABLE',
          }),
        ),
      { enableHighAccuracy: false, timeout: 10000 },
    )
  })
}

export async function searchCities(query, language = 'ru') {
  const q = query.trim()
  if (!q) return []
  const url =
    'https://nominatim.openstreetmap.org/search?' +
    new URLSearchParams({
      q,
      format: 'json',
      limit: '5',
      'accept-language': nominatimLang(language),
    })
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

/** Reverse geocode in the UI language (street / city names). */
export async function reversePlaceLabel(latitude, longitude, language = 'ru') {
  const url =
    'https://nominatim.openstreetmap.org/reverse?' +
    new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: 'json',
      'accept-language': nominatimLang(language),
    })
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
  })
  if (!res.ok) throw new Error('REVERSE_FAILED')
  const data = await res.json()
  return typeof data.display_name === 'string' ? data.display_name : ''
}
