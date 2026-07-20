const prisma = require("../config/db");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
  try {
    const { role, orangTuaId } = req.user;
    const { siswaId } = req.query;

    const where = {};
    if (siswaId) where.siswaId = Number(siswaId);
    if (role === "ORANGTUA") where.siswa = { orangTuaId };

    const data = await prisma.kegiatanHarian.findMany({
      where,
      include: {
        siswa: { select: { id: true, nama: true } },
        guru: { select: { id: true, nama: true } },
      },
      orderBy: { tanggal: "desc" },
    });
    return success(res, "Data kegiatan harian", data);
  } catch (err) {
    return error(res, "Gagal mengambil data kegiatan harian", 500, err.message);
  }
}

// POST /api/kegiatan-harian (Guru - Input Kegiatan Harian)
async function create(req, res) {
  try {
    const { siswaId, tanggal, judul, deskripsi } = req.body;
    const guruId = req.user.guruId;
    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const data = await prisma.kegiatanHarian.create({
      data: {
        siswaId: Number(siswaId),
        guruId,
        tanggal: new Date(tanggal),
        judul,
        deskripsi,
        fotoUrl,
      },
    });
    return success(res, "Kegiatan harian berhasil ditambahkan", data, 201);
  } catch (err) {
    return error(res, "Gagal menambahkan kegiatan harian", 500, err.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { judul, deskripsi } = req.body;
    const data = await prisma.kegiatanHarian.update({
      where: { id: Number(id) },
      data: { judul, deskripsi },
    });
    return success(res, "Kegiatan harian berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui kegiatan harian", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.kegiatanHarian.delete({ where: { id: Number(id) } });
    return success(res, "Kegiatan harian berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus kegiatan harian", 500, err.message);
  }
}

module.exports = { getAll, create, update, remove };
