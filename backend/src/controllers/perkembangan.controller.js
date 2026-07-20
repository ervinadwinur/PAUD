const prisma = require("../config/db");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
  try {
    const { role, orangTuaId } = req.user;
    const { siswaId } = req.query;

    const where = {};
    if (siswaId) where.siswaId = Number(siswaId);
    if (role === "ORANGTUA") where.siswa = { orangTuaId };

    const data = await prisma.perkembangan.findMany({
      where,
      include: {
        siswa: { select: { id: true, nama: true } },
        guru: { select: { id: true, nama: true } },
      },
      orderBy: { tanggal: "desc" },
    });
    return success(res, "Data perkembangan anak", data);
  } catch (err) {
    return error(res, "Gagal mengambil data perkembangan anak", 500, err.message);
  }
}

// POST /api/perkembangan (Guru - Kelola/Input Perkembangan)
async function create(req, res) {
  try {
    const { siswaId, aspek, deskripsi, tanggal } = req.body;
    const guruId = req.user.guruId;

    const data = await prisma.perkembangan.create({
      data: {
        siswaId: Number(siswaId),
        guruId,
        aspek,
        deskripsi,
        tanggal: new Date(tanggal),
      },
    });
    return success(res, "Data perkembangan berhasil ditambahkan", data, 201);
  } catch (err) {
    return error(res, "Gagal menambahkan data perkembangan", 500, err.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { aspek, deskripsi } = req.body;
    const data = await prisma.perkembangan.update({
      where: { id: Number(id) },
      data: { aspek, deskripsi },
    });
    return success(res, "Data perkembangan berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui data perkembangan", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.perkembangan.delete({ where: { id: Number(id) } });
    return success(res, "Data perkembangan berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus data perkembangan", 500, err.message);
  }
}

module.exports = { getAll, create, update, remove };
