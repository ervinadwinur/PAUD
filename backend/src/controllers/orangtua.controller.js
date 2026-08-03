const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
  try {
    const data = await prisma.orangTua.findMany({
      include: { user: { select: { username: true, email: true, isActive: true } }, anak: true },
      orderBy: { nama: "asc" },
    });
    return success(res, "Daftar orang tua", data);
  } catch (err) {
    return error(res, "Gagal mengambil data orang tua", 500, err.message);
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const data = await prisma.orangTua.findUnique({
      where: { id: Number(id) },
      include: { user: true, anak: true },
    });
    if (!data) return error(res, "Data orang tua tidak ditemukan", 404);
    return success(res, "Detail orang tua", data);
  } catch (err) {
    return error(res, "Gagal mengambil detail orang tua", 500, err.message);
  }
}

async function create(req, res) {
  try {
    const { username, email, password, nama, noTelepon, alamat } = req.body;
    if (!username || !password || !nama) return error(res, "Username, password, dan nama wajib diisi", 400);
    const user = await prisma.user.create({ data: { username, email, password: await bcrypt.hash(password, 10), role: "ORANGTUA", orangTua: { create: { nama, noTelepon, alamat } } }, include: { orangTua: true } });
    return success(res, "Data orang tua berhasil ditambahkan", user.orangTua, 201);
  } catch (err) { return error(res, "Gagal menambahkan orang tua", 500, err.message); }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, noTelepon, alamat } = req.body;
    const data = await prisma.orangTua.update({
      where: { id: Number(id) },
      data: { nama, noTelepon, alamat },
    });
    return success(res, "Data orang tua berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui data orang tua", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.orangTua.delete({ where: { id: Number(id) } });
    return success(res, "Data orang tua berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus data orang tua", 500, err.message);
  }
}

module.exports = { getAll, getById, create, update, remove };
