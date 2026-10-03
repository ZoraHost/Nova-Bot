import axios from 'axios'

export async function ghDownload(url) {
    try {
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/(tree|blob)\/([^\/]+)(?:\/(.+))?)?/i)
        if (!match) throw new Error('Link GitHub tidak valid')

        const [, owner, repo, type, branch, pathFile] = match
        const cleanRepo = repo.replace(/\.git$/, '')

        const { data: repoData } = await axios.get(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
            headers: { 'User-Agent': 'Nova-Bot' },
            timeout: 15000
        })

        const useBranch = branch || repoData.default_branch

        if (type === 'blob' && pathFile) {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/${useBranch}/${pathFile}`
            const { data } = await axios.get(rawUrl, {
                responseType: 'arraybuffer',
                headers: { 'User-Agent': 'Nova-Bot' },
                timeout: 60000,
                maxContentLength: 50 * 1024 * 1024
            })

            const fileName = pathFile.split('/').pop()

            return {
                status: true,
                type: 'file',
                buffer: Buffer.from(data),
                fileName,
                rawUrl,
                size: (data.byteLength / 1024).toFixed(2),
                info: {
                    fullName: repoData.full_name,
                    description: repoData.description || 'Tidak ada deskripsi',
                    stars: repoData.stargazers_count,
                    forks: repoData.forks_count,
                    language: repoData.language || 'Unknown',
                    htmlUrl: repoData.html_url,
                    branch: useBranch,
                    cloneUrl: repoData.clone_url
                }
            }
        }

        const zipUrl = `https://github.com/${owner}/${cleanRepo}/archive/refs/heads/${useBranch}.zip`
        const { data } = await axios.get(zipUrl, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Nova-Bot' },
            timeout: 120000,
            maxContentLength: 200 * 1024 * 1024,
            maxBodyLength: 200 * 1024 * 1024
        })

        return {
            status: true,
            type: 'repo',
            buffer: Buffer.from(data),
            fileName: `${cleanRepo}-${useBranch}.zip`,
            size: (data.byteLength / 1024 / 1024).toFixed(2),
            info: {
                fullName: repoData.full_name,
                description: repoData.description || 'Tidak ada deskripsi',
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                language: repoData.language || 'Unknown',
                htmlUrl: repoData.html_url,
                branch: useBranch,
                cloneUrl: repoData.clone_url,
                sizeRepo: (repoData.size / 1024).toFixed(2)
            }
        }
    } catch (e) {
        return {
            status: false,
            message: e.message || 'Gagal download dari GitHub'
        }
    }
}