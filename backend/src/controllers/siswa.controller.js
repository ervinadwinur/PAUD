const prisma = require("../config/db");
const { success, error } = require("../utils/response");

// GET /api/siswa
// Admin & Guru: semua siswa. Orang Tua: hanya anaknya sendiri (Lihat Data Anak).
async function getAll(req, res) {
  try {
    const { role, orangTuaId } = req.user;

    const where = role === "ORANGTUA" ? { orangTuaId } : {};

    const data = await prisma.siswa.findMany({
      where,
      include: {
        kelas: { select: { id: true, nama: true } },
        orangTua: { select: { id: true, nama: true, noTelepon: true } },
      },
      orderBy: { nama: "asc" },
    });
    return success(res, "Daftar siswa", data);
  } catch (err) {
    return error(res, "Gagal mengambil data siswa", 500, err.message);
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const { role, orangTuaId } = req.user;

    const siswa = await prisma.siswa.findUnique({
      where: { id: Number(id) },
      include: { kelas: true, orangTua: true },
    });

    if (!siswa) return error(res, "Siswa tidak ditemukan", 404);

    if (role === "ORANGTUA" && siswa.orangTuaId !== orangTuaId) {
      return error(res, "Anda tidak memiliki akses ke data siswa ini", 403);
    }

    return success(res, "Detail siswa", siswa);
  } catch (err) {
    return error(res, "Gagal mengambil detail siswa", 500, err.message);
  }
}

// POST /api/siswa (Admin - Kelola Data Siswa)
async function create(req, res) {
  try {
    const { nis, nama, tanggalLahir, jenisKelamin, alamat, kelasId, orangTuaId } = req.body;

    const data = await prisma.siswa.create({
      data: {
        nis,
        nama,
        tanggalLahir: new Date(tanggalLahir),
        jenisKelamin,
        alamat,
        kelasId: kelasId ? Number(kelasId) : null,
        orangTuaId: orangTuaId ? Number(orangTuaId) : null,
      },
    });
    return success(res, "Data siswa berhasil ditambahkan", data, 201);
  } catch (err) {
    return error(res, "Gagal menambahkan data siswa", 500, err.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, tanggalLahir, jenisKelamin, alamat, kelasId, orangTuaId } = req.body;

    const data = await prisma.siswa.update({
      where: { id: Number(id) },
      data: {
        nama,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
        jenisKelamin,
        alamat,
        kelasId: kelasId ? Number(kelasId) : undefined,
        orangTuaId: orangTuaId ? Number(orangTuaId) : undefined,
      },
    });
    return success(res, "Data siswa berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui data siswa", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.siswa.delete({ where: { id: Number(id) } });
    return success(res, "Data siswa berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus data siswa", 500, err.message);
  }
}

module.exports = { getAll, getById, create, update, remove };
