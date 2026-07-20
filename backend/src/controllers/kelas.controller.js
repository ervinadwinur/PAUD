const prisma = require("../config/db");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
  try {
    const data = await prisma.kelas.findMany({
      include: { guru: { select: { id: true, nama: true } }, _count: { select: { siswa: true } } },
      orderBy: { nama: "asc" },
    });
    return success(res, "Daftar kelas", data);
  } catch (err) {
    return error(res, "Gagal mengambil data kelas", 500, err.message);
  }
}

async function create(req, res) {
  try {
    const { nama, tahunAjaran, guruId } = req.body;
    const data = await prisma.kelas.create({
      data: { nama, tahunAjaran, guruId: guruId ? Number(guruId) : null },
    });
    return success(res, "Kelas berhasil dibuat", data, 201);
  } catch (err) {
    return error(res, "Gagal membuat kelas", 500, err.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, tahunAjaran, guruId } = req.body;
    const data = await prisma.kelas.update({
      where: { id: Number(id) },
      data: { nama, tahunAjaran, guruId: guruId ? Number(guruId) : null },
    });
    return success(res, "Kelas berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui kelas", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.kelas.delete({ where: { id: Number(id) } });
    return success(res, "Kelas berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus kelas", 500, err.message);
  }
}

module.exports = { getAll, create, update, remove };
