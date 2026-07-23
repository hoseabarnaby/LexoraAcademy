# Lexora Academy — IELTS + HSK + JLPT + German CEFR

Versi ini adalah Lexora full. Fitur lama tetap dipertahankan, lalu ditambah mode German, pemilih bahasa baru, Listening Lab, cloud progress, achievements, blokir user, announcement, dan pengajuan banding.

## Bahasa dan jalur belajar

- English — IELTS.
- Mandarin — HSK 1–6.
- Japanese — JLPT N5–N1.
- German — Goethe / CEFR-aligned A1–C2.

Mode German menggunakan bank belajar Lexora yang dikurasi dan disusun per level CEFR. Data ini bukan daftar kosakata resmi Goethe.

Tombol ganti mode sekarang bernama **Pilih Bahasa**. Tombol membuka popup pilihan bahasa sehingga user tidak perlu menekan Mandarin → Japanese → German satu per satu.

## Fitur utama

- Vocabulary bank dan auto-load list yang ringan.
- Practice bank 40 soal per practice.
- Listening Lab: Dictation, Missing Words, Word Catch, dan Shadowing.
- Writing & Speaking Check.
- OpenRouter AI Feedback.
- Mandarin Tone Coach.
- Saved Words dan Saved Writing.
- Achievement + XP/listening progress.
- Login Email/Password dan Google melalui Supabase Auth.
- Cloud progress per user.
- Bug Report langsung ke dashboard admin Supabase, termasuk screenshot opsional.
- User Block System.
- Announcement popup.
- Pengajuan banding akun terblokir + upload bukti gambar.

Achievement termasuk First Vocabulary, 100 Words, 1000 Words, HSK Master, Deutsch Explorer, Listening Hero, Perfect Combo, Shadow Master, Sharp Ears, Grammar King, AI Student, dan Tone Hunter.

## 1. Konfigurasi Supabase

Di `index.html`, isi:

```js
window.LEXORA_SUPABASE_URL = "https://PROJECT_ID.supabase.co";
window.LEXORA_SUPABASE_ANON_KEY = "PASTE_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE";
```

Gunakan **Publishable key / anon key**. Jangan pernah memasukkan `service_role` ke website user.

## 2. Wajib jalankan schema terbaru

Buka Supabase Dashboard → SQL Editor → New Query.

Copy **seluruh isi**:

```text
supabase-schema.sql
```

Lalu klik **Run**.

Walaupun sebelumnya pernah menjalankan schema Lexora, jalankan file terbaru ini lagi. Schema terbaru:

- memperbolehkan `last_mode = german`;
- memperbolehkan saved word/writing mode German;
- membuat `lexora_block_appeals`;
- membuat private Storage bucket `lexora-block-appeals`;
- memasang RLS/policy agar user hanya dapat mengirim dan membaca banding miliknya sendiri.

## 3. Cloud data tables

- `lexora_user_data` — progress utama per user.
- `lexora_saved_words` — saved word per user.
- `lexora_user_achievements` — achievement yang sudah unlocked.
- `lexora_saved_writing` — writing/kalimat dan AI feedback yang disimpan.
- `lexora_user_controls` — status blokir user.
- `lexora_announcements` — pemberitahuan global.
- `lexora_announcement_dismissals` — popup yang sudah ditutup user.
- `lexora_block_appeals` — pengajuan banding user terblokir.

## 4. Login Google

Panduan ada di:

```text
GOOGLE-LOGIN-SETUP.md
```

## 5. OpenRouter dan Supabase Bug Inbox

Konfigurasi tetap berada di `index.html`:

```js
window.LEXORA_OPENROUTER_API_KEY = "PASTE_OPENROUTER_API_KEY_HERE";
window.LEXORA_WEB3FORMS_ACCESS_KEY = "PASTE_WEB3FORMS_ACCESS_KEY_HERE";
```

Jangan push OpenRouter API key asli ke repository public.

## 6. User Block + Appeal

Jika `blocked = true`, popup blokir tidak dapat ditutup dan website terkunci. User masih dapat:

- Keluar dari akun.
- Menekan **Hubungi Admin / Ajukan Banding**.
- Menulis pesan banding.
- Mengupload bukti PNG/JPG/WEBP maksimal 5 MB.

Bukti disimpan di bucket private `lexora-block-appeals`. Admin membuka bukti melalui signed URL langsung dari Supabase dengan akses admin.

Lihat juga:

```text
SYSTEM-CONTROL-SETUP.md
```

## Struktur root

```text
index.html
app.js
supabase-auth.js
styles.css
supabase-schema.sql
server.js
assets/
data/
README.md
SYSTEM-CONTROL-SETUP.md
GOOGLE-LOGIN-SETUP.md
```


## Admin HTML tanpa npm

Admin tersedia di folder `admin/`. Setelah di-upload ke repository yang sama, buka:

```text
https://USERNAME.github.io/NAMA-REPO/admin/
```

Panel admin tidak mempunyai form login kedua. Login dahulu di Lexora utama pada domain yang sama, lalu buka `/admin/`. Akses data tetap dijaga oleh Supabase Auth dan Row Level Security.

Konfigurasi utama dan admin sekarang cukup diisi satu kali pada `lexora-config.js`.

Setelah menjalankan `supabase-schema.sql`, jadikan akunmu admin melalui SQL Editor:

```sql
insert into public.lexora_admins (user_id)
select id from auth.users
where lower(email) = lower('EMAIL_ADMIN_KAMU')
on conflict (user_id) do nothing;
```

## Konfigurasi versi full inline

Buka `index.html`, scroll ke bagian paling bawah, lalu cari komentar `KONFIGURASI LEXORA — ISI DI SINI`. Isi langsung:

- `window.LEXORA_SUPABASE_URL`
- `window.LEXORA_SUPABASE_ANON_KEY`
- `window.LEXORA_OPENROUTER_API_KEY`
- `window.LEXORA_OPENROUTER_MODEL`

Bug report, banding blokir, cloud progress, saved words, achievements, saved writing, block control, dan announcement tetap memakai Supabase/schema yang disertakan.

Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY` atau key `sb_secret_...` di `index.html`.


## Lexora Universe / Adventure Mode
Versi ini menambahkan halaman Adventure tanpa menghapus fitur lama:
- Lexora City map
- 8 karakter interaktif
- dialog, friendship, gifts
- daily/random missions
- XP, coins, level, streak
- Grammar Detective case
- Mr. Error boss battle
- World Map 4 bahasa
- responsive mobile
Data Adventure disimpan lokal dengan localStorage dan tidak mengganggu cloud progress Lexora lama.
