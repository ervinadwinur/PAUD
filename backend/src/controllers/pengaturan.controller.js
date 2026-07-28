const prisma = require("../config/db");
const { success, error } = require("../utils/response");

async function get(req, res) {
  try {
    const data = await prisma.pengaturanSekolah.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
    return success(res, "Pengaturan sekolah", data);
  } catch (err) { return error(res, "Gagal mengambil pengaturan", 500, err.message); }
}

async function update(req, res) {
  try {
    const { nama, alamat, noTelepon, email, namaKepala } = req.body;
    const data = await prisma.pengaturanSekolah.upsert({ where: { id: 1 }, update: { nama, alamat, noTelepon, email, namaKepala }, create: { id: 1, nama, alamat, noTelepon, email, namaKepala } });
    return success(res, "Pengaturan sekolah berhasil disimpan", data);
  } catch (err) { return error(res, "Gagal menyimpan pengaturan", 500, err.message); }
}

module.exports = { get, update };
