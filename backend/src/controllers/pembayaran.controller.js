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
      include: { siswa: { select: { id: true, nama: true, nis: true } } },
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

module.exports = { getAll, createTagihan, uploadBukti, verifikasi };
