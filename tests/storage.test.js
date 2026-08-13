import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

const syncStore = {}
const localStore = {}

globalThis.chrome = {
  storage: {
    sync: {
      get: async (defaults) => ({ ...defaults, ...syncStore }),
      set: async (obj) => {
        Object.assign(syncStore, obj)
      },
    },
    local: {
      get: async (keys) => {
        if (typeof keys === 'string') return { [keys]: localStore[keys] }
        const out = {}
        for (const k of Object.keys(keys)) out[k] = localStore[k] ?? keys[k]
        return out
      },
      set: async (obj) => {
        Object.assign(localStore, obj)
      },
    },
  },
}

const { getSettings, setSettings, DEFAULT_SETTINGS } = await import('../lib/storage.js')

describe('storage settings', () => {
  beforeEach(() => {
    for (const k of Object.keys(syncStore)) delete syncStore[k]
  })
  it('returns defaults', async () => {
    const s = await getSettings()
    assert.equal(s.methodId, DEFAULT_SETTINGS.methodId)
    assert.equal(s.notificationsEnabled, true)
  })
  it('merges partial updates', async () => {
    await setSettings({ notificationsEnabled: false, notifyBeforeMinutes: 15 })
    const s = await getSettings()
    assert.equal(s.notificationsEnabled, false)
    assert.equal(s.notifyBeforeMinutes, 15)
    assert.equal(s.methodId, 'MWL')
  })
})
