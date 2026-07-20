const prisma = require("../config/db");
const { success, error } = require("../utils/response");

// GET /api/absensi?siswaId=&tanggal=
async function getAll(req, res) {
  try {
    const { role, orangTuaId } = req.user;
    const { siswaId, tanggal } = req.query;

    const where = {};
    if (siswaId) where.siswaId = Number(siswaId);
    if (tanggal) where.tanggal = new Date(tanggal);

    if (role === "ORANGTUA") {
      where.siswa = { orangTuaId };
    }

    const data = await prisma.absensi.findMany({
      where,
      include: { siswa: { select: { id: true, nama: true, nis: true } } },
      orderBy: { tanggal: "desc" },
    });
    return success(res, "Data absensi", data);
  } catch (err) {
    return error(res, "Gagal mengambil data absensi", 500, err.message);
  }
}

// POST /api/absensi (Guru - Input Absensi)
async function create(req, res) {
  try {
    const { siswaId, tanggal, status, keterangan } = req.body;

    const data = await prisma.absensi.upsert({
      where: { siswaId_tanggal: { siswaId: Number(siswaId), tanggal: new Date(tanggal) } },
      update: { status, keterangan },
      create: { siswaId: Number(siswaId), tanggal: new Date(tanggal), status, keterangan },
    });

    return success(res, "Absensi berhasil disimpan", data, 201);
  } catch (err) {
    return error(res, "Gagal menyimpan absensi", 500, err.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { status, keterangan } = req.body;
    const data = await prisma.absensi.update({
      where: { id: Number(id) },
      data: { status, keterangan },
    });
    return success(res, "Absensi berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui absensi", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.absensi.delete({ where: { id: Number(id) } });
    return success(res, "Absensi berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus absensi", 500, err.message);
  }
}

module.exports = { getAll, create, update, remove };
