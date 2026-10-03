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
import { imageToWebp, addExif } from '../../lib/exif.js'
import "../../settings.js"

export default {
    command: ['get'],

    run: async (nov4, m, { reply, text, isCreator }) => {
        if (!isCreator) return reply(mess.owner)
        if (!text) return reply(`Awali URL dengan http:// atau https://`)

        if (!/^https?:\/\//i.test(text)) {
            return reply('URL harus pakai http:// atau https://')
        }

        try {
            const res = await axios.get(text, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Referer': 'https://www.google.com/',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                },
                responseType: 'arraybuffer',
                timeout: 60000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            })

            if (/json/i.test(contentType)) {
                const jsonData = JSON.parse(Buffer.from(res.data).toString('utf8'))
                const result = JSON.stringify(jsonData, null, 2)

                if (result.length > 4000) {
                    return nov4.sendMessage(m.chat, {
                        document: Buffer.from(result, 'utf-8'),
                        mimetype: 'application/json',
                        fileName: `result_${Date.now()}.json`,
                        caption: 'JSON Result'
                    }, { quoted: m })
                }

                return reply(result)
            }

            if (/text/i.test(contentType)) {
                const textData = Buffer.from(res.data).toString('utf8')

                if (textData.length > 4000) {
                    return nov4.sendMessage(m.chat, {
                        document: Buffer.from(textData, 'utf-8'),
                        mimetype: 'text/plain',
                        fileName: `result_${Date.now()}.txt`,
                        caption: 'Text Result'
                    }, { quoted: m })
                }

                return reply(textData)
            }

            if (text.includes('webp')) {
                const buffer = Buffer.from(res.data)
                const webpBuf = await imageToWebp(buffer)
                const stickerBuf = await addExif(webpBuf, global.packName || 'Nova', global.author || 'Zora', ['🤖'])

                return nov4.sendMessage(m.chat, { sticker: stickerBuf }, { quoted: m })
            }

            if (/image/i.test(contentType)) {
                const buffer = Buffer.from(res.data)
                return nov4.sendMessage(m.chat, { image: buffer }, { quoted: m })
            }

            if (/video/i.test(contentType)) {
                const buffer = Buffer.from(res.data)
                return nov4.sendMessage(m.chat, {
                    video: buffer,
                    mimetype: 'video/mp4'
                }, { quoted: m })
            }

            if (/audio/i.test(contentType) || text.includes('.mp3')) {
                const buffer = Buffer.from(res.data)
                return nov4.sendMessage(m.chat, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    ptt: false
                }, { quoted: m })
            }

            if (/application\/zip/i.test(contentType) || /application\/x-zip-compressed/i.test(contentType)) {
                const buffer = Buffer.from(res.data)
                return nov4.sendMessage(m.chat, {
                    document: buffer,
                    mimetype: 'application/zip',
                    fileName: text.split('/').pop() || `file_${Date.now()}.zip`,
                    caption: 'ZIP File'
                }, { quoted: m })
            }

            if (/application\/pdf/i.test(contentType)) {
                const buffer = Buffer.from(res.data)
                return nov4.sendMessage(m.chat, {
                    document: buffer,
                    mimetype: 'application/pdf',
                    fileName: text.split('/').pop() || `file_${Date.now()}.pdf`,
                    caption: 'PDF File'
                }, { quoted: m })
            }

            const buffer = Buffer.from(res.data)
            return nov4.sendMessage(m.chat, {
                document: buffer,
                mimetype: contentType || 'application/octet-stream',
                fileName: text.split('/').pop() || `file_${Date.now()}`,
                caption: `MIME: ${contentType || 'unknown'}`
            }, { quoted: m })

        } catch (e) {
            console.error('[GET]', e.message)
            reply(`Error: ${e.message}`)
        }
    }
}