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

import axios from 'axios'
import { fbDownload } from '../../scrape/downloader/facebook.js'

export default {
    command: ['facebook', 'fb', 'fbdl'],
    run: async (nov4, m, { args, reply }) => {
        if (!args[0]) {
            return reply(
                `📘 *FACEBOOK DOWNLOADER*\n\n` +
                `> Download video Facebook\n\n` +
                `*Cara pakai:*\n` +
                `> .fb <link>\n\n` +
                `*Support:*\n` +
                `• facebook.com/watch?v=xxx\n` +
                `• fb.watch/xxx`
            )
        }

        if (!/facebook\.com|fb\.watch|fb\.me/i.test(args[0])) {
            return reply('❌ Link Facebook tidak valid.')
        }

        try {
            await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
            await reply('⏳ *Sedang download dari Facebook...*')

            const data = await fbDownload(args[0])

            if (!data.status) {
                await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return reply(`❌ Gagal: ${data.message}`)
            }

            const videoUrl = data.results[0].url
            const quality = data.results[0].quality

            const res = await axios.get(videoUrl, {
                responseType: 'arraybuffer',
                timeout: 120000,
                maxContentLength: 200 * 1024 * 1024
            })
            const buffer = Buffer.from(res.data)
            const sizeMB = (buffer.length / 1024 / 1024).toFixed(2)

            if (buffer.length > 64 * 1024 * 1024) {
                await nov4.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
                return reply(`⚠️ Video terlalu besar (${sizeMB} MB). Max 64 MB.`)
            }

            await nov4.sendMessage(m.chat, {
                video: buffer,
                caption: `📘 *Facebook Video*\n\n📺 Quality: ${quality}\n📊 Size: ${sizeMB} MB`,
                mimetype: 'video/mp4',
                fileName: 'facebook.mp4'
            }, { quoted: m })

            await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } catch (e) {
            console.error('[FB] Error:', e)
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            reply(`❌ Gagal: ${e.message}`)
        }
    }
}