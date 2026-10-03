import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SESSION_DIR = path.join(__dirname, '..', 'session')

const KEEP_FILES = new Set([
    'creds.json',
    'creds.json.bak'
])

const CLEAR_PATTERNS = [
    /^pre-key-\d+\.json$/,
    /^sender-key-\d+.*\.json$/,
    /^sender-key-memory-\d+.*\.json$/,
    /^app-state-sync-key-.*\.json$/,
    /^app-state-sync-version-.*\.json$/,
    /^session-.*\.json$/,
    /^device-list-.*\.json$/,
    /^lid-mapping-.*\.json$/
]

function isOldFile(filePath, maxAgeMs) {
    try {
        const stat = fs.statSync(filePath)
        return Date.now() - stat.mtimeMs > maxAgeMs
    } catch {
        return false
    }
}

export function clearSession(maxAgeMs = 24 * 60 * 60 * 1000) {
    if (!fs.existsSync(SESSION_DIR)) {
        return { deleted: 0, kept: 0, sizeSaved: 0, sizeMB: '0.00', error: 'Folder session ga ada' }
    }

    let deleted = 0
    let kept = 0
    let sizeSaved = 0

    const files = fs.readdirSync(SESSION_DIR)

    for (const file of files) {
        const fullPath = path.join(SESSION_DIR, file)

        if (KEEP_FILES.has(file)) {
            kept++
            continue
        }

        let stat
        try {
            stat = fs.statSync(fullPath)
        } catch {
            continue
        }

        if (stat.isDirectory()) {
            kept++
            continue
        }

        const matchPattern = CLEAR_PATTERNS.some(rx => rx.test(file))

        if (!matchPattern) {
            kept++
            continue
        }

        if (!isOldFile(fullPath, maxAgeMs)) {
            kept++
            continue
        }

        try {
            sizeSaved += stat.size
            fs.unlinkSync(fullPath)
            deleted++
        } catch {}
    }

    return {
        deleted,
        kept,
        sizeSaved,
        sizeMB: (sizeSaved / 1024 / 1024).toFixed(2)
    }
}

export function clearSessionAll() {
    if (!fs.existsSync(SESSION_DIR)) {
        return { deleted: 0, kept: 0, sizeSaved: 0, sizeMB: '0.00', error: 'Folder session ga ada' }
    }

    let deleted = 0
    let kept = 0
    let sizeSaved = 0

    const files = fs.readdirSync(SESSION_DIR)

    for (const file of files) {
        const fullPath = path.join(SESSION_DIR, file)

        if (KEEP_FILES.has(file)) {
            kept++
            continue
        }

        let stat
        try {
            stat = fs.statSync(fullPath)
        } catch {
            continue
        }

        if (stat.isDirectory()) {
            kept++
            continue
        }

        const matchPattern = CLEAR_PATTERNS.some(rx => rx.test(file))

        if (!matchPattern) {
            kept++
            continue
        }

        try {
            sizeSaved += stat.size
            fs.unlinkSync(fullPath)
            deleted++
        } catch {}
    }

    return {
        deleted,
        kept,
        sizeSaved,
        sizeMB: (sizeSaved / 1024 / 1024).toFixed(2)
    }
}

let autoClearTimer = null

export function startAutoClear(intervalMinutes = 60, maxAgeHours = 24) {
    if (autoClearTimer) clearInterval(autoClearTimer)

    const intervalMs = intervalMinutes * 60 * 1000
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000

    autoClearTimer = setInterval(() => {
        try {
            const result = clearSession(maxAgeMs)
            if (result.deleted > 0) {
                console.log(
                    `[AUTO-CLEAR] Hapus ${result.deleted} file (${result.sizeMB} MB), ` +
                    `sisain ${result.kept} file`
                )
            }
        } catch (e) {
            console.error('[AUTO-CLEAR] Error:', e.message)
        }
    }, intervalMs)
    return autoClearTimer
}

export function stopAutoClear() {
    if (autoClearTimer) {
        clearInterval(autoClearTimer)
        autoClearTimer = null
        return true
    }
    return false
}

export function sessionInfo() {
    if (!fs.existsSync(SESSION_DIR)) {
        return { total: 0, size: 0, sizeMB: '0.00', files: [] }
    }

    const files = fs.readdirSync(SESSION_DIR)
    let size = 0
    const list = []

    for (const file of files) {
        const fullPath = path.join(SESSION_DIR, file)
        try {
            const stat = fs.statSync(fullPath)
            if (stat.isFile()) {
                size += stat.size
                list.push({ name: file, size: stat.size, mtime: stat.mtimeMs })
            }
        } catch {}
    }

    return {
        total: files.length,
        size,
        sizeMB: (size / 1024 / 1024).toFixed(2),
        files: list
    }
}