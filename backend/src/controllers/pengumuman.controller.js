const prisma = require("../config/db");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
  try {
    const where = req.user.role === "ADMIN" ? {} : { isPublished: true };
    const data = await prisma.pengumuman.findMany({ where, orderBy: { publishedAt: "desc" } });
    return success(res, "Daftar pengumuman", data);
  } catch (err) { return error(res, "Gagal mengambil pengumuman", 500, err.message); }
}

async function create(req, res) {
  try {
    const { judul, isi, isPublished } = req.body;
    if (!judul || !isi) return error(res, "Judul dan isi pengumuman wajib diisi", 400);
    const data = await prisma.pengumuman.create({ data: { judul, isi, isPublished: isPublished !== false, createdById: req.user.id } });
    return success(res, "Pengumuman berhasil dibuat", data, 201);
  } catch (err) { return error(res, "Gagal membuat pengumuman", 500, err.message); }
}

async function update(req, res) {
  try {
    const { judul, isi, isPublished } = req.body;
    const data = await prisma.pengumuman.update({ where: { id: Number(req.params.id) }, data: { judul, isi, isPublished } });
    return success(res, "Pengumuman berhasil diperbarui", data);
  } catch (err) { return error(res, "Gagal memperbarui pengumuman", 500, err.message); }
}

async function remove(req, res) {
  try { await prisma.pengumuman.delete({ where: { id: Number(req.params.id) } }); return success(res, "Pengumuman berhasil dihapus"); }
  catch (err) { return error(res, "Gagal menghapus pengumuman", 500, err.message); }
}

module.exports = { getAll, create, update, remove };
