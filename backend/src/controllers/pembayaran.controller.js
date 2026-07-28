const prisma = require("../config/db");
const { success, error } = require("../utils/response");

// GET /api/pembayaran?siswaId=&status=
// Admin/Guru: semua. Orang Tua (Lihat Status Pembayaran): hanya milik anaknya.
async function getAll(req, res) {
  try {
    const { role, orangTuaId } = req.user;
    const { siswaId, status } = req.query;

    const where = {};
    if (siswaId) where.siswaId = Number(siswaId);
    if (status) where.status = status;
    if (role === "ORANGTUA") where.siswa = { orangTuaId };

    const data = await prisma.pembayaran.findMany({
      where,
      include: {
        siswa: {
          select: {
            id: true,
            nama: true,
            nis: true,
            kelas: { select: { nama: true } },
            orangTua: { select: { nama: true, noTelepon: true } },
          },
        },
      },
      orderBy: [{ tahun: "desc" }, { bulan: "desc" }],
    });
    return success(res, "Data pembayaran SPP", data);
  } catch (err) {
    return error(res, "Gagal mengambil data pembayaran", 500, err.message);
  }
}

// POST /api/pembayaran/tagihan (Admin - buat tagihan bulanan)
async function createTagihan(req, res) {
  try {
    const { siswaId, bulan, tahun, jumlah } = req.body;
    const data = await prisma.pembayaran.create({
      data: { siswaId: Number(siswaId), bulan: Number(bulan), tahun: Number(tahun), jumlah: Number(jumlah) },
    });
    return success(res, "Tagihan SPP berhasil dibuat", data, 201);
  } catch (err) {
    return error(res, "Gagal membuat tagihan SPP", 500, err.message);
  }
}

// POST /api/pembayaran/:id/upload-bukti (Orang Tua - Unggah Bukti Pembayaran)
async function uploadBukti(req, res) {
  try {
    const { id } = req.params;
    const { orangTuaId, role } = req.user;

    if (!req.file) return error(res, "File bukti pembayaran wajib diunggah", 400);

    const pembayaran = await prisma.pembayaran.findUnique({
      where: { id: Number(id) },
      include: { siswa: true },
    });
    if (!pembayaran) return error(res, "Data tagihan tidak ditemukan", 404);

    if (role === "ORANGTUA" && pembayaran.siswa.orangTuaId !== orangTuaId) {
      return error(res, "Anda tidak memiliki akses ke tagihan ini", 403);
    }

    const data = await prisma.pembayaran.update({
      where: { id: Number(id) },
      data: {
        buktiUrl: `/uploads/${req.file.filename}`,
        status: "MENUNGGU_VERIFIKASI",
        tanggalUpload: new Date(),
      },
    });

    return success(res, "Bukti pembayaran berhasil diunggah, menunggu verifikasi", data);
  } catch (err) {
    return error(res, "Gagal mengunggah bukti pembayaran", 500, err.message);
  }
}

// PUT /api/pembayaran/:id/verifikasi (Admin - Verifikasi Pembayaran SPP)
async function verifikasi(req, res) {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body; // status: LUNAS | DITOLAK

    if (!["LUNAS", "DITOLAK"].includes(status)) {
      return error(res, "Status verifikasi tidak valid", 400);
    }

    const data = await prisma.pembayaran.update({
      where: { id: Number(id) },
      data: {
        status,
        catatan,
        tanggalVerifikasi: new Date(),
        diverifikasiOleh: req.user.id,
      },
    });

    return success(res, "Pembayaran berhasil diverifikasi", data);
  } catch (err) {
    return error(res, "Gagal memverifikasi pembayaran", 500, err.message);
  }
}

// POST /api/pembayaran/:id/pengingat-wa (Admin)
// Menyiapkan tautan WhatsApp; pesan baru dikirim setelah admin meninjaunya dan
// menekan tombol kirim di aplikasi WhatsApp.
async function buatPengingatWhatsApp(req, res) {
  try {
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        siswa: {
          include: { orangTua: { select: { nama: true, noTelepon: true } } },
        },
      },
    });

    if (!pembayaran) return error(res, "Data tagihan tidak ditemukan", 404);
    if (pembayaran.status === "LUNAS") {
      return error(res, "Pengingat tidak dapat dikirim karena tagihan sudah lunas", 400);
    }

    const orangTua = pembayaran.siswa.orangTua;
    if (!orangTua?.noTelepon) {
      return error(res, "Nomor WhatsApp orang tua belum tersedia", 400);
    }

    let nomor = orangTua.noTelepon.replace(/\D/g, "");
    if (nomor.startsWith("0")) nomor = `62${nomor.slice(1)}`;
    if (!/^62\d{8,13}$/.test(nomor)) {
      return error(res, "Nomor WhatsApp orang tua tidak valid", 400);
    }

    const namaBulan = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
      new Date(2000, pembayaran.bulan - 1, 1)
    );
    const nominal = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(pembayaran.jumlah);
    const namaSekolah = process.env.NAMA_SEKOLAH || "PAUD Kober Al-Musyawaroh";
    const pesan = `Yth. Bapak/Ibu ${orangTua.nama},\n\nPengingat pembayaran SPP ananda ${pembayaran.siswa.nama} periode ${namaBulan} ${pembayaran.tahun} sebesar ${nominal}. Status tagihan saat ini: ${pembayaran.status.replace(/_/g, " ")}.\n\nMohon segera melakukan pembayaran dan mengunggah bukti pembayaran melalui aplikasi.\n\nTerima kasih.\n${namaSekolah}`;

    return success(res, "Tautan pengingat WhatsApp berhasil dibuat", {
      namaOrangTua: orangTua.nama,
      nomor,
      pesan,
      whatsappUrl: `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`,
    });
  } catch (err) {
    return error(res, "Gagal membuat pengingat WhatsApp", 500, err.message);
  }
}

module.exports = { getAll, createTagihan, uploadBukti, verifikasi, buatPengingatWhatsApp };
