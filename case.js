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

import './settings.js';
import fs from 'fs';
import os from 'os';
import sharp from 'sharp';
import util from 'util';
import axios from "axios";
import { load } from "cheerio";
import crypto from 'crypto';
import path from 'path';
import { spawn, exec, execSync } from 'child_process';
import fetch from 'node-fetch';
import { pathToFileURL } from 'url';
import moment from 'moment-timezone';
import chalk from 'chalk';
import FormData from 'form-data';

import baileys, { 
    proto, 
    generateWAMessage, 
    generateWAMessageFromContent, 
    getContentType, 
    prepareWAMessageMedia 
} from '@whiskeysockets/baileys';

import { 
    smsg, isUrl, generateMessageTag, getBuffer, runtime, fetchJson, sleep, processTime, getTime, tanggal, parseMention, getGroupAdmins } from './lib/myfunct.js';
import { imageToWebp, videoToWebp, addExif } from './lib/exif.js'
import { clearSession, clearSessionAll, sessionInfo, startAutoClear, stopAutoClear } from './lib/autoclear.js'

// =============== { Import Scraper } ===============//
import { videy } from "./scrape/downloader/videy.js";
import { upVidey } from "./scrape/uploader/videy.js";
import tiktok from "./scrape/downloader/tiktok.js";
import { ytdlAuto, ytSearch } from './scrape/downloader/youtube.js';
import Lyrics from "./scrape/tools/lyrics.js";
import { ghDownload } from "./scrape/downloader/github.js";


export default async function nov4(nov4, m, chatUpdate, store) {
try {
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
);

const premium = JSON.parse(fs.readFileSync("./lib/database/premium.json"));
const OWNER_PATH = "./lib/database/owner.json";
const isPremium = premium.includes(m.sender);
const sender = m.key.fromMe
? nov4.user.id.split(":")[0] || nov4.user.id
: m.key.participant || m.key.remoteJid;
const senderNumber = sender.split('@')[0];
const budy = (typeof m.text === 'string' ? m.text : '');
const prefix = /^[¬∞zZ#$@+,.?=''():‚àö%¬¢¬£¬•‚Ç¨œÄ¬§ŒÝŒ¶&><‚Ñ¢¬©¬ÆŒî^Œ≤Œ±¬¶|/\\¬©^]/.test(body) ? body.match(/^[¬∞zZ#$@+,.?=''():‚àö%¬¢¬£¬•‚Ç¨œÄ¬§ŒÝŒ¶&><‚Ñ¢¬©¬ÆŒî^Œ≤Œ±¬¶|/\\¬©^]/gi) : '/';
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");
const botNumber = await nov4.decodeJid(nov4.user.id);
const normalizeJid = jid => nov4.decodeJid(String(jid || '')).replace(/:\d+(?=@)/, '');
const jidUser = jid => normalizeJid(jid).split('@')[0].replace(/[^0-9]/g, '');
const asUserJid = value => {
const clean = normalizeJid(value);
if (!clean) return '';
if (clean.includes('@')) return clean;
const number = clean.replace(/[^0-9]/g, '');
return number ? number + '@s.whatsapp.net' : '';
        }
const ownerbot = JSON.parse(fs.readFileSync(OWNER_PATH));
const isOwner = ownerbot.includes(m.sender);
const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
const bodyTrim = (body || '').trim();
const prefixMatch = bodyTrim.match(/^[¬∞zZ#$@+,.?=''():‚àö%¬¢¬£¬•‚Ç¨œÄ¬§ŒÝŒ¶&><‚Ñ¢¬©¬ÆŒî^Œ≤Œ±¬¶|/\\¬©^]/);
let command = '';
let args = [];

if (prefixMatch) {
    const prefixChar = prefixMatch[0];
    const withoutPrefix = bodyTrim.slice(prefixChar.length).trim();
    const parts = withoutPrefix.split(/ +/);
    command = parts.shift().toLowerCase() || '';
    args = parts;
} else {
    const parts = bodyTrim.split(/ +/);
    command = parts.shift().toLowerCase() || '';
    args = parts;
}
const pushname = m.pushName || "Zora";
const text = args.join(" ");
const q = text;
const quoted = m.quoted ? m.quoted : m;
const mime = (quoted.msg || quoted).mimetype || '';
const qmsg = (quoted.msg || quoted);
const isMedia = /image|video|sticker|audio/.test(mime);
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

    // ============== { Group } ===============//
const groupMetadata = isGroup ? await nov4.groupMetadata(m.chat).catch(() => ({})) : {};
const groupName = isGroup ? (groupMetadata.subject || '') : '';
const participants = isGroup ? (groupMetadata.participants || []) : [];
const ids = (v) => [v.id, v.jid, v.lid].filter(Boolean).map(x => x.split('@')[0].replace(/[^0-9]/g, ''));
const botIds = [botNumber, nov4.user?.id, nov4.user?.lid].filter(Boolean).map(x => x.split('@')[0].replace(/[^0-9]/g, ''));
const senderIds = [sender, m.sender].filter(Boolean).map(x => x.split('@')[0].replace(/[^0-9]/g, ''));
const groupAdmins = participants.filter(v => v.admin !== null);
const isBotAdmins = isGroup ? groupAdmins.some(p => ids(p).some(i => botIds.includes(i))) : false;
const isAdmins = isGroup ? groupAdmins.some(p => ids(p).some(i => senderIds.includes(i))) : false;
const groupOwner = isGroup ? (groupMetadata.owner || '') : '';
const clean = (v) => (v || '').split('@')[0].replace(/[^0-9]/g, '');
const ownerIds = groupOwner ? [groupOwner.split('@')[0].replace(/[^0-9]/g, '')] : [];
const isGroupOwner = isGroup ? (ownerIds.length ? senderIds.some(i => ownerIds.includes(i)) : isAdmins) : false;
const isGroupAdmins = isAdmins;
const isBotGroupAdmins = isBotAdmins;
const botNumberClean = botIds[0] || '';
const senderClean = senderIds[0] || '';
    
    // =============== { Time } ===============//
        const hariini = moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')
        const wib = moment.tz('Asia/Jakarta').format('HH : mm : ss')
        const wit = moment.tz('Asia/Jayapura').format('HH : mm : ss')
        const wita = moment.tz('Asia/Makassar').format('HH : mm : ss')
        let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        const salam = 'Selamat '+dt.charAt(0).toUpperCase() + dt.slice(1)    
        let dot = new Date(new Date + 3600000)
        const novadate = moment.tz('Asia/Jakarta').format('DD/MM/YYYY')

        //==============={ Console Log }===============//
if (command && prefixMatch) {
    const label = isCreator ? 'OWNER' : isPremium ? 'PREM' : 'USER'
    const warnaLabel = isCreator ? chalk.magenta : isPremium ? chalk.yellow : chalk.gray

    console.log(
        chalk.gray('[') + chalk.blue(wib) + chalk.gray(']'),
        warnaLabel.bold(`[${label}]`),
        chalk.cyan.bold(`${prefix}${command}`),
        chalk.gray('dari'),
        chalk.white.bold(pushname),
        chalk.gray(`(${senderNumber})`)
    )
}

    //==============={ Fake Reply }===============//
const reply = (teks) => {
    return nov4.sendMessage(m.chat, { text: teks }, { quoted: m });
};

    // Public or Self
if (!nov4.public && !isCreator) return;

    //==============={ Function Plugin }===============//
const pluginsFolder = path.join(process.cwd(), 'plugins');
const getPluginFiles = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getPluginFiles(filePath));
        } else if (file.endsWith('.js')) {
            results.push(filePath);
        }
    });
    return results;
};

const pluginFiles = getPluginFiles(pluginsFolder);
for (const filePath of pluginFiles) {
    try {
        const pluginPath = pathToFileURL(filePath).href;
        const plugin = await import(`${pluginPath}?update=${Date.now()}`);
        const pluginModule = plugin.default || plugin;
        
        const pluginCmds = pluginModule.command || pluginModule.cmd || pluginModule.help || [];
        const isMatch = Array.isArray(pluginCmds) 
            ? pluginCmds.includes(command) 
            : pluginCmds === command;

        if (isMatch && typeof pluginModule.run === 'function') {
            await pluginModule.run(nov4, m, {
                chatUpdate, store, command, args, text, prefix, q, reply, 
                isOwner, isCreator, isPremium, isGroup, isAdmins, 
                isGroupAdmins, isBotAdmins, groupMetadata, participants, budy
            });
            return;
        } else if (typeof pluginModule === 'function') {
            const executed = await pluginModule(nov4, m, {
                chatUpdate, store, command, args, text, q, reply, 
                isOwner, isCreator, isPremium, isGroup, isAdmins, budy
            });
            if (executed) return;
        }
    } catch (e) {
        console.error(`Error loading plugin ${filePath}:`, e);
    }
}
    
    // Format
function formatSubs(count) {
    if (!count || count === 0) return '0';
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(count);
}
    
function formatNumber(num) {
    if (!num) return '0'
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return String(num)
}

function formatDate(timestamp) {
    if (!timestamp) return '—';
    const d = new Date(typeof timestamp === 'number' && timestamp < 1e12 ? timestamp * 1000 : timestamp);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const date = tanggal(Date.now());

    // Thumbnail
const thumb = await sharp('./lib/media/thumb.jpg')
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toBuffer();
    
switch (command) {
    
case "menu": {
    const statusUser = isCreator
        ? "Owner"
        : isOwner
            ? "Owner"
            : isPremium
                ? "Premium"
                : "Free"

    const modeBot = nov4.public ? "Public" : "Self"

    const info = `
Halo ${pushname}, ${salam} 👋

> INFORMASI BOT

✾ Creator  : ${global.ownerName}
✾ Time     : ${wib} WIB
✾ Status   : ${statusUser}
✾ Mode     : ${modeBot}
✾ Runtime  : ${runtime(process.uptime())}

${readmore}
> OWNER MENU
- ${prefix}get
- ${prefix}join
- ${prefix}leave
- ${prefix}self
- ${prefix}mute
- ${prefix}public
- ${prefix}backup
- ${prefix}delprem
- ${prefix}addprem
- ${prefix}delowner
- ${prefix}addowner
- ${prefix}clearsession

> DOWNLOAD MENU
- ${prefix}fb <url>
- ${prefix}yt <query>
- ${prefix}lirik <query>
- ${prefix}tiktok <url>
- ${prefix}gitclone <url>
- ${prefix}mediafire <url>

> GROUP MENU
- ${prefix}open
- ${prefix}close
- ${prefix}add 628xxx
- ${prefix}kick @user
- ${prefix}demote @user
- ${prefix}promote @user
- ${prefix}tagall <teks>
- ${prefix}antilink
- ${prefix}hidetag <teks>
- ${prefix}setname <nama>
- ${prefix}setdesc <deskripsi>
- ${prefix}resetlink

> MAIN MENU
- ${prefix}ping
- ${prefix}owner

> TOOLS MENU
- ${prefix}tourl
- ${prefix}ssweb
- ${prefix}toimage
- ${prefix}sticker
- ${prefix}skiplink <url>

`.trim()

    await nov4.sendMessage(m.chat, {
        location: {
            degreesLatitude: 0,
            degreesLongitude: 0,
            name: global.botName || 'Nova',
            address: `Menampilkan Menu ${global.botName || 'Nova'}`,
            jpegThumbnail: thumb
        },
        caption: info,
        footer: global.footer || 'nova bot',
        buttons: [
            {
                buttonId: ".sc",
                buttonText: { displayText: "📥 Script" },
                type: 1
            }
        ],
        headerType: 6,
        viewOnce: true,
        contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true
        }
    }, { quoted: m })
}
break

// =============== { Case Owner } ============== //
case 'join': {
    if (!isCreator) return reply(mess.owner)
    if (!text) return reply('Masukan Link Group!')
    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return reply('Link Invalid!')

    const result = args[0].split('https://chat.whatsapp.com/')[1]

    await reply(mess.wait || 'Tunggu sebentar...')

    await nov4.groupAcceptInvite(result).catch((res) => {
        if (res.data == 400) return reply('Group Tidak Di Temukan❗')
        if (res.data == 401) return reply('Bot Telah Di Kick Dari Group Inj❗')
        if (res.data == 409) return reply('Bot Berhasil Bergabung Ke Group❗')
        if (res.data == 410) return reply('Link Group Telah Di Reset❗')
        if (res.data == 500) return reply('Full Member Group❗')
    })
}
break
        
case 'leave':
case 'leavegc':
case 'leavegrup': {
    if (!isCreator) return reply(mess.owner)
    if (isGroup) return reply('Command ini cuma bisa dipakai di private chat.')

    const first = args[0]?.toLowerCase()
    const second = args[1]?.toLowerCase()

    const isJid = first && first.endsWith('@g.us')
    const isConfirm = second === 'yes' || second === 'no'

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const groups = await nov4.groupFetchAllParticipating()
        const entries = Object.entries(groups)

        if (entries.length === 0) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('Bot ga di grup manapun.')
        }

        if (!first) {
            const rows = entries.slice(0, 50).map(([jid, meta]) => ({
                title: (meta.subject || 'Tanpa Nama').slice(0, 60),
                description: `${meta.participants?.length || 0} member`,
                id: `.leave ${jid}`
            }))

            await nov4.sendMessage(m.chat, {
                text: `Bot ada di ${entries.length} grup.\n\nPilih grup yang mau di-leave:`,
                footer: global.footer || 'nova bot',
                buttons: [{
                    buttonId: 'action',
                    buttonText: { displayText: 'Pilih Grup' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'Pilih Grup',
                            sections: [{
                                title: `Daftar Grup (${entries.length})`,
                                rows
                            }]
                        })
                    }
                }],
                headerType: 1
            }, { quoted: m })

            await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            return
        }

        if (!isJid) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('ID grup ga valid.')
        }

        const targetJid = first

        if (!groups[targetJid]) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('Bot ga ada di grup itu.')
        }

        const groupName = groups[targetJid].subject || 'Tanpa Nama'
        const memberCount = groups[targetJid].participants?.length || 0

        if (!isConfirm) {
            await nov4.sendMessage(m.chat, {
                text:
                    `Keluar dari grup ini?\n\n` +
                    `Nama: ${groupName}\n` +
                    `Member: ${memberCount}\n` +
                    `ID: ${targetJid}`,
                footer: global.footer || 'nova bot',
                buttons: [
                    { buttonId: `.leave ${targetJid} yes`, buttonText: { displayText: '✅ Ya, Keluar' }, type: 1 },
                    { buttonId: `.leave ${targetJid} no`,  buttonText: { displayText: '❌ Batal' },       type: 1 }
                ],
                headerType: 1
            }, { quoted: m })

            await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            return
        }

        if (second === 'no') {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('Dibatalkan.')
        }

        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        await nov4.groupLeave(targetJid)

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        await reply(
            `Udah keluar dari:\n\n` +
            `Nama: ${groupName}\n` +
            `ID: ${targetJid}`
        )

    } catch (e) {
        console.error('[LEAVE]', e.message)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`Gagal: ${e.message}`)
    }
}
break
        
case 'del':
case 'delete': {
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!m.quoted) {
        return reply('Reply pesan yang mau dihapus, terus ketik .del')
    }

    try {
        await nov4.sendMessage(m.chat, { delete: m.quoted.key })
    } catch (e) {
        console.error('[DEL]', e.message)
        reply(`Gagal hapus: ${e.message}`)
    }
}
break

case 'mute': {
    if (!isGroup) return reply(mess.group)
    if (!isCreator) return reply(mess.owner)

    const MUTE_PATH = './lib/database/mute.json'

    let muteData = {}
    try {
        muteData = JSON.parse(fs.readFileSync(MUTE_PATH, 'utf-8'))
    } catch {
        muteData = {}
    }

    const chatId = m.chat || from

    if (muteData[chatId]) {
        return reply('🔇 Bot sudah di-mute di grup ini.')
    }

    muteData[chatId] = {
        by: sender,
        at: Date.now(),
        groupName: groupName || '-'
    }

    fs.writeFileSync(MUTE_PATH, JSON.stringify(muteData, null, 2))

    return reply('🔇 *Bot di-mute di grup ini.*\n\n_Bot tidak akan merespon command di grup ini._')
}
break

case 'unmute': {
    if (!isGroup) return reply(mess.group)
    if (!isCreator) return reply(mess.owner)

    const MUTE_PATH = './lib/database/mute.json'

    let muteData = {}
    try {
        muteData = JSON.parse(fs.readFileSync(MUTE_PATH, 'utf-8'))
    } catch {
        muteData = {}
    }

    const chatId = m.chat || from

    if (!muteData[chatId]) {
        return reply('🔊 Bot tidak dalam mode mute di grup ini.')
    }

    delete muteData[chatId]
    fs.writeFileSync(MUTE_PATH, JSON.stringify(muteData, null, 2))

    return reply('🔊 *Bot di-unmute di grup ini.*\n\n_Bot akan merespon command lagi._')
}
break

case 'listmute': {
    if (!isCreator) return reply(mess.owner)

    const MUTE_PATH = './lib/database/mute.json'

    let muteData = {}
    try {
        muteData = JSON.parse(fs.readFileSync(MUTE_PATH, 'utf-8'))
    } catch {
        muteData = {}
    }

    const entries = Object.entries(muteData)

    if (entries.length === 0) {
        return reply('🔊 *Tidak ada grup yang di-mute.*')
    }

    let caption = `🔇 *LIST MUTE*\n\n📊 Total: ${entries.length} grup\n\n`

    entries.forEach(([jid, info], i) => {
        caption += `${i + 1}. ${info.groupName || jid}\n`
        caption += `   📛 ${jid}\n`
        caption += `   👤 by @${info.by?.split('@')[0] || '-'}\n`
        caption += `   🕐 ${new Date(info.at).toLocaleString('id-ID')}\n\n`
    })

    return reply(caption.trim())
}
break

case 'clearsession':
case 'cs':
case 'clearsesi': {
    if (!isCreator) return reply(mess.owner)

    const mode = args[0]?.toLowerCase()
    const sub = args[1]?.toLowerCase()

    if (!mode) {
        const info = sessionInfo()

        const listFiles = info.files
            .sort((a, b) => b.size - a.size)
            .slice(0, 10)
            .map((f, i) => `┃ ${i + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB)`)
            .join('\n')

        return nov4.sendMessage(m.chat, {
            text:
                `🗑️ *CLEAR SESSION*\n\n` +
                `📊 Total file : ${info.total}\n` +
                `💾 Total size : ${info.sizeMB} MB\n\n` +
                `*10 file terbesar:*\n${listFiles || '┃ (kosong)'}\n\n` +
                `_Pilih aksi di bawah 👇_`,
            footer: global.footer || 'nova bot',
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '⚙️ Pilih Aksi' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Clear Session',
                        sections: [
                            {
                                title: '🗑️ Hapus File',
                                highlight_label: 'Rekomendasi',
                                rows: [
                                    {
                                        title: '📁 Info Session',
                                        description: 'Lihat detail session',
                                        id: `.clearsession info`
                                    },
                                    {
                                        title: '🕐 Hapus File Lama',
                                        description: 'Hapus file > 24 jam',
                                        id: `.clearsession old`
                                    },
                                    {
                                        title: '🗑️ Hapus Semua',
                                        description: 'Hapus semua file sampah',
                                        id: `.clearsession all`
                                    }
                                ]
                            },
                            {
                                title: '⚙️ Auto Clear',
                                rows: [
                                    {
                                        title: '✅ Aktifkan Auto Clear',
                                        description: 'Interval 60 menit, max 24 jam',
                                        id: `.clearsession auto on`
                                    },
                                    {
                                        title: '❌ Matikan Auto Clear',
                                        description: 'Stop auto clear',
                                        id: `.clearsession auto off`
                                    }
                                ]
                            }
                        ]
                    })
                }
            }],
            headerType: 1
        }, { quoted: m })
    }

    if (mode === 'info') {
        const info = sessionInfo()
        return reply(
            `📁 *SESSION INFO*\n\n` +
            `📊 Total file : ${info.total}\n` +
            `💾 Total size : ${info.sizeMB} MB`
        )
    }

    if (mode === 'old') {
        await reply('⏳ *Menghapus file lama (> 24 jam)...*')
        const result = clearSession(24 * 60 * 60 * 1000)
        return reply(
            `✅ *CLEAR SESSION — OLD*\n\n` +
            `🗑️ Dihapus  : ${result.deleted} file\n` +
            `💾 Hemat    : ${result.sizeMB} MB\n` +
            `📁 Disisakan: ${result.kept} file`
        )
    }

    if (mode === 'all') {
        if (sub !== 'yes') {
            return nov4.sendMessage(m.chat, {
                text:
                    `⚠️ *KONFIRMASI HAPUS SEMUA*\n\n` +
                    `> Semua file sampah di folder session\n` +
                    `> Akan dihapus permanen\n\n` +
                    `*Yakin mau lanjut?*`,
                footer: global.footer || 'nova bot',
                buttons: [
                    {
                        buttonId: '.clearsession all yes',
                        buttonText: { displayText: '✅ Ya, Hapus' },
                        type: 1
                    },
                    {
                        buttonId: '.clearsession all no',
                        buttonText: { displayText: '❌ Batal' },
                        type: 1
                    }
                ],
                headerType: 1
            }, { quoted: m })
        }

        // Konfirmasi "no" → batal
        if (sub === 'no') {
            return reply('❌ *Hapus semua dibatalkan.*')
        }

        // Eksekusi
        await reply('⏳ *Menghapus semua file sampah...*')
        const result = clearSessionAll()
        return reply(
            `✅ *CLEAR SESSION — ALL*\n\n` +
            `🗑️ Dihapus  : ${result.deleted} file\n` +
            `💾 Hemat    : ${result.sizeMB} MB\n` +
            `📁 Disisakan: ${result.kept} file`
        )
    }

    // ============ AUTO ============
    if (mode === 'auto') {
        if (sub === 'on') {
            startAutoClear(60, 24)
            return reply('✅ *Auto clear AKTIF*\n\n> Interval: 60 menit\n> Max umur: 24 jam')
        }

        if (sub === 'off') {
            const stopped = stopAutoClear()
            return reply(stopped ? '❌ *Auto clear MATI*' : '⚠️ Auto clear belum aktif.')
        }

        return nov4.sendMessage(m.chat, {
            text: `⚙️ *AUTO CLEAR SESSION*\n\n> Atur auto clear otomatis\n\n_Pilih aksi di bawah 👇_`,
            footer: global.footer || 'nova bot',
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '⚙️ Pilih Aksi' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Auto Clear',
                        sections: [{
                            title: '⚙️ Pengaturan',
                            rows: [
                                {
                                    title: '✅ Aktifkan',
                                    description: 'Interval 60 menit, max 24 jam',
                                    id: `.clearsession auto on`
                                },
                                {
                                    title: '❌ Matikan',
                                    description: 'Stop auto clear',
                                    id: `.clearsession auto off`
                                }
                            ]
                        }]
                    })
                }
            }],
            headerType: 1
        }, { quoted: m })
    }

    return reply('❌ Mode tidak valid. Ketik `' + prefix + 'clearsession` untuk bantuan.')
}
break
        
case 'backup': {
    if (!isCreator) return reply(mess.owner)

    let targetJid = sender
    let targetLabel = 'kamu'
    const mentions = m.mentionedJid?.length > 0
        ? m.mentionedJid
        : m.msg?.contextInfo?.mentionedJid?.length > 0
            ? m.msg.contextInfo.mentionedJid
            : []
    if (mentions.length > 0) {
        let rawTarget = mentions[0]
        if (rawTarget.endsWith('@lid') && isGroup) {
            const mentionedClean = rawTarget.split('@')[0].replace(/[^0-9]/g, '')
            const found = participants.find(p =>
                [p.id, p.jid, p.lid].filter(Boolean).some(x =>
                    x.split('@')[0].replace(/[^0-9]/g, '') === mentionedClean
                )
            )
            if (found?.id && found.id.endsWith('@s.whatsapp.net')) {
                rawTarget = found.id
            } else if (found?.jid) {
                rawTarget = found.jid
            }
        }
        targetJid = rawTarget
        targetLabel = `@${targetJid.split('@')[0]}`
    } else if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '')
        if (num.length < 10) return reply('❌ Nomor tidak valid.')
        targetJid = num + '@s.whatsapp.net'
        targetLabel = `@${num}`
    }
    try {
        await nov4.sendMessage(m.chat, { react: { text: '📦', key: m.key } })
        const ls = execSync('ls').toString().split('\n').filter(f =>
            f && f.trim() !== '' &&
            !['node_modules', 'session', 'package-lock.json', 'yarn.lock', 'Backup.zip', '.git'].includes(f)
        )
        execSync(`zip -r Backup.zip ${ls.join(' ')}`, { stdio: 'ignore' })
        if (!fs.existsSync('./Backup.zip')) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Gagal membuat file zip.')
        }
        const zipSize = (fs.statSync('./Backup.zip').size / 1024 / 1024).toFixed(2)
        const zipBuffer = fs.readFileSync('./Backup.zip')
        await nov4.sendMessage(targetJid, {
            document: zipBuffer,
            mimetype: 'application/zip',
            fileName: `Backup_${global.botName || 'nova'}_${Date.now()}.zip`,
            caption:
                `📦 *BACKUP SCRIPT*\n\n` +
                `🤖 Bot     : ${global.botName || 'Nova'}\n` +
                `👤 Owner   : ${pushname}\n` +
                `📅 Tanggal : ${wib}\n` +
                `📊 Ukuran  : ${zipSize} MB\n` +
                `📁 Jumlah  : ${ls.length} file/folder`
        })
        if (targetJid !== m.chat) {
            await reply(`✅ *Backup berhasil dikirim ke ${targetLabel}.*\n\n📊 Size: ${zipSize} MB`)
        }
        try { execSync('rm -rf Backup.zip') } catch {}
        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        console.error('[BACKUP] Error:', e.message)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal backup: ${e.message}`)
        try { execSync('rm -rf Backup.zip') } catch {}
    }
}
break
        
case "addowner":
case "addown": {
    if (!isCreator) return reply(`*khusus owner!*`)
    if (!args[0]) return reply(`*example: ${prefix}addowner 628xxx*`)

    const ownerPath = "./lib/database/owner.json"
    const ownerbot = JSON.parse(fs.readFileSync(ownerPath))

    const target = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const ceknya = await nov4.onWhatsApp(target)
    if (ceknya.length == 0) return reply(`*Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!*`)

    if (ownerbot.includes(target)) return reply(`*${target} sudah jadi owner*`)

    ownerbot.push(target)
    fs.writeFileSync(ownerPath, JSON.stringify(ownerbot, null, 2))
    reply(`*✅ ${target} TELAH MENJADI OWNER*`)
}
break

case "delowner":
case "delown": {
    if (!isCreator) return reply(`*khusus owner!!*`)
    if (!args[0]) return reply(`*example: ${prefix}delowner 628xxx*`)

    const ownerPath = "./lib/database/owner.json"
    const ownerbot = JSON.parse(fs.readFileSync(ownerPath))

    const target = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const unp = ownerbot.indexOf(target)
    if (unp === -1) return reply(`*${target} BUKAN OWNER*`)

    ownerbot.splice(unp, 1)
    fs.writeFileSync(ownerPath, JSON.stringify(ownerbot, null, 2))
    reply(`*✅ ${target} SUDAH BUKAN OWNER*`)
}
break

case "addprem": {
    if (!isCreator) return reply("*❗ AKSES DI TOLAK!!*")
    if (!args[0]) return reply(`❌ BUKAN GITU \n*GINI CARA NYA ✅*\n example: ${prefix}addprem 628xxx`)

    const premPath = "./lib/database/premium.json"
    const premium = JSON.parse(fs.readFileSync(premPath))

    const target = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const ceknya = await nov4.onWhatsApp(target)
    if (ceknya.length == 0) return reply(`*Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!*`)

    if (premium.includes(target)) return reply(`*${target} sudah premium*`)

    premium.push(target)
    fs.writeFileSync(premPath, JSON.stringify(premium, null, 2))
    reply(`*✅ ${target} TELAH MENJADI PREMIUM*`)
}
break

case "delprem": {
    if (!isCreator) return reply("*❗ AKSES DI TOLAK!!*")
    if (!args[0]) return reply(`❌ BUKAN GITU \n*GINI CARA NYA ✅*\n ${prefix}delprem 628xxx`)

    const premPath = "./lib/database/premium.json"
    const premium = JSON.parse(fs.readFileSync(premPath))

    const target = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const unp = premium.indexOf(target)
    if (unp === -1) return reply(`*${target} BUKAN PREMIUM*`)

    premium.splice(unp, 1)
    fs.writeFileSync(premPath, JSON.stringify(premium, null, 2))
    reply(`*✅ ${target} SUDAH BUKAN PREMIUM*`)
}
break

case 'public': { 
if (!isCreator) return reply("*Khusus Owner*");
if (nov4.public === true) return reply("Success To Public Mode");
nov4.public = true
reply("Success To Public Mode");
}
break

case 'self': {
if (!isCreator) return reply("*Khusus Owner*");
if (nov4.public === false) return reply("Success To Self Mode");
nov4.public = false
reply("Success To Self Mode");
}
break
        
// =============== { Case Uploader } ===============//
case 'upvidey':
case 'videyup': {
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''

    if (!/video/.test(mime)) {
        return reply(
            `📤 *UPLOAD KE VIDEY*\n\n` +
            `> Upload video ke Videy.co\n\n` +
            `*Cara pakai:*\n` +
            `> Kirim/balas video dengan caption ${prefix}upvidey\n\n` +
            `*Support:*\n` +
            `• MP4, MKV, MOV\n` +
            `• Max 100 MB\n` +
            `• Durasi max 5 menit`
        )
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        await reply('📤 *Sedang upload ke Videy...*\n\n_Mohon tunggu sebentar._')

        const buffer = await nov4.downloadMediaMessage(quoted)

        if (!buffer || buffer.length === 0) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Gagal download video.')
        }

        if (buffer.length > 100 * 1024 * 1024) {
            await nov4.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return reply('⚠️ Video > 100 MB. Kompres dulu.')
        }

        const ext = mime.split('/')[1]?.split(';')[0] || 'mp4'
        const filename = `nova_${Date.now()}.${ext}`

        const result = await upVidey(buffer, filename)

        if (!result.status) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply(`❌ Gagal upload: ${result.msg}`)
        }

        global.videyUploadCache = global.videyUploadCache || new Map()
        const cacheId = 'vup_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
        global.videyUploadCache.set(cacheId, result)
        setTimeout(() => global.videyUploadCache.delete(cacheId), 30 * 60 * 1000)

        const sizeMB = (buffer.length / 1024 / 1024).toFixed(2)

        await nov4.sendMessage(m.chat, {
            text:
                `✅ *Upload Berhasil*\n\n` +
                `┃ ID      : ${result.id}\n` +
                `┃ Size    : ${sizeMB} MB\n` +
                `┃ Link    : ${result.link}\n` +
                `┃ CDN     : ${result.cdn}\n\n` +
                `_Klik tombol untuk aksi_`,
            footer: global.footer || 'nova bot',
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '📥 Pilih Aksi' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Pilih Aksi',
                        sections: [
                            {
                                title: '🔗 Link',
                                highlight_label: 'Rekomendasi',
                                rows: [
                                    {
                                        title: '📋 Copy Link Videy',
                                        description: 'Copy link halaman videy',
                                        id: `.videyupcopy ${cacheId} link`
                                    },
                                    {
                                        title: '📋 Copy Link CDN',
                                        description: 'Copy link video langsung',
                                        id: `.videyupcopy ${cacheId} cdn`
                                    }
                                ]
                            },
                            {
                                title: '🌐 Buka',
                                rows: [
                                    {
                                        title: '🌐 Buka di Browser',
                                        description: 'Buka link Videy',
                                        id: `.videyupopen ${cacheId}`
                                    },
                                    {
                                        title: '📥 Preview Video',
                                        description: 'Kirim video ke chat',
                                        id: `.videyuppreview ${cacheId}`
                                    }
                                ]
                            },
                            {
                                title: '🔁 Upload Lagi',
                                rows: [
                                    {
                                        title: '📤 Upload Video Lain',
                                        description: 'Kirim video baru',
                                        id: `.upvidey`
                                    }
                                ]
                            }
                        ]
                    })
                }
            }],
            headerType: 1
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Upload Videy error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break
        
case 'videyupcopy': {
    const cacheId = args[0]
    const type = args[1] || 'link'

    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.videyUploadCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    const linkToCopy = type === 'cdn' ? data.cdn : data.link
    const label = type === 'cdn' ? 'CDN Direct' : 'Videy Page'

    try {
        const interactiveMsg = {
            body: {
                text: `📋 *Copy Link ${label}*\n\n${linkToCopy}\n\n_Klik tombol untuk copy_`
            },
            footer: {
                text: global.footer || 'nova bot'
            },
            header: {
                hasMediaAttachment: false
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: `📋 Copy Link ${label}`,
                            id: "copy_link",
                            copy_code: linkToCopy
                        })
                    },
                    
                ],
                messageParamsJson: "{}"
            }
        }

        const from = m.chat

        const generatedMsg = generateWAMessageFromContent(from, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: interactiveMsg
                }
            }
        }, { userJid: from, upload: nov4.waUploadToServer })

        return await nov4.relayMessage(from, generatedMsg.message, {
            messageId: generatedMsg.key.id
        })

    } catch (e) {
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'videyupopen': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.videyUploadCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        await reply(
            `🌐 *Buka Video di Browser*\n\n` +
            `${data.link}\n\n` +
            `_Klik link di atas untuk buka_`
        )

    } catch (e) {
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'videyuppreview': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.videyUploadCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const buffer = await getBuffer(data.cdn)

        if (buffer.length > 64 * 1024 * 1024) {
            await nov4.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return reply('⚠️ Video > 64 MB. Kirim sebagai file.')
        }

        await nov4.sendMessage(m.chat, {
            video: buffer,
            caption: `🎬 *Preview Video*\n\n🔗 ${data.link}`,
            mimetype: 'video/mp4',
            fileName: 'videy.mp4'
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Preview error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break
        
// =============== { Case Downloader } ================//
case 'github':
case 'git':
case 'gh':
case 'gitclone':
case 'ghdl': {
    if (!text) {
        return reply(
            `🐙 *GITHUB DOWNLOADER*\n\n` +
            `> Download repo / file dari GitHub\n` +
            `> Hasil dikirim ke DM kamu\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}github <link>\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}github https://github.com/user/repo\n` +
            `> ${prefix}github https://github.com/user/repo/tree/main\n` +
            `> ${prefix}github https://github.com/user/repo/blob/main/file.js`
        )
    }

    if (!/github\.com/i.test(text)) {
        return reply('❌ Link GitHub tidak valid.')
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        await reply('⏳ *Sedang download dari GitHub...*\n\n_File akan dikirim ke DM kamu._')

        const result = await ghDownload(text)

        if (!result.status) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply(`❌ Gagal: ${result.message}`)
        }

        const info = result.info

        if (result.type === 'file') {
            await nov4.sendMessage(sender, {
                document: result.buffer,
                mimetype: 'application/octet-stream',
                fileName: result.fileName,
                caption:
                    `📄 *${result.fileName}*\n\n` +
                    `🐙 ${info.fullName}\n` +
                    `📊 Size : ${result.size} KB\n` +
                    `🌿 Branch : ${info.branch}\n` +
                    `🔗 ${info.htmlUrl}\n\n` +
                    `_Downloaded by ${global.botName || 'Nova'}_`
            })

            await nov4.sendMessage(m.chat, {
                text:
                    `✅ *File terkirim ke DM kamu*\n\n` +
                    `📄 ${result.fileName}\n` +
                    `📊 Size: ${result.size} KB\n\n` +
                    `_Cek DM untuk download_`
            }, { quoted: m })

        } else {
            await nov4.sendMessage(sender, {
                document: result.buffer,
                mimetype: 'application/zip',
                fileName: result.fileName,
                caption:
                    `🐙 *${info.fullName}*\n\n` +
                    `📝 ${info.description}\n\n` +
                    `┃ ⭐ Stars    : ${info.stars}\n` +
                    `┃ 🍴 Forks    : ${info.forks}\n` +
                    `┃ 💻 Language : ${info.language}\n` +
                    `┃ 📦 Size     : ${result.size} MB\n` +
                    `┃ 🌿 Branch   : ${info.branch}\n\n` +
                    `🔗 ${info.htmlUrl}\n` +
                    `📋 Clone : \`${info.cloneUrl}\`\n\n` +
                    `_Downloaded by ${global.botName || 'Nova'}_`
            })

            await nov4.sendMessage(m.chat, {
                text:
                    `✅ *Repo terkirim ke DM kamu*\n\n` +
                    `🐙 ${info.fullName}\n` +
                    `📦 Size: ${result.size} MB\n` +
                    `🌿 Branch: ${info.branch}\n\n` +
                    `_Cek DM untuk download_`
            }, { quoted: m })
        }

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('GitHub error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'videy':
case 'videydl': {
    if (!text) {
        return reply(
            `🎬 *VIDEY DOWNLOADER*\n\n` +
            `> Download video dari Videy.co\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}videy <link>\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}videy https://videy.co/v?id=xxxxx\n\n` +
            `*Support format:*\n` +
            `• https://videy.co/v?id=xxx\n` +
            `• https://videy.co/xxx`
        )
    }

    if (!/videy\.co/i.test(text)) {
        return reply('❌ Link Videy tidak valid.\n\n> Contoh: https://videy.co/v?id=xxxxx')
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        await reply('⏳ *Mengambil video dari Videy...*')

        const data = await videy(text)

        if (!data.status) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply(`❌ Gagal: ${data.message}`)
        }

        global.videyCache = global.videyCache || new Map()
        const cacheId = 'vdy_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
        global.videyCache.set(cacheId, data)
        setTimeout(() => global.videyCache.delete(cacheId), 10 * 60 * 1000)

        const caption =
            `🎬 *${data.title}*\n\n` +
            (data.description ? `📝 ${data.description.slice(0, 200)}\n\n` : '') +
            `🔗 ${data.originalUrl}\n\n` +
            `Pilih aksi di bawah 👇`

        const media = data.thumbnail
            ? { image: { url: data.thumbnail }, caption }
            : { text: caption }

        await nov4.sendMessage(m.chat, {
            ...media,
            footer: `${global.botName || 'Nova'} Videy`,
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '📥 Pilih Download' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Pilih Aksi',
                        sections: [
                            {
                                title: '📥 Download',
                                highlight_label: 'Rekomendasi',
                                rows: [
                                    {
                                        title: '🎬 Download Video',
                                        description: 'Kirim video ke chat',
                                        id: `.videyvideo ${cacheId}`
                                    },
                                    {
                                        title: '📁 Kirim sebagai File',
                                        description: 'Kirim sebagai document',
                                        id: `.videyfile ${cacheId}`
                                    }
                                ]
                            },
                            {
                                title: '🔗 Link',
                                rows: [
                                    {
                                        title: '📋 Copy Link Video',
                                        description: 'Copy link download langsung',
                                        id: `.videylink ${cacheId}`
                                    },
                                    {
                                        title: '🌐 Buka di Browser',
                                        description: 'Buka video di browser',
                                        id: `.videyopen ${cacheId}`
                                    }
                                ]
                            }
                        ]
                    })
                }
            }],
            headerType: data.thumbnail ? 4 : 1
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Videy error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break
        
case 'videyvideo': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.videyCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const buffer = await getBuffer(data.videoUrl)

        if (buffer.length > 64 * 1024 * 1024) {
            await nov4.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return reply('⚠️ Video > 64 MB. Pakai "📁 Kirim sebagai File".')
        }

        await nov4.sendMessage(m.chat, {
            video: buffer,
            caption: `🎬 *${data.title}*\n\n🔗 ${data.originalUrl}`,
            mimetype: 'video/mp4',
            fileName: 'videy.mp4'
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Videy video error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'videyfile': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.videyCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const buffer = await getBuffer(data.videoUrl)
        const sizeMB = (buffer.length / 1024 / 1024).toFixed(2)

        await nov4.sendMessage(m.chat, {
            document: buffer,
            mimetype: 'video/mp4',
            fileName: `${data.title.replace(/[^\w\s]/g, '') || 'videy'}.mp4`,
            caption: `📁 *${data.title}*\n\n📊 Size: ${sizeMB} MB\n🔗 ${data.originalUrl}`
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Videy file error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'videylink': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.videyCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        await nov4.sendMessage(m.chat, {
            text:
                `🔗 *Link Video*\n\n` +
                `📥 Download: ${data.videoUrl}\n\n` +
                `🎬 Original: ${data.originalUrl}\n\n` +
                `_Klik tombol untuk copy_`,
            footer: global.footer || 'nova bot',
            buttons: [
                {
                    buttonId: 'action',
                    buttonText: { displayText: '📋 Copy Link Video' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'cta_copy',
                        paramsJson: JSON.stringify({
                            display_text: '📋 Copy Link Video',
                            copy_code: data.videoUrl
                        })
                    }
                },
                {
                    buttonId: 'action',
                    buttonText: { displayText: '📋 Copy Link Original' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'cta_copy',
                        paramsJson: JSON.stringify({
                            display_text: '📋 Copy Link Original',
                            copy_code: data.originalUrl
                        })
                    }
                }
            ],
            headerType: 1
        }, { quoted: m })

    } catch (e) {
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'videyopen': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.videyCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        await reply(
            `🌐 *Buka Video di Browser*\n\n` +
            `🎬 ${data.title}\n\n` +
            `${data.videoUrl}\n\n` +
            `_Klik link di atas untuk buka_`
        )

    } catch (e) {
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'mediafire':
case 'mf':
case 'mediafiredl': {
    if (!text) return reply(
        `📁 *ᴍᴇᴅɪᴀғɪʀᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n` +
        `> Download file dari Mediafire\n\n` +
        `*Cara pakai:*\n` +
        `> ${prefix}mediafire https://www.mediafire.com/file/xxx`
    )

    if (!/mediafire\.com/i.test(text)) {
        return reply('❌ *Link tidak valid!*')
    }

    await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    await reply('⏳ *Sedang memproses...*')

    try {
        const _mfPageRes = await axios.get(text.trim(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://www.mediafire.com/'
            },
            timeout: 30000
        })

        const _mf$ = load(_mfPageRes.data)

        let _mfDownloadUrl = _mf$('a#downloadButton').attr('href') || ''
        if (!_mfDownloadUrl) _mfDownloadUrl = _mf$('a.input.popsok').attr('href') || ''
        if (!_mfDownloadUrl) {
            const _mfMatch = _mfPageRes.data.match(/href="(https?:\/\/download[^"]+)"/i)
            if (_mfMatch) _mfDownloadUrl = _mfMatch[1]
        }

        if (!_mfDownloadUrl) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Gagal menemukan link download.')
        }

        const _mfFileName = _mf$('.dl-btn-label').first().text().trim() ||
            _mf$('.filename').first().text().trim() ||
            _mfDownloadUrl.split('/').pop().split('?')[0] || 'unknown_file'

        const _mfExt = _mfFileName.split('.').pop().toLowerCase()

        let _mfMimeType = 'application/octet-stream'
        const _mfMimeMap = {
            'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif',
            'webp': 'image/webp', 'mp4': 'video/mp4', 'mkv': 'video/x-matroska',
            'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg',
            'pdf': 'application/pdf', 'zip': 'application/zip', 'rar': 'application/x-rar-compressed',
            'apk': 'application/vnd.android.package-archive'
        }
        if (_mfMimeMap[_mfExt]) _mfMimeType = _mfMimeMap[_mfExt]

        const _mfFileBuffer = await axios.get(_mfDownloadUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.mediafire.com/'
            },
            timeout: 120000,
            maxContentLength: 200 * 1024 * 1024,
            maxBodyLength: 200 * 1024 * 1024
        })

        const _mfBuffer = Buffer.from(_mfFileBuffer.data)
        const _mfActualSize = (_mfBuffer.length / (1024 * 1024)).toFixed(2)

        const _mfCaption =
            `📁 *ᴍᴇᴅɪᴀғɪʀᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n` +
            `┃ • Nama: *${_mfFileName}*\n` +
            `┃ • Format: *${_mfExt.toUpperCase()}*\n` +
            `┃ • Ukuran: *${_mfActualSize} MB*\n\n` +
            `_Powered by ${global.botName || 'Nova'}_`

        const _mfImageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
        const _mfVideoExts = ['mp4', 'mkv', 'avi', 'mov', 'webm']
        const _mfAudioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']

        if (_mfImageExts.includes(_mfExt) && _mfBuffer.length < 16 * 1024 * 1024) {
            await nov4.sendMessage(m.chat, { image: _mfBuffer, caption: _mfCaption }, { quoted: m })
        } else if (_mfVideoExts.includes(_mfExt) && _mfBuffer.length < 100 * 1024 * 1024) {
            await nov4.sendMessage(m.chat, { video: _mfBuffer, caption: _mfCaption, mimetype: 'video/mp4' }, { quoted: m })
        } else if (_mfAudioExts.includes(_mfExt) && _mfBuffer.length < 16 * 1024 * 1024) {
            await nov4.sendMessage(m.chat, { audio: _mfBuffer, mimetype: _mfMimeType }, { quoted: m })
            await reply(_mfCaption)
        } else {
            await nov4.sendMessage(m.chat, {
                document: _mfBuffer,
                mimetype: _mfMimeType,
                fileName: _mfFileName,
                caption: _mfCaption
            }, { quoted: m })
        }

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Error: ${e.message.slice(0, 200)}`)
    }
}
break
        
case 'tiktok':
case 'tt':
case 'ttdl': {

    if (!args[0]) {
        return reply(`🎬 *TikTok Downloader*\n\n> ${prefix}tiktok <link>`)
    }

    if (!/tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/i.test(args[0])) {
        return reply('❌ Link TikTok tidak valid.')
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const data = await tiktok(args[0])

        if (!data || (!data.no_watermark && !data.images?.length)) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Gagal mengambil data TikTok.')
        }

        const adaGambar = Array.isArray(data.images) && data.images.length > 0
        const audioUrl = data.music?.play || data.music

        if (!adaGambar && data.no_watermark) {
            const videoBuffer = await getBuffer(data.no_watermark)

            await nov4.sendMessage(m.chat, {
                video: videoBuffer,
                caption: `🎬 ${data.title || 'TikTok'}\n🎵 ${data.music?.title || '-'}`,
                mimetype: 'video/mp4',
                fileName: `tiktok_${Date.now()}.mp4`
            }, { quoted: m })

            if (audioUrl) {
                try {
                    const audioBuffer = await getBuffer(audioUrl)
                    await nov4.sendMessage(m.chat, {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        fileName: `${data.music?.title || 'tiktok'}.mp3`,
                        ptt: false
                    }, { quoted: m })
                } catch (err) {
                    console.error('[TikTok] Audio:', err.message)
                }
            }

            await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            return
        }

        await nov4.sendMessage(m.chat, {
            image: { url: data.cover },
            caption: `🎬 ${data.title || 'TikTok'}\n📸 ${data.images.length} gambar`,
            mimetype: 'image/jpeg'
        }, { quoted: m })

        for (let i = 0; i < data.images.length; i++) {
            try {
                await nov4.sendMessage(m.chat, { image: { url: data.images[i] } })
            } catch (err) {
                console.error(`[TikTok] Gambar ${i + 1}:`, err.message)
            }
        }

        if (audioUrl) {
            try {
                const audioBuffer = await getBuffer(audioUrl)
                await nov4.sendMessage(m.chat, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${data.music?.title || 'tiktok'}.mp3`,
                    ptt: false
                }, { quoted: m })
            } catch (err) {
                console.error('[TikTok] Audio:', err.message)
            }
        }

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('[TikTok] Error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break
        
case "youtube":
case "yt":
case "play": {
    if (!args[0]) {
        return reply(
            `🎬 *YouTube Downloader*\n\n` +
            `*Cari video:*\n` +
            `${prefix}play <judul>\n\n` +
            `*Atau kirim link:*\n` +
            `${prefix}play https://youtu.be/xxxxx`
        )
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const query = args.join(' ')
        const isLink = /youtube\.com|youtu\.be/i.test(query)

        let url

        if (isLink) {
            url = query
        } else {
            const hasil = await ytSearch(query, 5)
            if (!hasil || hasil.length === 0) {
                await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return reply('❌ Tidak ada hasil.')
            }

            global.ytSearchCache = global.ytSearchCache || new Map()
            const cacheId = 'yts_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
            global.ytSearchCache.set(cacheId, hasil)
            setTimeout(() => global.ytSearchCache.delete(cacheId), 5 * 60 * 1000)

            const rows = hasil.map((v, i) => ({
                title: `${i + 1}. ${v.title.slice(0, 40)}`,
                description: `${v.channel} • ${v.duration} • ${v.views}`,
                id: `.ytplay ${cacheId} ${i}`
            }))

            await nov4.sendMessage(m.chat, {
                text: `🔍 *Hasil pencarian:* ${query}\n\nPilih video di bawah 👇`,
                footer: `${global.botName || 'Nova'} YouTube`,
                buttons: [{
                    buttonId: 'action',
                    buttonText: { displayText: '▶️ Pilih Video' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'Pilih Video',
                            sections: [{ title: 'Hasil Pencarian', rows }]
                        })
                    }
                }],
                headerType: 1
            }, { quoted: m })

            await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            return
        }

        global.ytLinkCache = global.ytLinkCache || new Map()
        const cacheId = 'yt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
        global.ytLinkCache.set(cacheId, { url })
        setTimeout(() => global.ytLinkCache.delete(cacheId), 10 * 60 * 1000)

        await nov4.sendMessage(m.chat, {
            text: `🎬 *YouTube Downloader*\n\nPilih format download 👇`,
            footer: `${global.botName || 'Nova'} YouTube`,
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '📥 Pilih Format' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Format',
                        sections: [{
                            title: 'Download',
                            rows: [
                                { title: '🎬 Video 360p', description: 'Download video + audio', id: `.ytdl_video ${cacheId} 360` },
                                { title: '🎬 Video 720p', description: 'Download video HD', id: `.ytdl_video ${cacheId} 720` },
                                { title: '🎵 Audio (MP3)', description: 'Download audio saja', id: `.ytdl_audio ${cacheId}` }
                            ]
                        }]
                    })
                }
            }],
            headerType: 1
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('YT error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case "ytplay": {
    const cacheId = args[0]
    const index = parseInt(args[1])

    if (!cacheId || isNaN(index)) return reply('❌ Sesi tidak valid.')

    const hasil = global.ytSearchCache?.get(cacheId)
    if (!hasil || !hasil[index]) return reply('❌ Sesi kadaluarsa. Cari ulang.')

    const video = hasil[index]

    global.ytLinkCache = global.ytLinkCache || new Map()
    const playId = 'ytp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
    global.ytLinkCache.set(playId, { url: video.url, title: video.title })
    setTimeout(() => global.ytLinkCache.delete(playId), 10 * 60 * 1000)

    await nov4.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption:
            `🎬 *${video.title}*\n\n` +
            `👤 ${video.channel}\n` +
            `⏱ ${video.duration}\n` +
            `👁 ${video.views}\n\n` +
            `Pilih format download 👇`,
        footer: `${global.botName || 'Nova'} YouTube`,
        buttons: [{
            buttonId: 'action',
            buttonText: { displayText: '📥 Pilih Format' },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: 'Format',
                    sections: [{
                        title: 'Download',
                        rows: [
                            { title: '🎬 Video 360p', description: 'Download video', id: `.ytdl_video ${playId} 360` },
                            { title: '🎬 Video 720p', description: 'Download video HD', id: `.ytdl_video ${playId} 720` },
                            { title: '🎵 Audio (MP3)', description: 'Download audio', id: `.ytdl_audio ${playId}` }
                        ]
                    }]
                })
            }
        }],
        headerType: 4
    }, { quoted: m })
}
break

case "ytdl_video": {
    const cacheId = args[0]
    const quality = args[1] || '360'

    if (!cacheId) return reply('❌ ID tidak valid.')

    const video = global.ytLinkCache?.get(cacheId)
    if (!video) return reply('❌ Sesi kadaluarsa.')

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const data = await ytdlAuto(video.url, quality)

        if (!data || !data.status || !data.download_url) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Semua server gagal.')
        }

        const buffer = await getBuffer(data.download_url)

        if (buffer.length > 64 * 1024 * 1024) {
            await nov4.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
            return reply('⚠️ Video terlalu besar (>64 MB).')
        }

        await nov4.sendMessage(m.chat, {
            video: buffer,
            caption: `🎬 *${data.title || video.title || 'YouTube'}*\n\n📺 ${quality}p`,
            mimetype: 'video/mp4',
            fileName: 'youtube.mp4'
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('YT video error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case "ytdl_audio": {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ ID tidak valid.')

    const video = global.ytLinkCache?.get(cacheId)
    if (!video) return reply('❌ Sesi kadaluarsa.')

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const data = await ytdlAuto(video.url, 'audio')

        if (!data || !data.status || !data.download_url) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Semua server gagal.')
        }

        const buffer = await getBuffer(data.download_url)

        await nov4.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${data.title || video.title || 'youtube'}.mp3`,
            ptt: false
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('YT audio error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break



case 'lirikaudio': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.lyricsCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa. Cari lirik ulang.')

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        await reply(`🎵 *Mencari audio...*\n\n_${data.trackName} — ${data.artistName}_`)

        const query = `${data.trackName} ${data.artistName}`
        const hasil = await ytSearch(query, 1)

        if (!hasil || hasil.length === 0) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Audio tidak ditemukan.')
        }

        const video = hasil[0]
        const dl = await ytdlAuto(video.url, 'audio')

        if (!dl || !dl.status || !dl.download_url) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Gagal download audio.')
        }

        const buffer = await getBuffer(dl.download_url)

        await nov4.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${data.trackName}.mp3`,
            ptt: false
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Lirik audio error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'lirikvideo': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.lyricsCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const query = `${data.trackName} ${data.artistName}`
        const hasil = await ytSearch(query, 1)

        if (!hasil || hasil.length === 0) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Video tidak ditemukan.')
        }

        const video = hasil[0]

        global.ytLinkCache = global.ytLinkCache || new Map()
        const playId = 'ytp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
        global.ytLinkCache.set(playId, { url: video.url, title: video.title })
        setTimeout(() => global.ytLinkCache.delete(playId), 10 * 60 * 1000)

        await nov4.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption:
                `🎬 *${video.title}*\n\n` +
                `👤 ${video.channel}\n` +
                `⏱ ${video.duration}\n` +
                `👁 ${video.views}\n\n` +
                `Pilih format download 👇`,
            footer: `${global.botName || 'Nova'} YouTube`,
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '📥 Pilih Format' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Format',
                        sections: [{
                            title: 'Download',
                            rows: [
                                { title: '🎬 Video 360p', description: 'Download video', id: `.ytdl_video ${playId} 360` },
                                { title: '🎬 Video 720p', description: 'Download video HD', id: `.ytdl_video ${playId} 720` },
                                { title: '🎵 Audio (MP3)', description: 'Download audio', id: `.ytdl_audio ${playId}` }
                            ]
                        }]
                    })
                }
            }],
            headerType: 4
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Lirik video error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'lirikfile': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.lyricsCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    try {
        const fullText =
            `🎵 ${data.trackName}\n` +
            `👤 ${data.artistName}\n` +
            `💿 ${data.albumName}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n\n` +
            `${data.lyrics}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `© ${global.botName || 'Nova'} Lyrics`

        await nov4.sendMessage(m.chat, {
            document: Buffer.from(fullText, 'utf-8'),
            mimetype: 'text/plain',
            fileName: `${data.trackName.replace(/[^\w\s]/g, '')}_lyrics.txt`,
            caption: `📄 *Full Lirik*\n\n🎵 ${data.trackName}\n👤 ${data.artistName}\n📝 ${data.lyrics.length} karakter`
        }, { quoted: m })

    } catch (e) {
        console.error('Lirik file error:', e)
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 'lirikgoogle': {
    const cacheId = args[0]
    if (!cacheId) return reply('❌ Sesi tidak valid.')

    const data = global.lyricsCache?.get(cacheId)
    if (!data) return reply('❌ Sesi kadaluarsa.')

    const url = `https://www.google.com/search?q=${encodeURIComponent(data.trackName + ' ' + data.artistName + ' lyrics')}`

    try {
        await reply(
            `🔍 *Cari Lirik di Google*\n\n` +
            `🎵 ${data.trackName} — ${data.artistName}\n\n` +
            `${url}\n\n` +
            `_Klik link di atas untuk buka Google_`
        )

    } catch (e) {
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

//============={ case other }=============//
case 'owner':
case 'ownerlist': {
    const ownerNumber = global.owner?.[0] || global.ownerName || botNumberClean
    const cleanNumber = String(ownerNumber).replace(/[^0-9]/g, '')
    if (!cleanNumber) {
        return reply('Nomor owner belum diset.')
    }
    const vcard =
        `BEGIN:VCARD\n` +
        `VERSION:3.0\n` +
        `FN:${global.ownerName || 'Owner'}\n` +
        `ORG:${global.botName || 'Nova'} Owner\n` +
        `TEL;type=CELL;type=VOICE;waid=${cleanNumber}:+${cleanNumber}\n` +
        `END:VCARD`
    try {
        await nov4.sendMessage(m.chat, {
            contacts: {
                displayName: global.ownerName || 'Owner',
                contacts: [{ vcard }]
            }
        }, { quoted: m })
        const interactiveMsg = {
            body: {
                text:
                    `Itu kontak owner.\n\n` +
                    `Kalau ada perlu apa-apa, chat langsung aja.\n` +
                    `Jangan spam ya.`
            },
            footer: {
                text: global.footer || 'nova bot'
            },
            header: {
                hasMediaAttachment: false
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: `📋 Copy Nomor Owner`,
                            id: "copy_owner",
                            copy_code: cleanNumber
                        })
                    }
                ],
                messageParamsJson: "{}"
            }
        }
        const generatedMsg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: interactiveMsg
                }
            }
        }, { userJid: m.chat, upload: nov4.waUploadToServer })
        return await nov4.relayMessage(m.chat, generatedMsg.message, {
            messageId: generatedMsg.key.id
        })
    } catch (e) {
        console.error('[OWNER]', e.message)
        reply(`Gagal kirim kontak: ${e.message}`)
    }
}
break
  
case 'ping':
case 'pinglive': {
    try {
        const start = Date.now()

        await nov4.sendMessage(m.chat, { react: { text: '🏓', key: m.key } })

        const end = Date.now()
        const latency = end - start

        const messageTime = Date.now() - (Number(m.messageTimestamp) * 1000)

        const uptime = process.uptime()
        const jam = Math.floor(uptime / 3600)
        const menit = Math.floor((uptime % 3600) / 60)
        const detik = Math.floor(uptime % 60)

        const uptimeStr = jam > 0
            ? `${jam} jam ${menit} menit`
            : menit > 0
                ? `${menit} menit ${detik} detik`
                : `${detik} detik`

        const mem = process.memoryUsage()
        const heapUsed = (mem.heapUsed / 1024 / 1024).toFixed(1)
        const rss = (mem.rss / 1024 / 1024).toFixed(1)

        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1)
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1)
        const usedMem = (totalMem - freeMem).toFixed(1)

        const cpuModel = os.cpus()?.[0]?.model?.split(' ').slice(0, 3).join(' ') || 'Unknown'
        const cpuCores = os.cpus()?.length || 0

        const osUptime = os.uptime()
        const osHari = Math.floor(osUptime / 86400)
        const osJam = Math.floor((osUptime % 86400) / 3600)
        const osUptimeStr = osHari > 0 ? `${osHari} hari ${osJam} jam` : `${osJam} jam`

        const text =
            `*Ping*\n\n` +
            `Latency      : ${latency} ms\n` +
            `Respon       : ${messageTime} ms\n` +
            `Uptime bot   : ${uptimeStr}\n` +
            `Uptime host  : ${osUptimeStr}\n\n` +
            `*Server*\n` +
            `Platform     : ${os.platform()} ${os.arch()}\n` +
            `Node.js      : ${process.version}\n` +
            `CPU          : ${cpuModel} (${cpuCores} core)\n\n` +
            `*Memori*\n` +
            `Heap         : ${heapUsed} MB\n` +
            `RSS          : ${rss} MB\n` +
            `RAM          : ${usedMem} / ${totalMem} GB`

        await nov4.sendMessage(m.chat, { text }, { quoted: m })

    } catch (e) {
        console.error('[PING]', e.message)
        reply(`Gagal: ${e.message}`)
    }
}
break

case 'sc':
case 'script':
case 'getsc': {
    const scriptUrl = 'https://github.com/ZoraHost/Nova-Bot/'
    const body =
        `Halo ${pushname}!\n\n` +
        `Simple Script Nova Bot ` +
        `Dibuat menggunakan Baileys, ESM, dan plugin system.\n\n` +
        `Fitur:\n` +
        `- ESM modern\n` +
        `- Hot reload plugin\n` +
        `- Multi API fallback\n` +
        `- Case + plugin system\n` +
        `- Ringan`
    try {
        const media = await prepareWAMessageMedia(
            { image: thumb, mimetype: 'image/jpeg' },
            { upload: nov4.waUploadToServer }
        )
        const interactiveMsg = {
            body: { text: 'Script Nova Bot' },
            footer: { text: body },
            header: {
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: 'Buka Script',
                            url: scriptUrl,
                            merchant_url: 'https://github.com'
                        })
                    },
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📋 Copy Link Script',
                            id: 'copy_script',
                            copy_code: scriptUrl
                        })
                    }
                ],
                messageParamsJson: '{}'
            }
        }
        const generatedMsg = generateWAMessageFromContent(from, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: interactiveMsg
                }
            }
        }, { userJid: from, upload: nov4.waUploadToServer })

        return await nov4.relayMessage(from, generatedMsg.message, {
            messageId: generatedMsg.key.id
        })

    } catch (e) {
        console.log(e)
        reply(`Gagal kirim: ${e.message}`)
    }
}
break

// =============== { Case Tools } =============== //
case 'ssweb': {
    if (!text) return reply(`Example: ${prefix + command} https://example.com/xxxxxxx`)

    try {
        let buf

        if (!text.startsWith('http')) {
            buf = `https://image.thum.io/get/width/1900/crop/1000/fullpage/https://${text}`
        } else {
            buf = `https://image.thum.io/get/width/1900/crop/1000/fullpage/${text}`
        }

        await nov4.sendMessage(m.chat, {
            image: { url: buf },
            caption: mess.done || 'Done'
        }, { quoted: m })

    } catch (e) {
        console.error('[SSWEB]', e.message)
        reply(mess.error || 'Error')
    }
}
break
        
case 'toimg':
case 'toimage':
case 'unsticker': {
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''

    if (!/webp/.test(mime)) {
        return reply('Reply sticker-nya, terus ketik .toimg')
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const buffer = await nov4.downloadMediaMessage(quoted)

        await nov4.sendMessage(m.chat, {
            image: buffer
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('[TOIMG]', e.message)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply('Gagal convert. Coba lagi.')
    }
}
break
        
case 'lirik':
case 'lyrics':
case 'lyric': {
    if (!text) {
        return reply(
            `🎵 *LYRICS SEARCH*\n\n` +
            `> Cari lirik lagu + audio\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}lirik <judul lagu>\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}lirik Shape of You`
        )
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

        const result = await Lyrics.auto(text)

        if (!result.success) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply(`❌ Lirik tidak ditemukan untuk: *${text}*`)
        }

        const { trackName, artistName, albumName, duration, lyrics } = result.data

        if (!lyrics || lyrics.trim().length === 0) {
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            return reply('❌ Lirik kosong.')
        }

        global.lyricsCache = global.lyricsCache || new Map()
        const cacheId = 'lrc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
        global.lyricsCache.set(cacheId, { trackName, artistName, albumName, lyrics })
        setTimeout(() => global.lyricsCache.delete(cacheId), 10 * 60 * 1000)

        const durationText = duration
            ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`
            : '—'

        const lyricsPreview = lyrics.length > 800
            ? lyrics.slice(0, 800) + '\n\n... (lirik lengkap di file)'
            : lyrics

        await nov4.sendMessage(m.chat, {
            text:
                `🎵 *${trackName}*\n\n` +
                `👤 ${artistName}\n` +
                `💿 ${albumName}\n` +
                `⏱ ${durationText}\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                `${lyricsPreview}\n\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                `_Pilih aksi di bawah 👇_`,
            footer: `${global.botName || 'Nova'} Lyrics`,
            buttons: [{
                buttonId: 'action',
                buttonText: { displayText: '🎵 Pilih Aksi' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Pilih Aksi',
                        sections: [
                            {
                                title: '🎵 Audio & Video',
                                highlight_label: 'Rekomendasi',
                                rows: [
                                    {
                                        title: '🎵 Download Audio',
                                        description: 'Download MP3 dari YouTube',
                                        id: `.lirikaudio ${cacheId}`
                                    },
                                    {
                                        title: '🎬 Video Musik',
                                        description: 'Cari video musik di YouTube',
                                        id: `.lirikvideo ${cacheId}`
                                    }
                                ]
                            },
                            {
                                title: '📋 Lirik',
                                rows: [
                                    {
                                        title: '📄 Full Lirik (.txt)',
                                        description: 'Download lirik lengkap sebagai file',
                                        id: `.lirikfile ${cacheId}`
                                    }
                                ]
                            },
                            {
                                title: '🔍 Lainnya',
                                rows: [
                                    {
                                        title: '🔍 Cari di Google',
                                        description: 'Buka pencarian Google',
                                        id: `.lirikgoogle ${cacheId}`
                                    },
                                    {
                                        title: '🔁 Cari Ulang',
                                        description: 'Cari lirik dengan judul lain',
                                        id: `.lirik ${trackName}`
                                    }
                                ]
                            }
                        ]
                    })
                }
            }],
            headerType: 1
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('Lyrics error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal: ${e.message}`)
    }
}
break

case 's':
case 'sticker':
case 'stiker': {
    const packname = global.packName || global.botName || 'Nova'
    const author = global.author || 'Zora'

    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''

    if (!/image|video|webp/.test(mime)) {
        return reply('❌ Reply atau kirim gambar/video/sticker!')
    }

    try {
        nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const media = await nov4.downloadMediaMessage(quoted)

        let webpBuf
        if (/webp/.test(mime)) webpBuf = media
        else if (/image/.test(mime)) webpBuf = await imageToWebp(media)
        else if (/video/.test(mime)) webpBuf = await videoToWebp(media)

        const stickerBuf = await addExif(webpBuf, packname, author, ['🤖'])
        await nov4.sendMessage(m.chat, { sticker: stickerBuf }, { quoted: m })
        nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (err) {
        console.error('[sticker]', err)
        nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply('❌ Gagal: ' + err.message)
    }
}
break;

// =============== { Case Group } ============== //
case 'add':
case 'tambah': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!args[0]) {
        return reply(
            `➕ *ADD MEMBER*\n\n` +
            `> Tambah member ke grup\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}add 628xxx\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}add 628123456789\n\n` +
            `_Nomor harus pakai format 62xxx_`
        )
    }

    const target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const targetClean = args[0].replace(/[^0-9]/g, '')

    if (targetClean.length < 10) {
        return reply('❌ Nomor tidak valid. Minimal 10 digit.')
    }

    const isAlreadyMember = participants.some(p => ids(p).includes(targetClean))
    if (isAlreadyMember) return reply(`❌ @${targetClean} sudah ada di grup.`)

    try {
        const res = await nov4.groupParticipantsUpdate(m.chat, [target], 'add')
        const status = res?.[0]?.status

        if (status === '200') {
            await reply(`✅ Berhasil tambah @${targetClean} ke grup.`)
        } else if (status === '403') {
            await reply(`⚠️ Tidak bisa tambah @${targetClean}.\n\n_Privacy user menolak._`)
        } else if (status === '408') {
            await reply(`⚠️ Tidak bisa tambah @${targetClean}.\n\n_User sudah keluar dari grup._`)
        } else if (status === '409') {
            await reply(`⚠️ Tidak bisa tambah @${targetClean}.\n\n_User sudah di grup._`)
        } else {
            await reply(`✅ Permintaan add @${targetClean} terkirim.`)
        }
    } catch (e) {
        reply(`❌ Gagal add: ${e.message}`)
    }
}
break
        
case 'kick':
case 'tendang': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    const mentions = m.mentionedJid?.length > 0
        ? m.mentionedJid
        : m.msg?.contextInfo?.mentionedJid?.length > 0
            ? m.msg.contextInfo.mentionedJid
            : m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0
                ? m.message.extendedTextMessage.contextInfo.mentionedJid
                : []

    let target = null

    if (mentions.length > 0) {
        target = mentions[0]
    } else if (m.quoted) {
        target = m.quoted.sender
    } else if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '')
        if (num.length < 10) return reply('❌ Nomor tidak valid.')
        target = num + '@s.whatsapp.net'
    } else {
        return reply(
            `👢 *KICK MEMBER*\n\n` +
            `> ${prefix}kick @user\n` +
            `> ${prefix}kick (balas pesan)\n` +
            `> ${prefix}kick 628xxx`
        )
    }

    const targetClean = target.split('@')[0].replace(/[^0-9]/g, '')

    if (targetClean === botNumberClean) return reply('❌ Tidak bisa kick bot.')
    if (targetClean === senderClean) return reply('❌ Tidak bisa kick diri sendiri.')

    const isTargetAdmin = groupAdmins.some(p => ids(p).includes(targetClean))
    if (isTargetAdmin) return reply('❌ Tidak bisa kick admin.')

    const isMember = participants.some(p => ids(p).includes(targetClean))
    if (!isMember) return reply(`❌ @${targetClean} bukan member grup.`)

    try {
        let res

        if (typeof nov4.groupParticipantsUpdate === 'function') {
            res = await nov4.groupParticipantsUpdate(m.chat, [target], 'remove')
        } else if (typeof nov4.updateGroupParticipants === 'function') {
            res = await nov4.updateGroupParticipants(m.chat, [target], 'remove')
        } else if (typeof nov4.groupUpdateParticipants === 'function') {
            res = await nov4.groupUpdateParticipants(m.chat, [target], 'remove')
        } else {
            return reply('❌ Method kick tidak tersedia di Baileys kamu.')
        }

        const status = res?.[0]?.status

        if (status === '200' || !status) {
            await reply(`✅ Berhasil kick @${targetClean}`)
        } else {
            await reply(`⚠️ Gagal kick @${targetClean} (status: ${status})`)
        }
    } catch (e) {
        console.error('[KICK] Error:', e)
        reply(`❌ Gagal kick: ${e.message}`)
    }
}
break
        
case 'promote':
case 'naik':
case 'naikin': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    const mentions = m.mentionedJid?.length > 0
        ? m.mentionedJid
        : m.msg?.contextInfo?.mentionedJid?.length > 0
            ? m.msg.contextInfo.mentionedJid
            : m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0
                ? m.message.extendedTextMessage.contextInfo.mentionedJid
                : []

    let target = null

    if (mentions.length > 0) {
        target = mentions[0]
    } else if (m.quoted) {
        target = m.quoted.sender
    } else if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '')
        if (num.length < 10) return reply('❌ Nomor tidak valid. Minimal 10 digit.')
        target = num + '@s.whatsapp.net'
    } else {
        return reply(
            `👑 *PROMOTE MEMBER*\n\n` +
            `> Jadikan member sebagai admin\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}promote @user\n` +
            `> ${prefix}promote (balas pesan user)\n` +
            `> ${prefix}promote 628xxx\n\n`
        )
    }

    const targetClean = target.split('@')[0].replace(/[^0-9]/g, '')

    if (targetClean === botNumberClean) {
        return reply('❌ Bot sudah admin.')
    }

    const isTargetAdmin = groupAdmins.some(p => ids(p).includes(targetClean))
    if (isTargetAdmin) {
        return reply(`❌ @${targetClean} sudah admin.`)
    }

    const isMember = participants.some(p => ids(p).includes(targetClean))
    if (!isMember) {
        return reply(`❌ @${targetClean} bukan member grup.`)
    }

    try {
        const res = await nov4.groupParticipantsUpdate(m.chat, [target], 'promote')
        const status = res?.[0]?.status

        if (status === '200' || !status) {
            await reply(`✅ @${targetClean} sekarang admin.`)
        } else {
            await reply(`⚠️ Gagal promote @${targetClean} (status: ${status})`)
        }
    } catch (e) {
        console.error('[PROMOTE] Error:', e)
        reply(`❌ Gagal promote: ${e.message}`)
    }
}
break
        
case 'demote':
case 'turun':
case 'turunin': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    const mentions = m.mentionedJid?.length > 0
        ? m.mentionedJid
        : m.msg?.contextInfo?.mentionedJid?.length > 0
            ? m.msg.contextInfo.mentionedJid
            : m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0
                ? m.message.extendedTextMessage.contextInfo.mentionedJid
                : []

    let target = null

    if (mentions.length > 0) {
        target = mentions[0]
    } else if (m.quoted) {
        target = m.quoted.sender
    } else if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '')
        if (num.length < 10) return reply('❌ Nomor tidak valid. Minimal 10 digit.')
        target = num + '@s.whatsapp.net'
    } else {
        return reply(
            `⬇️ *DEMOTE ADMIN*\n\n` +
            `> Turunkan admin jadi member biasa\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}demote @user\n` +
            `> ${prefix}demote (balas pesan user)\n` +
            `> ${prefix}demote 628xxx\n\n`
        )
    }

    const targetClean = target.split('@')[0].replace(/[^0-9]/g, '')

    if (targetClean === botNumberClean) {
        return reply('❌ Tidak bisa demote bot.')
    }

    if (targetClean === senderClean) {
        return reply('❌ Tidak bisa demote diri sendiri.')
    }

    const ownerClean = clean(groupOwner)
    if (ownerClean && targetClean === ownerClean) {
        return reply('❌ Tidak bisa demote owner grup.')
    }

    const isTargetAdmin = groupAdmins.some(p => ids(p).includes(targetClean))
    if (!isTargetAdmin) {
        return reply(`❌ @${targetClean} bukan admin.`)
    }

    try {
        const res = await nov4.groupParticipantsUpdate(m.chat, [target], 'demote')
        const status = res?.[0]?.status

        if (status === '200' || !status) {
            await reply(`✅ @${targetClean} bukan admin lagi.`)
        } else {
            await reply(`⚠️ Gagal demote @${targetClean} (status: ${status})`)
        }
    } catch (e) {
        console.error('[DEMOTE] Error:', e)
        reply(`❌ Gagal demote: ${e.message}`)
    }
}
break
        
case 'setname':
case 'setnamagc': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!text) {
        return reply(
            `📛 *SET NAMA GRUP*\n\n` +
            `> Ubah nama grup\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}setname <nama baru>\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}setname Grup Itulah\n\n`
        )
    }

    if (text.length > 100) {
        return reply('❌ Nama grup maksimal 100 karakter.')
    }

    if (text === groupName) {
        return reply('❌ Nama grup sudah sama.')
    }

    try {
        await nov4.groupUpdateSubject(m.chat, text)
        await reply(`✅ Nama grup berhasil diubah menjadi:\n\n*${text}*`)
    } catch (e) {
        console.error('[SETNAME] Error:', e)
        reply(`❌ Gagal ganti nama: ${e.message}`)
    }
}
break
        
case 'setdesc':
case 'setdeskripsi':
case 'setdescgc': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!text) {
        return reply(
            `📝 *SET DESKRIPSI GRUP*\n\n` +
            `> Ubah deskripsi grup\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}setdesc <deskripsi baru>\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}setdesc Atur Aje Bossku\n\n`
        )
    }

    if (text.length > 512) {
        return reply('❌ Deskripsi maksimal 512 karakter.')
    }

    if (text === (groupMetadata?.desc || '')) {
        return reply('❌ Deskripsi grup sudah sama.')
    }

    try {
        await nov4.groupUpdateDescription(m.chat, text)
        await reply(`✅ Deskripsi grup berhasil diubah.`)
    } catch (e) {
        console.error('[SETDESC] Error:', e)
        reply(`❌ Gagal ganti deskripsi: ${e.message}`)
    }
}
break
        
case 'lockgc':
case 'close':
case 'lockgrup': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (groupMetadata?.announce) {
        return reply('🔒 Grup sudah terkunci.')
    }

    try {
        await nov4.groupSettingUpdate(m.chat, 'announcement')
        await reply('🔒 Grup berhasil dikunci.\n\n_Cuma admin yang bisa chat._')
    } catch (e) {
        console.error('[LOCK] Error:', e)
        reply(`❌ Gagal kunci grup: ${e.message}`)
    }
}
break
        
case 'antilink':
case 'antilinkgc':
case 'antilinkgrup': {
    if (!isGroup) return reply('❌ Cuma bisa di grup.')
    if (!isAdmins && !isCreator) return reply('❌ Khusus admin.')
    if (!isBotAdmins) return reply('❌ Bot harus admin dulu.')

    const ANTILINK_PATH = './lib/database/antilink.json'

    let antilinkData = {}
    try {
        antilinkData = JSON.parse(fs.readFileSync(ANTILINK_PATH, 'utf-8'))
    } catch {
        antilinkData = {}
    }

    const chatId = m.chat || from
    const mode = args[0]?.toLowerCase()
    const currentMode = antilinkData[chatId] || 'off'

    const modeText = {
        off: '❌ Mati',
        kick: '👢 Kick',
        delete: '🗑️ Delete'
    }

    if (!mode || !['on', 'off', 'kick', 'delete'].includes(mode)) {
        return reply(
            `🔗 *ANTI LINK*\n\n` +
            `> Atur mode anti-link untuk grup ini\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}antilink kick — Hapus + kick user\n` +
            `> ${prefix}antilink delete — Hapus pesan saja\n` +
            `> ${prefix}antilink off — Matikan\n` +
            `> ${prefix}cekantilink — Lihat status\n\n` +
            `*Status sekarang:* ${modeText[currentMode] || '❌ Mati'}\n\n` +
            `_Bot harus admin dulu._`
        )
    }

    if (mode === 'off') {
        delete antilinkData[chatId]
        delete antilinkData[from]
        fs.writeFileSync(ANTILINK_PATH, JSON.stringify(antilinkData, null, 2))
        return reply('❌ Anti-link *MATI* di grup ini.')
    }

    if (mode === 'on') {
        antilinkData[chatId] = 'kick'
        fs.writeFileSync(ANTILINK_PATH, JSON.stringify(antilinkData, null, 2))
        return reply('✅ Anti-link *AKTIF* dengan mode *KICK*.\n\n_User yang kirim link akan dihapus + dikick._')
    }

    antilinkData[chatId] = mode
    fs.writeFileSync(ANTILINK_PATH, JSON.stringify(antilinkData, null, 2))

    if (mode === 'kick') {
        return reply('✅ Anti-link *AKTIF*.\n\n_Mode: Hapus + Kick_\n_User yang kirim link langsung dikick._')
    }

    if (mode === 'delete') {
        return reply('✅ Anti-link *AKTIF*.\n\n_Mode: Hapus Saja_\n_Pesan link dihapus, user tidak dikick._')
    }
}
break

case 'cekantilink':
case 'statusantilink': {
    if (!isGroup) return reply('❌ Cuma bisa di grup.')

    const ANTILINK_PATH = './lib/database/antilink.json'

    let antilinkData = {}
    try {
        antilinkData = JSON.parse(fs.readFileSync(ANTILINK_PATH, 'utf-8'))
    } catch {
        antilinkData = {}
    }

    const chatId = m.chat || from
    const mode = antilinkData[chatId] || 'off'

    const modeText = {
        off: '❌ Mati',
        kick: '👢 Kick (Hapus + Kick)',
        delete: '🗑️ Delete (Hapus Saja)'
    }

    let caption = `🔗 *STATUS ANTI-LINK*\n\n`
    caption += `📛 Grup : ${groupName || chatId}\n`
    caption += `⚙️ Mode : ${modeText[mode] || '❌ Mati'}\n\n`

    if (mode === 'off') {
        caption += `_Anti-link belum aktif di grup ini._\n`
        caption += `_Aktifkan: ${prefix}antilink kick/delete_`
    } else if (mode === 'kick') {
        caption += `_User yang kirim link akan dihapus + dikick._`
    } else if (mode === 'delete') {
        caption += `_User yang kirim link akan dihapus, tanpa kick._\n`
        caption += `_3x warning → notif khusus._`
    }

    return reply(caption)
}
break

case 'listantilink': {
    if (!isCreator) return reply('❌ Khusus owner bot.')

    const ANTILINK_PATH = './lib/database/antilink.json'

    let antilinkData = {}
    try {
        antilinkData = JSON.parse(fs.readFileSync(ANTILINK_PATH, 'utf-8'))
    } catch {
        antilinkData = {}
    }

    const entries = Object.entries(antilinkData)

    if (entries.length === 0) {
        return reply(
            `🔗 *LIST ANTI-LINK*\n\n` +
            `_Belum ada grup yang mengaktifkan anti-link._`
        )
    }

    const modeText = {
        kick: '👢 Kick',
        delete: '🗑️ Delete'
    }

    let caption = `🔗 *LIST ANTI-LINK*\n\n`
    caption += `📊 Total: ${entries.length} grup\n\n`

    entries.forEach(([jid, mode], i) => {
        caption += `${i + 1}. ${jid}\n`
        caption += `   Mode: ${modeText[mode] || mode}\n\n`
    })

    return reply(caption.trim())
}
break
        
case 'unlockgc':
case 'open':
case 'unlockgrup': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!groupMetadata?.announce) {
        return reply('🔓 Grup sudah terbuka.')
    }

    try {
        await nov4.groupSettingUpdate(m.chat, 'not_announcement')
        await reply('🔓 Grup berhasil dibuka.\n\n_Semua member bisa chat._')
    } catch (e) {
        console.error('[UNLOCK] Error:', e)
        reply(`❌ Gagal buka grup: ${e.message}`)
    }
}
break
        
case 'revoke':
case 'resetlink':
case 'resetlinkgc': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!text) {
        return nov4.sendMessage(m.chat, {
            text:
                `🔄 *RESET LINK GRUP*\n\n` +
                `> Reset link undangan grup\n` +
                `> Link lama tidak akan valid lagi\n` +
                `> Link baru akan dikirim ke *DM kamu*\n\n` +
                `*Yakin mau reset?*`,
            footer: global.footer || 'nova bot',
            buttons: [
                { buttonId: '.revoke yes', buttonText: { displayText: '✅ Ya, Reset' }, type: 1 },
                { buttonId: '.revoke no',  buttonText: { displayText: '❌ Batal' },     type: 1 }
            ],
            headerType: 1
        }, { quoted: m })
    }

    const jawaban = text.toLowerCase().trim()

    if (jawaban === 'no' || jawaban === 'batal' || jawaban === 'cancel') {
        return reply('❌ *Reset link dibatalkan.*')
    }

    if (jawaban !== 'yes') {
        return reply(
            `❌ Jawaban tidak valid.\n\n` +
            `> Ketik \`${prefix}revoke\` untuk mulai ulang`
        )
    }

    try {
        await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const newCode = await nov4.groupRevokeInvite(m.chat)
        const link = `https://chat.whatsapp.com/${newCode}`

        await nov4.sendMessage(sender, {
            text:
                `✅ *Link grup berhasil di-reset*\n\n` +
                `📛 Grup  : ${groupName || '-'}\n` +
                `👤 Admin : @${senderNumber}\n` +
                `🕐 Waktu : ${wib}\n\n` +
                `🔗 *Link baru:*\n${link}\n\n`,
            mentions: [sender]
        })

        await nov4.sendMessage(m.chat, {
            text:
                `✅ *Link grup berhasil di-reset*\n\n` +
                `🔒 Link baru telah dikirim ke DM admin @${senderNumber}\n\n` +
                `_Link lama sudah tidak valid._`,
            mentions: [sender]
        }, { quoted: m })

        await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('[REVOKE] Error:', e)
        await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(`❌ Gagal reset link: ${e.message}`)
    }
}
break

case 'tagall':
case 'everyone': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!text) {
        return reply(
            `📢 *TAG ALL*\n\n` +
            `> Tag semua member grup\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}tagall <teks>\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}tagall rapat jam 8\n\n` +
            `_Teks wajib diisi._`
        )
    }

    let mentions = []
    let textTag = `📢 *${text}*\n\n`

    for (const mem of participants) {
        mentions.push(mem.id)
        textTag += `@${mem.id.split('@')[0]}\n`
    }

    await nov4.sendMessage(m.chat, {
        text: textTag.trim(),
        mentions: mentions
    }, { quoted: m })
}
break

case 'hidetag':
case 'ht': {
    if (!isGroup) return reply(mess.group)
    if (!isAdmins && !isCreator) return reply(mess.admin)
    if (!isBotAdmins) return reply(mess.botadmin)

    if (!text) {
        return reply(
            `📢 *HIDE TAG*\n\n` +
            `> Tag semua member tanpa muncul nama\n\n` +
            `*Cara pakai:*\n` +
            `> ${prefix}hidetag <teks>\n\n` +
            `*Contoh:*\n` +
            `> ${prefix}hidetag rapat jam 8\n\n` +
            `_Teks wajib diisi._`
        )
    }

    const mentions = participants.map(p => p.id)

    await nov4.sendMessage(m.chat, {
        text: text,
        mentions: mentions
    }, { quoted: m })
}
break

default:
}
} catch (err) {
console.log(util.format(err));
}
};