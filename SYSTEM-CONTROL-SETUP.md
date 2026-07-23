# Lexora User Control, Announcement, dan Appeal System

Sistem ini sudah dipasang ke website Lexora utama.

## 1. Wajib jalankan SQL terbaru

Buka Supabase → SQL Editor → New Query. Paste seluruh isi `supabase-schema.sql`, lalu klik Run.

Schema terbaru menangani:

- `lexora_user_controls`
- `lexora_announcements`
- `lexora_announcement_dismissals`
- `lexora_block_appeals`
- private Storage bucket `lexora-block-appeals`
- policy upload/read bukti banding per user
- constraint mode `german` pada tabel cloud Lexora

## 2. Tes blokir user

Buka Table Editor → `lexora_user_controls`.

Cari `user_id` akun yang ingin dites. Ubah:

- `blocked` = `true`
- `block_reason` = alasan blokir
- `blocked_at` = waktu sekarang, opsional
- `blocked_until` = kosong untuk blokir tanpa batas waktu

Website menampilkan popup **Akun kamu terblokir**. Popup utama tidak memiliki tombol X dan user tidak dapat memakai fitur Lexora.

User masih dapat:

- `Keluar dari akun`
- `Hubungi Admin / Ajukan Banding`

## 3. Pengajuan banding user

Saat user terblokir, tombol **Hubungi Admin / Ajukan Banding** membuka form di atas lock popup.

User dapat:

- menulis alasan banding;
- mengupload screenshot/foto bukti;
- mengirim pengajuan ke `lexora_block_appeals`.

Format gambar:

- PNG
- JPG/JPEG
- WEBP
- maksimal 5 MB

File disimpan pada bucket private:

```text
lexora-block-appeals
```

Path file diawali User ID sehingga policy Storage membatasi user ke folder miliknya sendiri.

Status banding:

```text
pending
reviewing
approved
rejected
```

Website admin terbaru dapat melihat bukti, menulis catatan admin, menandai reviewing, reject, atau **Approve + Unblock**.

## 4. Membuka blokiran

Ubah:

```text
blocked = false
```

Website user akan terbuka kembali setelah Realtime menerima perubahan atau fallback polling berjalan.

## 5. Announcement global

Buka Table Editor → `lexora_announcements` → Insert row.

Contoh:

- `title`: `Update Lexora`
- `message`: `Kami sedang meningkatkan fitur AI.`
- `kind`: `maintenance`
- `priority`: `10`
- `active`: `true`

Jenis `kind`:

- `info`
- `update`
- `maintenance`
- `warning`

User dapat menutup announcement. Dismissal disimpan per akun pada `lexora_announcement_dismissals`.

Untuk menghilangkan announcement secara global, ubah `active = false`.

## 6. Realtime

`lexora_user_controls` dan `lexora_announcements` dipantau melalui Supabase Realtime. Website juga melakukan fallback check sekitar setiap 20 detik.

## Keamanan

User biasa hanya dapat membaca status blokir miliknya dan mengirim/membaca banding miliknya sendiri. User tidak mendapat policy update untuk membuka blokir sendiri.

Admin panel harus memakai server lokal/private dengan `SUPABASE_SERVICE_ROLE_KEY` di `.env`. Jangan taruh service role key di `index.html`, `app.js`, atau GitHub public.
