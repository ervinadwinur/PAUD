# API Sistem Informasi PAUD Kober Al-Musyawaroh

Backend REST API dibangun dengan **Express.js** dan **Prisma ORM**, mengikuti diagram use case:
Admin, Guru, dan Orang Tua — dengan Login sebagai `<<include>>` di setiap use case.

## 1. Instalasi

```bash
npm install
cp .env.example .env   # lalu sesuaikan DATABASE_URL dan JWT_SECRET
npx prisma migrate dev --name init
npm run seed            # membuat akun admin default (admin/admin123)
npm run dev
```

## 2. Struktur Folder

```
paud-api/
├── prisma/
│   ├── schema.prisma      # model database
│   └── seed.js
├── src/
│   ├── config/db.js       # instance Prisma Client
│   ├── middlewares/       # auth (login), role (akses per aktor), upload
│   ├── controllers/       # logika tiap use case
│   ├── routes/            # endpoint & pembatasan role
│   ├── utils/             # helper response & jwt
│   ├── app.js
│   └── server.js
└── package.json
```

## 3. Pemetaan Use Case → Endpoint

| Aktor | Use Case | Endpoint |
|---|---|---|
| Semua | Login | `POST /api/auth/login` |
| Admin | Kelola Pengguna | `/api/pengguna` (CRUD) |
| Admin | Kelola Data Guru | `/api/guru` |
| Admin | Kelola Data Orang Tua | `/api/orang-tua` |
| Admin | Kelola Data Kelas | `/api/kelas` |
| Admin | Kelola Data Siswa | `/api/siswa` (CRUD) |
| Admin | Kelola Absensi | `/api/absensi` |
| Admin | Verifikasi Pembayaran SPP | `PUT /api/pembayaran/:id/verifikasi` |
| Admin/Guru | Kelola/Lihat Laporan | `/api/laporan/absensi`, `/api/laporan/pembayaran`, `/api/laporan/siswa` |
| Guru | Lihat Data Siswa | `GET /api/siswa` |
| Guru | Input Absensi | `POST /api/absensi` |
| Guru | Input Kegiatan Harian | `POST /api/kegiatan-harian` (multipart, field `foto`) |
| Guru | Input/Kelola Perkembangan | `/api/perkembangan` |
| Guru | Input Rapor | `POST /api/rapor` (multipart, field `file`) |
| Orang Tua | Lihat Data Anak | `GET /api/siswa` (otomatis difilter sesuai anaknya) |
| Orang Tua | Lihat Absensi Anak | `GET /api/absensi?siswaId=` |
| Orang Tua | Lihat Kegiatan Harian | `GET /api/kegiatan-harian?siswaId=` |
| Orang Tua | Lihat Rapor Anak | `GET /api/rapor?siswaId=` |
| Orang Tua | Unggah Bukti Pembayaran | `POST /api/pembayaran/:id/upload-bukti` (multipart, field `bukti`) |
| Orang Tua | Lihat Status Pembayaran | `GET /api/pembayaran` |

## 4. Autentikasi

Kirim header `Authorization: Bearer <token>` untuk semua endpoint kecuali `/api/auth/login`.
Token berisi `role`, `guruId`, dan `orangTuaId` untuk pembatasan akses & filter data otomatis
(mis. Orang Tua hanya bisa melihat data anaknya sendiri).

## 5. Catatan

- File upload (bukti pembayaran, foto kegiatan, rapor) disimpan di folder `uploads/` dan
  dapat diakses via `GET /uploads/<nama_file>`.
- Ganti `provider` di `prisma/schema.prisma` ke `mysql` bila menggunakan MySQL.
