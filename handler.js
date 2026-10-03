/* 

                            Recode by Zora
   ================================================================
    Base      : noxXleys
    WhatsApp  : wa.me/6282124186488
    GitHub    : https://github.com/ZoraHost
    Instagram : https://www.instagram.com/frrwll/
    YouTube   : @ZoraHost
    Channel   : https://whatsapp.com/channel/0029VauzzBMCcW4irdRvCK0g

                                 NOTE
   ================================================================
    Copy, recode, rename, reupload diperbolehkan.
    Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini

             Terima kasih sudah menggunakan Nova Bot

*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import caseHandler from './lib/hot_reload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginDir = path.join(__dirname, 'plugins')

export const plugins = new Map()
const pluginCache = new Map()
const watchers = new Map()
const pendingReloads = new Map()

function getPluginFiles(dir) {
    let files = []
    if (!fs.existsSync(dir)) return files
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name)
        if (item.isDirectory()) files.push(...getPluginFiles(full))
        else if (item.isFile() && item.name.endsWith('.js')) files.push(full)
    }
    return files
}

async function loadPlugin(file) {
    try {
        const module = await import(`${pathToFileURL(file).href}?update=${Date.now()}`)
        const handler = module.default
        if (!handler) return

        if (pluginCache.has(file)) {
            for (const key of pluginCache.get(file)) plugins.delete(key)
        }

        const keys = []
        if (handler.command && !(handler.command instanceof RegExp)) {
            const commands = Array.isArray(handler.command) ? handler.command : [handler.command]
            for (const cmd of commands) {
                const key = String(cmd).toLowerCase()
                plugins.set(key, handler)
                keys.push(key)
            }
        }

        if (handler.customPrefix) {
            const key = Symbol(file)
            plugins.set(key, handler)
            keys.push(key)
        }

        pluginCache.set(file, keys)
    } catch (e) {
        console.error(`Gagal memuat plugin ${file}:`, e)
    }
}

async function unloadPlugin(file) {
    if (!pluginCache.has(file)) return
    for (const key of pluginCache.get(file)) plugins.delete(key)
    pluginCache.delete(file)
}

export async function initPlugins() {
    for (const file of getPluginFiles(pluginDir)) {
        await loadPlugin(file)
    }
    watch(pluginDir)
}

function watch(dir) {
    if (watchers.has(dir)) return
    watchers.set(dir, fs.watch(dir, (_, filename) => {
        if (!filename || !filename.endsWith('.js')) return
        const file = path.join(dir, filename)
        if (pendingReloads.has(file)) clearTimeout(pendingReloads.get(file))
        pendingReloads.set(file, setTimeout(async () => {
            pendingReloads.delete(file)
            if (fs.existsSync(file)) await loadPlugin(file)
            else await unloadPlugin(file)
        }, 200))
    }))
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        if (item.isDirectory()) watch(path.join(dir, item.name))
    }
}

const norm = (jid) => String(jid || '').split('@')[0].replace(/[^0-9]/g, '')

function readJson(file, fallback = []) {
    try { return JSON.parse(fs.readFileSync(file, 'utf-8')) } catch { return fallback }
}

function safeDecodeJid(nov4, jid) {
    try {
        const decoded = nov4.decodeJid(jid)
        return decoded || jid
    } catch {
        return jid
    }
}

export default async function handleMessage(nov4, m, chatUpdate, store) {
    try {
        let body = m.text || ''
        let command = ''
        let args = []

        const prefixMatch = body.trim().match(/^[¬∞zZ#$@+,.?=''():‚àö%¬¢¬£¬•‚Ç¨œÄ¬§ŒÝŒ¶&><‚Ñ¢¬©¬ÆŒî^Œ≤Œ±¬¶|/\\¬©^]/)

        if (prefixMatch) {
            const prefixChar = prefixMatch[0]
            const withoutPrefix = body.trim().slice(prefixChar.length).trim()
            const parts = withoutPrefix.split(/\s+/)
            command = parts.shift().toLowerCase() || ''
            args = parts
        }

        const pluginHandler = plugins.get(command)

        if (pluginHandler && typeof pluginHandler.run === 'function') {
            const reply = (text, options = {}) =>
                nov4.sendMessage(m.chat, { text, ...options }, { quoted: m })

            const from = m.chat || m.key?.remoteJid || ''
            const isGroup = !!(
                from.endsWith('@g.us') ||
                from.endsWith('@lid') ||
                m.key?.participant ||
                m.isGroup
            )

            const botNumber = safeDecodeJid(nov4, nov4.user.id)
            const botClean = norm(botNumber)

            const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''
            const senderClean = norm(sender)

            let groupMetadata = {}
            let participants = []
            if (isGroup) {
                try {
                    groupMetadata = await nov4.groupMetadata(from).catch(() => ({}))
                    participants = groupMetadata.participants || []
                } catch { participants = [] }
            }

            const ids = (v) => [v.id, v.jid, v.lid].filter(Boolean).map(norm)
            const admins = participants.filter(v => v.admin !== null)
            const botIds = [botNumber, nov4.user?.id, nov4.user?.lid].filter(Boolean).map(norm)
            const senderIds = [sender, m.sender].filter(Boolean).map(norm)

            const isBotAdmins = isGroup ? admins.some(p => ids(p).some(i => botIds.includes(i))) : false
            const isAdmins = isGroup ? admins.some(p => ids(p).some(i => senderIds.includes(i))) : false

            const ownerbot = readJson('./lib/database/owner.json', [])
            const premium = readJson('./lib/database/premium.json', [])

            const globalOwners = Array.isArray(global.owner) ? global.owner : (global.owner ? [global.owner] : [])

            const isOwner = ownerbot.map(norm).includes(senderClean)
            const isCreator = [...globalOwners.map(norm), botClean].includes(senderClean)
            const isPremium = premium.map(norm).includes(senderClean)

            const prefix = prefixMatch ? prefixMatch[0] : '/'

            return await pluginHandler.run(
                nov4,
                m,
                {
                    nov4,
                    conn: nov4,
                    args,
                    text: args.join(' '),
                    command,
                    store,
                    reply,
                    from,
                    isGroup,
                    isAdmins,
                    isBotAdmins,
                    isOwner,
                    isCreator,
                    isPremium,
                    groupMetadata,
                    participants,
                    prefix,
                    sender,
                    senderNumber: senderClean,
                    botNumber,
                    pushname: m.pushName || 'User'
                }
            )
        }

        await caseHandler(nov4, m, chatUpdate, store)
    } catch (e) {
        console.error(e)
    }
}