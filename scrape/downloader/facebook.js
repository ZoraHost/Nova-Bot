import axios from "axios";

async function getToken() {
    const url = "https://fbdownloader.to/id";
    const { data: html } = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        timeout: 30000
    });

    const regex = /k_exp="(.*?)".*?k_token="(.*?)"/s;
    const match = html.match(regex);
    if (!match) throw new Error("Token tidak ditemukan");

    return {
        k_exp: match[1],
        k_token: match[2]
    };
}

export async function fbDownload(fbUrl) {
    if (!fbUrl || typeof fbUrl !== 'string') {
        return { status: false, message: 'URL tidak valid' }
    }

    if (!/facebook\.com|fb\.watch|fb\.me/i.test(fbUrl)) {
        return { status: false, message: 'Link Facebook tidak valid' }
    }

    try {
        const { k_exp, k_token } = await getToken();

        const payload = new URLSearchParams({
            k_exp,
            k_token,
            p: "home",
            q: fbUrl,
            lang: "id",
            v: "v2",
            W: ""
        });

        const { data } = await axios.post("https://fbdownloader.to/api/ajaxSearch", payload, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "https://fbdownloader.to",
                "Referer": "https://fbdownloader.to/id"
            },
            timeout: 30000
        });

        if (!data || !data.data) throw new Error("Gagal mengambil data video");

        const html = data.data;
        const results = [];

        const rowRegex = /<td class="video-quality">(.*?)<\/td>[\s\S]*?(?:href="(.*?)"|data-videourl="(.*?)")/g;
        let match;
        while ((match = rowRegex.exec(html)) !== null) {
            const quality = match[1].trim();
            const url = match[2] || match[3];
            if (quality && url) results.push({ quality, url });
        }

        if (!results.length) {
            throw new Error('Tidak ada video ditemukan')
        }

        return {
            status: true,
            results
        };
    } catch (e) {
        return {
            status: false,
            message: e.message || 'Gagal download Facebook'
        }
    }
}