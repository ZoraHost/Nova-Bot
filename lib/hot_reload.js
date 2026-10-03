import fs from 'fs'
import path from 'path'
import { pathToFileURL, fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CORE_PATH = path.join(__dirname, '..', 'case.js')

let handler = null
let lastMtime = 0

async function loadCore() {
    if (!fs.existsSync(CORE_PATH)) {
        throw new Error(`case.js tidak ditemukan di ${CORE_PATH}`)
    }

    const stat = fs.statSync(CORE_PATH)

    if (handler && stat.mtimeMs === lastMtime) {
        return handler
    }

    const mod = await import(`${pathToFileURL(CORE_PATH).href}?t=${Date.now()}`)
    handler = mod.default || mod
    lastMtime = stat.mtimeMs

    return handler
}

export default async function caseWrapper(nov4, m, chatUpdate, store) {
    try {
        const fn = await loadCore()
        return await fn(nov4, m, chatUpdate, store)
    } catch (e) {
        console.error('[hot-reload] Error:', e.message)
    }
}