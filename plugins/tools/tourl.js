import fs from 'fs'
import crypto from 'crypto'
import FormData from 'form-data'
import axios from 'axios'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

export default {
    command: ['tourl', 'upload'],
    category: 'tools',
    name: 'To URL',
    description: 'Upload gambar ke URL',

    run: async (nov4, m, ctx) => {
        const { reply, prefix, command } = ctx

        const quoted = m.quoted ? m.quoted : m
        const qmsg = (quoted.msg || quoted)
        const mime = qmsg.mimetype || ''

        if (!/image|video|audio|document/.test(mime)) {
            return reply(`Kirim/reply media dengan caption ${prefix + command}`)
        }

        try {
            await nov4.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

            const buffer = await nov4.downloadMediaMessage(quoted)

            if (!buffer || buffer.length === 0) {
                await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return reply('Gagal download media.')
            }

            const sizeMB = (buffer.length / 1024 / 1024).toFixed(2)

            if (buffer.length > 200 * 1024 * 1024) {
                await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return reply('File kegedean. Maksimal 200 MB.')
            }

            const ext = mime.split('/')[1]?.split(';')[0] || 'bin'
            const filename = `nova_${Date.now()}.${ext}`

            const form = new FormData()
            form.append('reqtype', 'fileupload')
            form.append('fileToUpload', buffer, { filename })

            const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
                headers: form.getHeaders(),
                timeout: 120000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            })

            const url = String(data).trim()

            if (!url || !url.startsWith('http')) {
                await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
                return reply('Upload gagal. Coba lagi.')
            }

            const interactiveMsg = {
                body: {
                    text:
                        `✅ *Upload Berhasil*\n\n` +
                        `📊 Size: ${sizeMB} MB\n` +
                        `🔗 ${url}\n\n` +
                        `_Klik tombol untuk copy_`
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
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: '📋 Copy Link',
                                id: 'copy_link',
                                copy_code: url
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '🌐 Buka Link',
                                url: url,
                                merchant_url: url
                            })
                        }
                    ],
                    messageParamsJson: '{}'
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

            await nov4.relayMessage(from, generatedMsg.message, {
                messageId: generatedMsg.key.id
            })

            await nov4.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        } catch (e) {
            console.error('[TOURL]', e.message)
            await nov4.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            reply(`Gagal: ${e.message}`)
        }
    }
}