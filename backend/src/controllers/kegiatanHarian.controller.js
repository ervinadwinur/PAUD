const path = require("path");
const fs = require("fs");
const prisma = require("../config/db");
const { success, error } = require("../utils/response");

// GET /api/kegiatan-harian?kelasId=&tanggal=
async function getAll(req, res) {
  try {
    const { role, orangTuaId } = req.user;
    const { kelasId, tanggal } = req.query;

    const where = {};
    if (kelasId) where.kelasId = Number(kelasId);
    if (tanggal) where.tanggal = new Date(tanggal);

    if (role === "ORANGTUA") {
      const anak = await prisma.siswa.findMany({
        where: { orangTuaId },
        select: { kelasId: true },
      });
      const kelasIds = anak.map((a) => a.kelasId).filter(Boolean);
      where.kelasId = kelasId ? Number(kelasId) : { in: kelasIds };
    }

    const data = await prisma.kegiatanHarian.findMany({
      where,
      include: {
        kelas: { select: { id: true, nama: true } },
        guru: { select: { id: true, nama: true } },
      },
      orderBy: { tanggal: "desc" },
    });
    return success(res, "Data kegiatan harian", data);
  } catch (err) {
    return error(res, "Gagal mengambil data kegiatan harian", 500, err.message);
  }
}

// POST /api/kegiatan-harian (Guru - Input/Update Kegiatan Harian)
// Menangani create DAN update sekaligus — kalau body punya "id", berarti update.
async function create(req, res) {
  try {
    const { id, kelasId, tanggal, tema, deskripsi, catatan, hapusFoto } = req.body;
    const guruId = req.user.guruId;

    if (!kelasId || !tanggal || !tema) {
      return error(res, "Kelas, tanggal, dan tema wajib diisi", 400);
    }

    const baseData = {
      kelasId: Number(kelasId),
      guruId,
      tanggal: new Date(tanggal),
      tema,
      deskripsi: deskripsi || "",
      catatan: catatan || null,
    };

    if (id) {
      // Mode update
      const existing = await prisma.kegiatanHarian.findUnique({ where: { id: Number(id) } });
      if (!existing) return error(res, "Kegiatan harian tidak ditemukan", 404);

      let fotoUrl = existing.fotoUrl;

      if (req.file) {
        if (existing.fotoUrl) {
          const oldPath = path.join(__dirname, "../..", existing.fotoUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        fotoUrl = `/uploads/kegiatan-harian/${req.file.filename}`;
      } else if (hapusFoto === "true") {
        if (existing.fotoUrl) {
          const oldPath = path.join(__dirname, "../..", existing.fotoUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        fotoUrl = null;
      }

      const data = await prisma.kegiatanHarian.update({
        where: { id: Number(id) },
        data: { ...baseData, fotoUrl },
      });
      return success(res, "Kegiatan harian berhasil diperbarui", data);
    }

    // Mode create
    const fotoUrl = req.file ? `/uploads/kegiatan-harian/${req.file.filename}` : null;

    const data = await prisma.kegiatanHarian.create({
      data: { ...baseData, fotoUrl },
    });
    return success(res, "Kegiatan harian berhasil ditambahkan", data, 201);
  } catch (err) {
    return error(res, "Gagal menyimpan kegiatan harian", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.kegiatanHarian.findUnique({ where: { id: Number(id) } });
    if (!existing) return error(res, "Kegiatan harian tidak ditemukan", 404);

    if (existing.fotoUrl) {
      const oldPath = path.join(__dirname, "../..", existing.fotoUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await prisma.kegiatanHarian.delete({ where: { id: Number(id) } });
    return success(res, "Kegiatan harian berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus kegiatan harian", 500, err.message);
  }
}

module.exports = { getAll, create, remove };