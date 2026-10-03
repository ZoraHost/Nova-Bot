import axios from 'axios'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import FormData from 'form-data'

export async function upVidey(buffer, filename = 'video.mp4') {
    try {
        if (!buffer) throw new Error('File diperlukan')

        const form = new FormData()

        if (Buffer.isBuffer(buffer)) {
            form.append('file', buffer, {
                filename,
                contentType: 'video/mp4'
            })
        } else if (typeof buffer === 'string' && fs.existsSync(buffer)) {
            form.append('file', fs.createReadStream(buffer), {
                filename: path.basename(buffer),
                contentType: 'video/mp4'
            })
        } else {
            throw new Error('Format file tidak valid')
        }

        const r = await axios.post(
            'https://videy.co/api/upload?visitorId=' + crypto.randomUUID(),
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                    'origin': 'https://videy.co',
                    'referer': 'https://videy.co/',
                    'accept': 'application/json'
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                timeout: 300000
            }
        )

        const id = r.data?.id

        if (!id) throw new Error('Upload gagal — tidak ada ID')

        return {
            status: true,
            id,
            link: r.data.link || `https://videy.co/v?id=${id}`,
            cdn: `https://cdn.videy.co/${id}.mp4`
        }

    } catch (e) {
        return {
            status: false,
            msg: e.message || 'Upload gagal'
        }
    }
}