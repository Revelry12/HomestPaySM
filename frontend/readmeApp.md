# HomestPay - Sistem Manajemen Tagihan Perumahan

Project ini terdiri dari Frontend (React + Vite) dan Backend (Express + MySQL).

## Cara Menjalankan Project 

### 1. Persiapan Database
1. Buka SQLYog / phpMyAdmin.
2. Buat database baru bernama `db_tagihan_perumahan`.
3. Import file `database/database_homestpay.sql` ke dalamnya.

### 2. Setup Backend
1. Masuk ke folder backend: `cd backend`
2. Install library: `npm install`
3. Copy file `.env.example` menjadi `.env`.
4. Sesuaikan settingan DB di `.env` (jika ada password).
5. Jalankan server: `node index.js`

### 3. Setup Frontend
1. Buka terminal baru.
2. Masuk ke folder frontend: `cd frontend`
3. Install library: `npm install`
4. Jalankan web: `npm run dev`

### Login Admin
- Gunakan data yang ada di database tabel `pengguna`.