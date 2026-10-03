<p align="center">
  <img src="https://raw.githubusercontent.com/ZoraHost/ZFZ/refs/heads/master/nova.jpg" width="600">
  <br>
  <b>Nova Bot</b>
  <br>
  <sub>Bot WhatsApp Multi Device berbasis Baileys ESM</sub>
</p>

WhatsApp Bot berbasis `@whiskeysockets/baileys`, dibangun dengan sistem **Case + Plugin auto-load**, **hot reload**, dan **sistem izin bertingkat** (Creator, Premium, Admin Grup).

---

## Fitur

- **Auto-Load Plugin** — Tinggal taruh file di `/plugins/<kategori>/<fitur>.js`, otomatis ke-load tanpa daftar manual.
- **Auto-Load Case** — Fitur command juga bisa ditaruh langsung di file case handler.
- **Hot Reload** — Tambah/ubah fitur di `/plugins` langsung ke-detect tanpa restart bot.
- **Sistem Izin 4 Level** — `isCreator`, `isPremium`, `isAdmin`, `isGroup` per fitur, bisa dikombinasikan bebas.
- **Pairing Code** — Menggunakan sistem Pairing Code.
- **Menu Otomatis** — `.menu` otomatis mengelompokkan semua fitur per kategori.
- **Integrasi API Eksternal** — Contoh: AI Chat, Downloader TikTok, YouTube, Instagram, dll.

---

```markdown
## Instalasi

Node.js versi *18+* disarankan (dibutuhkan untuk `fetch()` bawaan yang dipakai beberapa fitur).
```
---

### 📱 Termux (Android)

```bash
pkg update && pkg upgrade -y
pkg install git nodejs ffmpeg imagemagick -y
git clone https://github.com/ZoraHost/Nova-Bot.git
cd Nova-Bot
npm install
node index.js
```

---

### 🖥️ VPS / Linux (Ubuntu/Debian)

```bash
apt update && apt upgrade -y
apt install git nodejs npm ffmpeg imagemagick -y
git clone https://github.com/ZoraHost/Nova-Bot.git
cd Nova-Bot
npm install
node index.js
```

Kalau mau bot jalan 24 jam tanpa mati, pakai `pm2`:

```bash
npm install -g pm2
pm2 start index.js --name nova-bot
pm2 save
pm2 startup
```

---

### 🪟 Windows

**1. Install Node.js**

Download di [nodejs.org](https://nodejs.org) — pilih versi **LTS (v20+)**.

**2. Install Git**

Download di [git-scm.com](https://git-scm.com/download/win).

**3. Install FFmpeg**

Download di [ffmpeg.org](https://ffmpeg.org/download.html), extract, tambahkan folder `bin` ke **PATH** sistem.

**4. Install ImageMagick**

Download di [imagemagick.org](https://imagemagick.org/script/download.php#windows).

**5. Clone & jalankan**

Buka **Command Prompt** atau **PowerShell**:

```bash
git clone https://github.com/ZoraHost/Nova-Bot.git
cd Nova-Bot
npm install
node index.js
```

---

### 🎛️ Panel (Pterodactyl)

**1. Upload & Extract**

- Masuk ke panel
- Upload file bot (`.zip`)
- Extract di file manager

**2. Install Dependency**

- Buka tab **Console**
- Ketik `npm install` lalu Enter

**3. Konfigurasi Startup**

- Di tab **Startup**, set:
  - **Docker Image**: `ghcr.io/parkervcp/yolks:nodejs_20`
  - **Startup Command**: `node index.js`

**4. Start Bot**

- Klik **Start**
- Buka tab **Console** untuk pairing code
- Masukkan nomor WhatsApp (format `628xxx`)
- Ketik kode pairing di WhatsApp

---

### 🐳 Docker (Opsional)

```bash
docker build -t nova-bot .
docker run -d --name nova-bot --restart unless-stopped nova-bot
```

## Konfigurasi

| File | Konstanta | Fungsi |
|------|-----------|--------|
| `settings.js` | `global.owner` | Daftar nomor owner bot |
| `settings.js` | `global.ownerName` | Nama owner |
| `settings.js` | `global.botName` | Nama bot |
| `settings.js` | `global.footer` | Footer pesan |
| `settings.js` | `global.prefix` | Prefix command (default: `.`) |
| `settings.js` | `global.packName` | Nama pack sticker |
| `settings.js` | `global.author` | Author sticker |

---

## Menjalankan Bot

```bash
node index.js
```

- **Pertama Kali:** Bot meminta nomor untuk di jadikan bot.
- **Selanjutnya:** Kalau sesi di `session/` sudah ada, bot otomatis reconnect tanpa perlu pairing ulang.

---

## Struktur Folder

```
Nova-Bot/
├── plugins/                  # Fitur bot dalam bentuk plugin, auto-loaded
│   └── tools/
│       ├── get.js            # .get
│       └── tourl.js          # .tourl
├── scrape/                   # Scraper & API helper
│   ├── downloader/
│   │   ├── tiktok.js         # Scraper TikTok
│   │   ├── youtube.js        # Scraper YouTube
│   │   ├── github.js         # Scraper GitHub
│   │   └── videy.js          # Scraper Videy
│   ├── uploader/
│   │   └── videy.js          # Uploader Videy
│   ├── tools/
│   │   └── lyrics.js         # Scraper Lyrics
│   └── uploader/
│       └── tourl.js          # Multi-server uploader
├── lib/
│   ├── myfunc.js             # Helper functions
│   ├── exif.js               # Sticker EXIF
│   ├── autoclear.js          # Auto clear session
│   ├── jadibot.js            # Multi session
│   ├── canvas.js             # Canvas generator
│   ├── database/             # JSON database
│   │   ├── owner.json
│   │   ├── premium.json
│   │   ├── antilink.json
│   │   ├── antibot.json
│   │   ├── mute.json
│   │   └── welcome.json
│   └── media/                # Asset media
├── session/                  # Data sesi WhatsApp
├── index.js                  # Koneksi, pairing, handler event
├── handler.js                # Handler plugin & case
├── settings.js               # Konfigurasi bot
└── package.json
```

---

## Sistem Plugin

Setiap fitur adalah 1 file di `/plugins/<kategori>/<nama>.js` dengan bentuk:

```javascript
export default {
  command: ["namaperintah", "alias"],  // Wajib
  category: "kategori",                 // Opsional, default nama folder
  name: "Nama Tampilan",                // Opsional, default nama file (Capitalize)
  description: "Penjelasan Fitur",      // Opsional
  isCreator: false,                     // Wajib Creator?
  isPremium: false,                     // Wajib Premium? (Creator Otomatis Bypass)
  isAdmin: false,                       // Wajib Admin Grup? (Bot Juga Wajib Admin)
  isGroup: false,                       // Cuma Bisa Dipakai Di Grup?

  run: async (nov4, m, ctx) => {
    // Logic Fitur Di Sini
  },
};
```

### Objek `nov4` (Parameter Pertama `run`)

Wrapper di atas library asli, supaya semua fitur konsisten manggil lewat `nov4.`:

| Method | Keterangan |
|--------|------------|
| `nov4.sendMessage(jid, content, options)` | Kirim Pesan (Text/Media/Reply) |
| `nov4.relayMessage(jid, content, options)` | Kirim Pesan Complex (Button, Interactive) |
| `nov4.groupMetadata(jid)` | Info Grup |
| `nov4.groupParticipantsUpdate(jid, [ids], action)` | Kick/Promote/Demote/Add |
| `nov4.groupSettingUpdate(jid, setting)` | Kunci/Buka Grup |
| `nov4.groupRevokeInvite(jid)` | Reset Link Undangan |
| `nov4.groupLeave(jid)` | Keluar dari Grup |
| `nov4.profilePictureUrl(jid, type)` | Ambil PP User/Grup |
| `nov4.downloadMediaMessage(message)` | Download Media |

### Objek `ctx` (Parameter Ketiga `run`)

| Field | Isi |
|-------|-----|
| `ctx.command` | Command Yang Diketik |
| `ctx.args` | Array Argumen |
| `ctx.text` | Argumen Dalam Bentuk String |
| `ctx.reply` | Fungsi Balas Cepat |
| `ctx.prefix` | Prefix Yang Dipakai |
| `ctx.isGroup` | `true`/`false` |
| `ctx.isCreator` | `true`/`false` |
| `ctx.isPremium` | `true`/`false` |
| `ctx.isAdmins` | `true`/`false` |
| `ctx.isBotAdmins` | `true`/`false` |
| `ctx.groupMetadata` | Info Grup |
| `ctx.participants` | Daftar Anggota Grup |
| `ctx.sender` | JID Pengirim |
| `ctx.senderNumber` | Nomor Pengirim |
| `ctx.botNumber` | JID Bot |
| `ctx.pushname` | Nama Push Pengirim |

### Hot Reload

Perubahan di dalam `/plugins` (tambah/edit/hapus file) otomatis ke-detect dan di-reload. **Perubahan di `index.js`, `handler.js`, atau `settings.js` butuh restart manual** (`Ctrl+C` lalu `node index.js` lagi).

---

## Sistem Izin

| Status User | Command Bebas | `isPremium` | `isCreator` | `isAdmin` (Grup) |
|-------------|---------------|-------------|-------------|-------------------|
| Tidak Terdaftar (Private Chat) | ❌ Ditolak | ❌ | ❌ | ❌ |
| Tidak Terdaftar (Grup) | ✅ | ❌ | ❌ | Tergantung Status Admin |
| Premium | ✅ | ✅ | ❌ | Tergantung Status Admin |
| Creator | ✅ | ✅ (Bypass) | ✅ | ✅ (Bypass Cek Sender, Bot Tetap Wajib Admin) |

Database (`lib/database/owner.json`, `lib/database/premium.json`) berisi array JID WhatsApp:

```json
["628123456789@s.whatsapp.net"]
```

`owner.json` wajib diedit manual, `premium.json` bisa dikelola lewat command `.addprem`/`.delprem`.

---

## Daftar Command

| Command | Kategori | Syarat | Keterangan |
|---------|----------|--------|------------|
| `.menu` | - | Bebas | Tampilkan Semua Fitur |
| `.ping` | Tools | Bebas | Cek Kecepatan Respon & Info Server |
| `.owner` | - | Bebas | Kontak Owner |
| `.tiktok` | Download | Bebas | Download Video TikTok Tanpa Watermark |
| `.youtube` / `.play` | Download | Bebas | Download YouTube (Video/Audio) |
| `.mediafire` | Download | Bebas | Download File Mediafire |
| `.github` | Download | Bebas | Download Repo/File GitHub |
| `.videy` | Download | Bebas | Download Video Videy |
| `.sticker` / `.s` | Tools | Bebas | Bikin Sticker |
| `.toimg` | Tools | Bebas | Sticker ke Gambar |
| `.tourl` / `.upload` | Tools | Bebas | Upload Media ke URL |
| `.tts` | Tools | Bebas | Text to Speech |
| `.ssweb` | Tools | Bebas | Screenshot Website |
| `.lirik` | Tools | Bebas | Cari Lirik Lagu |
| `.get` | Tools | Owner/Premium | Ambil Data dari URL |
| `.kick` | Group | Admin | Keluarkan Anggota |
| `.promote` | Group | Admin | Jadikan Admin |
| `.demote` | Group | Admin | Turunkan Dari Admin |
| `.add` | Group | Admin | Tambah Anggota |
| `.open` / `.close` | Group | Admin | Buka/Kunci Grup |
| `.setname` | Group | Admin | Ganti Nama Grup |
| `.setdesc` | Group | Admin | Ganti Deskripsi Grup |
| `.resetlink` / `.revoke` | Group | Admin | Reset Link Undangan |
| `.antilink` | Group | Admin | Anti Link |
| `.antibot` | Group | Admin | Anti Bot |
| `.welcome` | Group | Admin | Welcome/Left/Promote/Demote |
| `.tagall` | Group | Admin | Tag Semua Anggota |
| `.hidetag` | Group | Admin | Tag Tanpa Keliatan |
| `.addprem` | Owner | Creator | Tambah User Premium |
| `.delprem` | Owner | Creator | Hapus User Premium |
| `.addowner` | Owner | Creator | Tambah Owner |
| `.delowner` | Owner | Creator | Hapus Owner |
| `.self` / `.public` | Owner | Creator | Mode Bot |
| `.backup` | Owner | Creator | Backup Script |
| `.clearsession` | Owner | Creator | Clear Session |
| `.mute` / `.unmute` | Owner | Creator | Mute Bot di Grup |
| `.leave` | Owner | Creator | Keluar dari Grup |
| `.join` | Owner | Creator | Masuk ke Grup via Link |

---

## Follow = Support

<p align="left">
  <a href="https://www.instagram.com/frrwll" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white">
  </a>
  <a href="https://youtube.com/@ZoraHost" target="_blank">
    <img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white">
  </a>
</p>

---

## Kredit

- **Library:** `npm:rixleys@latest`
- **Recode:** Zora
- **Base:** NoxXleys

> ⚠️ **Peringatan:** Jangan hapus credits. Hargai kerja keras pembuat script.

---

<p align="center">
  <sub>MIT License</sub>
</p>
