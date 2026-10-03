import axios from 'axios'
import * as cheerio from 'cheerio'

export async function videy(url) {
    try {
        if (!url || !/videy\.co/i.test(url)) {
            throw new Error('Link Videy tidak valid.')
        }

        let cleanUrl = url.trim()

        if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl
        }

        const { data: html } = await axios.get(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://videy.co/'
            },
            timeout: 30000
        })

        const $ = cheerio.load(html)

        let videoUrl = ''
        let id = ''

        id = cleanUrl.match(/[?&]id=([^&]+)/i)?.[1] ||
             cleanUrl.match(/videy\.co\/([^/?&]+)/i)?.[1] || ''

        if (id) {
            videoUrl = `https://cdn.videy.co/${id}.mp4`
        }

        if (!videoUrl) {
            const patterns = [
                /<video[^>]+src=["']([^"']+)["']/i,
                /<source[^>]+src=["']([^"']+)["']/i,
                /"contentUrl"\s*:\s*["']([^"']+)["']/i,
                /"videoUrl"\s*:\s*["']([^"']+)["']/i,
                /https?:\/\/cdn\.videy\.co\/[a-zA-Z0-9]+\.mp4/gi,
                /https?:\/\/[^"'\s]*\.mp4[^"'\s]*/gi
            ]

            for (const pattern of patterns) {
                const match = html.match(pattern)
                if (match && match[0]) {
                    videoUrl = match[0].replace(/^["']|["']$/g, '')
                    break
                }
            }
        }

        if (!videoUrl) {
            const ogVideo = $('meta[property="og:video"]').attr('content') ||
                            $('meta[property="og:video:url"]').attr('content') ||
                            $('meta[property="og:video:secure_url"]').attr('content') ||
                            $('meta[name="twitter:player:stream"]').attr('content')

            if (ogVideo) videoUrl = ogVideo
        }

        if (!videoUrl) {
            throw new Error('Video tidak ditemukan di halaman.')
        }

        if (videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl
        if (videoUrl.startsWith('/')) videoUrl = new URL(cleanUrl).origin + videoUrl

        const title = $('meta[property="og:title"]').attr('content') ||
                      $('title').text().trim() ||
                      'Videy Video'

        let thumbnail = $('meta[property="og:image"]').attr('content') ||
                        $('video').attr('poster') || ''

        if (thumbnail && thumbnail.startsWith('//')) {
            thumbnail = 'https:' + thumbnail
        }

        const description = $('meta[property="og:description"]').attr('content') ||
                            $('meta[name="description"]').attr('content') || ''

        return {
            status: true,
            title: title.replace(/\s*-\s*Videy\s*$/i, '').trim(),
            thumbnail,
            description,
            videoUrl,
            id,
            originalUrl: cleanUrl
        }

    } catch (e) {
        return {
            status: false,
            message: e.message || 'Gagal mengambil video.'
        }
    }
}