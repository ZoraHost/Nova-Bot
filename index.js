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

console.clear()
import "./settings.js"

// =============== { Import Library } =============== //
import readline from 'readline'
import pino from 'pino'
import chalk from 'chalk'
import path from 'path'
import lolcatjs from 'lolcatjs'
import boxen from 'boxen'
import { fileURLToPath } from "url"
import gradient from "gradient-string"
import figlet from "figlet"
import fs from "fs"
import {
    useMultiFileAuthState,
    DisconnectReason,
    makeInMemoryStore,
    jidDecode,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    makeWASocket,
    downloadContentFromMessage
} from '@whiskeysockets/baileys'
import { smsg } from './lib/myfunc.js'
import handleMessage, { initPlugins } from './handler.js'
import { startAutoClear } from './lib/autoclear.js'

// =============== { Global State } =============== //
global.antilink   ??= {}
global.linkWarn   ??= new Map()
global.antitoxic  ??= {}
global.antispam   ??= {}
global.welcome    ??= {}
global.left       ??= {}
global.afk        ??= new Map()
global.userSpam   ??= new Map()

// =============== { Config Bot } =============== //
const usePairingCode = true
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise(resolve => rl.question(text, resolve))

const store = makeInMemoryStore({ logger: pino({ level: 'silent' }) })
let pluginsLoaded = false
let isLoggedOutNotified = false

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// =============== { Helper } =============== //
const norm = (jid) => String(jid || '').split('@')[0].replace(/[^0-9]/g, '')
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function readJson(file, fallback = {}) {
    try { return JSON.parse(fs.readFileSync(file, 'utf-8')) } catch { return fallback }
}

// =============== { Auto Features } =============== //
async function runAutoFeatures(nov4, m) {
    if (!m) return false

    const from = m.chat || m.key?.remoteJid || ''
    if (!from || from === 'status@broadcast') return false

    const body = m.text || m.body || ''
    const isGroup = from.endsWith('@g.us')

    const botNumber = nov4.decodeJid(nov4.user.id)
    const botClean = norm(botNumber)

    const sender = m.sender || m.key?.participant || m.key?.remoteJid || ''
    const senderClean = norm(sender)

    const ownerbot = readJson('./lib/database/owner.json', [])
    const globalOwners = Array.isArray(global.owner) ? global.owner : (global.owner ? [global.owner] : [])
    const isCreator = [...globalOwners.map(norm), botClean].includes(senderClean)

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

    const reply = (text) => nov4.sendMessage(from, { text, mentions: [sender] }, { quoted: m })

    // ============ AFK Clear ============ //
    if (global.afk.has(sender) && (m.text || '').toLowerCase() !== 'afk') {
        const afkData = global.afk.get(sender)
        const durasi = Math.floor((Date.now() - afkData.time) / 1000)
        global.afk.delete(sender)

        await nov4.sendMessage(from, {
            text: `✅ @${senderClean} sudah tidak AFK\n\n_Durasi: ${durasi} detik_`,
            mentions: [sender]
        }, { quoted: m })
    }

    // ============ AFK Mention ============ //
    if (global.afk.size > 0 && m.mentionedJid?.length) {
        for (const jid of m.mentionedJid) {
            if (global.afk.has(jid)) {
                const afkData = global.afk.get(jid)
                const durasi = Math.floor((Date.now() - afkData.time) / 1000)
                await nov4.sendMessage(from, {
                    text: `😴 @${norm(jid)} sedang AFK\n\n📝 ${afkData.reason}\n⏱ ${durasi} detik`,
                    mentions: [jid]
                }, { quoted: m })
            }
        }
    }

    // ============ Antilink ============ //
    if (isGroup && !isAdmins && !isCreator && isBotAdmins) {
        const antilinkData = readJson('./lib/database/antilink.json', {})
        const chatId = m.chat || from
        const mode = antilinkData[chatId] || antilinkData[from]

        if (mode) {
            const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(chat\.whatsapp\.com\/[^\s]+)|(wa\.me\/[^\s]+)|(t\.me\/[^\s]+)|(bit\.ly\/[^\s]+)|(tinyurl\.com\/[^\s]+)|(s\.id\/[^\s]+)|(linktree\.com\/[^\s]+)/gi

            if (linkRegex.test(body)) {
                try {
                    await nov4.sendMessage(chatId, { delete: m.key })
                    const userKey = `${chatId}:${sender}`

                    if (mode === 'kick') {
                        await nov4.groupParticipantsUpdate(chatId, [sender], 'remove')
                        await reply(`🚫 @${senderClean} dikick karena kirim link.`)
                    } else if (mode === 'delete') {
                        const count = (global.linkWarn.get(userKey) || 0) + 1
                        global.linkWarn.set(userKey, count)

                        if (count >= 3) {
                            global.linkWarn.delete(userKey)
                            await reply(`⚠️ @${senderClean} sudah 3x kirim link.`)
                        } else {
                            await reply(`⚠️ @${senderClean} jangan kirim link.\n_${count}/3 warning_`)
                        }
                    }
                } catch (e) {
                    console.error('[ANTILINK]', e.message)
                }
                return true
            }
        }
    }

    // ============ Antitoxic ============ //
    if (isGroup && global.antitoxic[from] && !isAdmins && !isCreator) {
        const toxicWords = ['anjing', 'bangsat', 'kontol', 'memek', 'ngentot', 'babi', 'kampret', 'tai', 'keparat']
        const bodyLower = body.toLowerCase()

        if (toxicWords.some(w => bodyLower.includes(w))) {
            try {
                await nov4.sendMessage(m.chat, { delete: m.key })
                await reply(`⚠️ @${senderClean} jangan toxic!`)
            } catch {}
            return true
        }
    }

    // ============ Antispam ============ //
    if (isGroup && global.antispam[from] && !isAdmins && !isCreator) {
        const now = Date.now()
        const userKey = `${from}:${sender}`
        const spamData = global.userSpam.get(userKey) || { count: 0, first: now }

        if (now - spamData.first > 5000) {
            spamData.count = 0
            spamData.first = now
        }

        spamData.count++
        global.userSpam.set(userKey, spamData)

        if (spamData.count > 5) {
            try {
                await nov4.sendMessage(m.chat, { delete: m.key })
                await reply(`⚠️ @${senderClean} jangan spam!`)
            } catch {}
            return true
        }
    }

    return false
}

// =============== { Auto Notif } =============== //
async function runAutoNotif(nov4, update) {
    try {
        const { id, participants, action, author } = update
        if (!id || !participants || !action) return

        const groupMetadata = await nov4.groupMetadata(id).catch(() => null)
        if (!groupMetadata) return

        const groupName = groupMetadata.subject || 'Grup'
        const memberCount = groupMetadata.participants?.length || 0

        let ppUrl = null
        try {
            ppUrl = await nov4.profilePictureUrl(id, 'image')
        } catch {}

        const time = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })

        const authorClean = (author || '').split('@')[0].replace(/[^0-9]/g, '')

        for (const jid of participants) {
            const user = jid.split('@')[0].replace(/[^0-9]/g, '')

            let text = null

            // ============ Welcome ============ //
            if (action === 'add') {
                text =
                    `👋 *Welcome*\n\n` +
                    `Halo @${user}, selamat datang di *${groupName}*\n\n` +
                    `📊 Member ke-${memberCount}\n` +
                    `🕐 ${time}\n\n` +
                    `_Semoga betah ya._`
            }

            // ============ Left ============ //
            if (action === 'remove') {
                text =
                    `👋 *Goodbye*\n\n` +
                    `@${user} telah keluar dari *${groupName}*\n\n` +
                    `📊 Sisa ${memberCount} member\n` +
                    `🕐 ${time}\n\n` +
                    `_Semoga sukses di tempat baru._`
            }

            // ============ Promote ============ //
            if (action === 'promote') {
                const by = (authorClean && authorClean !== user) ? authorClean : null
                text =
                    `👑 *Promote*\n\n` +
                    `@${user} sekarang jadi admin di *${groupName}*\n\n` +
                    (by ? `👤 By: @${by}\n` : '') +
                    `🕐 ${time}`
            }

            // ============ Demote ============ //
            if (action === 'demote') {
                const by = (authorClean && authorClean !== user) ? authorClean : null
                text =
                    `⬇️ *Demote*\n\n` +
                    `@${user} bukan admin lagi di *${groupName}*\n\n` +
                    (by ? `👤 By: @${by}\n` : '') +
                    `🕐 ${time}`
            }

            if (!text) continue

            const mentions = [jid]
            if ((action === 'promote' || action === 'demote') && authorClean && authorClean !== user) {
                mentions.push(author)
            }

            if (ppUrl) {
                await nov4.sendMessage(id, {
                    image: { url: ppUrl },
                    caption: text,
                    mentions
                })

                await sleep(500)
            } else {
                await nov4.sendMessage(id, { text, mentions })
            }

            await sleep(800)
        }
    } catch (e) {
        console.error('[AUTO-NOTIF]', e.message)
    }
}

// =============== { Terminal UI } =============== //
function createTmpFolder() {
    const folderName = "tmp"
    const folderPath = path.join(__dirname, folderName)
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
        lolcatjs.fromString(`Folder '${folderName}' berhasil dibuat.`)
    } else {
        lolcatjs.fromString(`Folder '${folderName}' sudah ada.`)
    }
}

const displayLogo = async () => {
    const maxWidth = process.stdout.columns || 80
    const logo = await figlet.text('Nova', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: Math.min(maxWidth, 60),
        whitespaceBreak: true
    })
    lolcatjs.fromString('\n' + logo + '\n')
}

const displayInfo = () => {
    const infoBox = boxen(
        chalk.white.bold(`
${chalk.green('📃 INFORMASI SCRIPT')}

${chalk.cyan(' Author')}   : Zora
${chalk.cyan(' GitHub')}   : https://github.com/ZoraHost
${chalk.cyan(' Instagram')}: https://www.instagram.com/frrwll
${chalk.cyan(' YouTube')}  : @ZoraHost
${chalk.cyan(' Base')}     : NoxXleys
    `),
        {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'cyan',
            backgroundColor: '#0a0a0a',
            title: '🌟 WELCOME 🌟',
            titleAlignment: 'center'
        }
    )
    console.log(infoBox)
}

const displayFooter = () => {
    lolcatjs.fromString(`\n> Terima kasih sudah menggunakan Nova Bot - Zora\n`)
}

const showTerminalUI = async () => {
    await displayLogo()
    displayInfo()
    createTmpFolder()
    displayFooter()
}

// =============== { Start Bot } =============== //
async function startNova() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    const nov4 = makeWASocket({
        version,
        printQRInTerminal: !usePairingCode,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        }
    })

    nov4.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return (decode.user && decode.server && decode.user + "@" + decode.server) || jid
        } else return jid
    }

    store.bind(nov4.ev)

    // =============== { Pairing Code } =============== //
    if (!nov4.authState.creds.registered && usePairingCode) {
        console.log('')
        console.log(chalk.cyan('─────────────────────────────'))
        console.log(chalk.cyan.bold('       PAIRING WHATSAPP'))
        console.log(chalk.cyan('─────────────────────────────'))
        console.log('')

        console.log(chalk.yellow('  Masukkan nomor WhatsApp anda'))
        console.log(chalk.white.bold('  Format: 628xxx (tanpa + atau 0)'))
        console.log('')

        const phoneNumber = await question(chalk.green.bold('  📱 Nomor : '))

        if (!phoneNumber || phoneNumber.trim().length < 10) {
            console.log(chalk.red('\n  ❌ Nomor tidak valid!\n'))
            process.exit(1)
        }

        try {
            const code = await nov4.requestPairingCode(phoneNumber.trim(), 'NOVABOTS')

            console.log('')
            console.log(chalk.cyan('─────────────────────────────'))
            console.log(chalk.cyan.bold('       KODE PAIRING KAMU'))
            console.log(chalk.cyan('─────────────────────────────'))
            console.log('')
            console.log(chalk.bgGreen.white.bold(`        ${code}        `))
            console.log('')
            console.log(chalk.yellow('  Cara pakai:'))
            console.log(chalk.white('  1. Buka WhatsApp'))
            console.log(chalk.white('  2. Settings → Linked Devices'))
            console.log(chalk.white('  3. Link a Device'))
            console.log(chalk.white('  4. Pilih "Link with phone number instead"'))
            console.log(chalk.white('  5. Masukin kode di atas'))
            console.log('')

        } catch (e) {
            console.log(chalk.red(`\n  ❌ Gagal: ${e.message}\n`))
            process.exit(1)
        }
    }

    // =============== { Download Media Handler } =============== //
    nov4.downloadMediaMessage = async (message) => {
        const msg = message.msg || message
        const mime = msg.mimetype || ''
        if (!mime) {
            throw new Error('Pesan tidak memiliki media.')
        }
        const messageType = message.mtype
            ? message.mtype.replace(/Message/gi, '')
            : mime.split('/')[0]
        const validTypes = ['image', 'video', 'audio', 'sticker', 'document']
        if (!validTypes.includes(messageType.toLowerCase())) {
            throw new Error(`Tipe media tidak didukung: ${messageType}`)
        }
        const stream = await downloadContentFromMessage(msg, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }

    // =============== { Message Handler } =============== //
    nov4.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const mek = messages[0]
            if (!mek.message) return
            if (mek.key.remoteJid === 'status@broadcast') return
            if (mek.key.id?.startsWith('BAE5') && mek.key.id.length === 16) return

            const m = smsg(nov4, mek, store)
            if (!m) return

            const blocked = await runAutoFeatures(nov4, m)
            if (blocked) return

            await handleMessage(nov4, m, store)
        } catch (e) {
            console.error(e)
        }
    })

    // =============== { Group Participants Handler } =============== //
    nov4.ev.on('group-participants.update', async (update) => {
        await runAutoNotif(nov4, update)
    })

    if (nov4.public === undefined) nov4.public = true

    // =============== { Connection Handler } =============== //
    nov4.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
            console.clear()
            if (!pluginsLoaded) {
                await initPlugins()
                pluginsLoaded = true
            }
            await showTerminalUI()
            isLoggedOutNotified = false
            console.log(chalk.yellow(`Bot success connected ✓\nWait 15-20 seconds to use`))
            return
        }

        if (connection === 'close') {
            const isLoggedOut = lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut

            if (isLoggedOut) {
                if (!isLoggedOutNotified) {
                    isLoggedOutNotified = true
                }
            } else {
                startNova()
            }
        }
    })

    nov4.ev.on('creds.update', saveCreds)
}

// =============== { Start } =============== //
startAutoClear(60, 24)
startNova()