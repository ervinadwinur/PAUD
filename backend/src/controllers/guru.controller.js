const prisma = require("../config/db");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
  try {
    const data = await prisma.guru.findMany({
      include: { user: { select: { username: true, email: true, isActive: true } }, kelas: true },
      orderBy: { nama: "asc" },
    });
    return success(res, "Daftar guru", data);
  } catch (err) {
    return error(res, "Gagal mengambil data guru", 500, err.message);
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const data = await prisma.guru.findUnique({
      where: { id: Number(id) },
      include: { user: true, kelas: true },
    });
    if (!data) return error(res, "Guru tidak ditemukan", 404);
    return success(res, "Detail guru", data);
  } catch (err) {
    return error(res, "Gagal mengambil detail guru", 500, err.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, nip, noTelepon, alamat } = req.body;
    const data = await prisma.guru.update({
      where: { id: Number(id) },
      data: { nama, nip, noTelepon, alamat },
    });
    return success(res, "Data guru berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui data guru", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.guru.delete({ where: { id: Number(id) } });
    return success(res, "Data guru berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus data guru", 500, err.message);
  }
}

module.exports = { getAll, getById, update, remove };
