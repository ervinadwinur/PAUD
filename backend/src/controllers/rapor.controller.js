const prisma = require("../config/db");
const { success, error } = require("../utils/response");

async function getAll(req, res) {
  try {
    const { role, orangTuaId } = req.user;
    const { siswaId } = req.query;

    const where = {};
    if (siswaId) where.siswaId = Number(siswaId);
    if (role === "ORANGTUA") where.siswa = { orangTuaId };

    const data = await prisma.rapor.findMany({
      where,
      include: {
        siswa: { select: { id: true, nama: true } },
        guru: { select: { id: true, nama: true } },
      },
      orderBy: [{ tahunAjaran: "desc" }, { semester: "desc" }],
    });
    return success(res, "Data rapor", data);
  } catch (err) {
    return error(res, "Gagal mengambil data rapor", 500, err.message);
  }
}

// POST /api/rapor (Guru - Input/Kelola Rapor)
async function create(req, res) {
  try {
    const { siswaId, semester, tahunAjaran, catatan } = req.body;
    const guruId = req.user.guruId;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const data = await prisma.rapor.upsert({
      where: { siswaId_semester_tahunAjaran: { siswaId: Number(siswaId), semester, tahunAjaran } },
      update: { catatan, ...(fileUrl && { fileUrl }) },
      create: { siswaId: Number(siswaId), guruId, semester, tahunAjaran, catatan, fileUrl },
    });

    return success(res, "Rapor berhasil disimpan", data, 201);
  } catch (err) {
    return error(res, "Gagal menyimpan rapor", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.rapor.delete({ where: { id: Number(id) } });
    return success(res, "Rapor berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus rapor", 500, err.message);
  }
}

module.exports = { getAll, create, remove };
