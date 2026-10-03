import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'

async function getFinalUrl(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('URL tidak valid')
    }

    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url
    }

    const res = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
        },
        maxRedirects: 10,
        timeout: 30000,
        validateStatus: () => true
    })

    const finalUrl = res.request?.res?.responseUrl
        || res.request?._redirectable?._currentUrl
        || res.config?.url
        || url

    return {
        status: true,
        original: url,
        final: finalUrl,
        statusCode: res.status
    }
}

function getFileName(url, headers) {
    const disposition = headers['content-disposition'] || ''
    const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)/i)
    if (match) {
        return decodeURIComponent(match[1].trim())
    }

    const fromUrl = url.split('?')[0].split('/').pop()
    if (fromUrl && fromUrl.includes('.')) {
        return decodeURIComponent(fromUrl)
    }

    return `file_${Date.now()}`
}

export default {
    command: ['skiplink', 'bypass', 'unshort', 'expand'],
    run: async (nov4, m, { args, reply, sender }) => {
        if (!args[0]) {
            return reply(
                `🔗 *SKIP LINK + DOWNLOAD FILE*\n\n` +
                `> Bypass shortlink & kirim file ke DM kamu\n\n` +
                `*Cara pakai:*\n` +
                `> .skiplink <url>\n\n` +
                `*Contoh:*\n` +
                `> .skiplink https://bit.ly/xxxxx\n` +
                `> .skiplink https://adf.ly/xxxxx\n\n` +
                `_File akan dikirim ke DM kamu, bukan ke grup._`
            )
        }

        const url = args[0].trim()

        if (!/^https?:\/\//i.test(url) && !/^[a-z0-9.-]+\.[a-z]{2,}\//i.test(url)) {
            return reply('❌ URL tidak valid.')
        }

        try {
            await nov4.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
            await reply('🔍 *Sedang skip link...*')

            const data = await getFinalUrl(url)

            if (!data.status) {
                await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return reply(`❌ Gagal skip: ${data.message}`)
            }

            const isSame = data.original === data.final

            await nov4.sendMessage(m.chat, {
                text:
                    `🔗 *HASIL SKIP LINK*\n\n` +
                    `📥 Original:\n${data.original}\n\n` +
                    `✅ Final:\n${data.final}\n\n` +
                    `📊 Status: ${data.statusCode}\n` +
                    (isSame ? `\n_Link tidak berubah (bukan shortlink)_` : `\n_Berhasil skip_`)
            }, { quoted: m })

            await reply('⏳ *Mengunduh file...*')

            const fileRes = await axios.get(data.final, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Referer': data.final
                },
                maxContentLength: 200 * 1024 * 1024,
                timeout: 120000,
                validateStatus: () => true
            })

            if (fileRes.status !== 200) {
                await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return reply(`❌ Gagal download file (status ${fileRes.status}).`)
            }

            const contentType = fileRes.headers['content-type'] || ''
            const sizeBytes = fileRes.data.byteLength || fileRes.data.length
            const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2)

            if (sizeBytes > 200 * 1024 * 1024) {
                await nov4.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
                return reply(`⚠️ File terlalu besar (${sizeMB} MB). Max 200 MB.`)
            }

            if (/text\/html/i.test(contentType)) {
                await nov4.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
                return reply(
                    `⚠️ Link akhir adalah halaman HTML, bukan file.\n\n` +
                    `🔗 ${data.final}\n\n` +
                    `_Buka link di browser untuk lanjut._`
                )
            }

            const fileName = getFileName(data.final, fileRes.headers)
            const buffer = Buffer.from(fileRes.data)
            const mimetype = contentType || 'application/octet-stream'

            await nov4.sendMessage(sender, {
                document: buffer,
                mimetype,
                fileName,
                caption:
                    `📁 *File dari Skip Link*\n\n` +
                    `📄 Nama : ${fileName}\n` +
                    `📊 Size : ${sizeMB} MB\n` +
                    `🔗 Link : ${data.final}\n\n` +
                    `_Downloaded by ${global.botName || 'Nova'}_`
            })

            await nov4.sendMessage(m.chat, {
                text:
                    `✅ *File terkirim ke DM kamu*\n\n` +
                    `📄 ${fileName}\n` +
                    `📊 ${sizeMB} MB\n\n` +
                    `_Cek DM untuk download_`
            }, { quoted: m })

            await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        } catch (e) {
            console.error('[SKIPLINK] Error:', e)
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            reply(`❌ Gagal: ${e.message}`)
        }
    }
}