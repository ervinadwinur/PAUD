const path = require("path");
const fs = require("fs");
const prisma = require("../config/db");
const { success, error } = require("../utils/response");

// GET /api/pengumuman — dipakai admin, guru, DAN orangtua (semua bisa lihat)
async function getAll(req, res) {
  try {
    const data = await prisma.pengumuman.findMany({
      include: { author: { select: { username: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return success(res, "Daftar pengumuman", data);
  } catch (err) {
    return error(res, "Gagal mengambil pengumuman", 500, err.message);
  }
}

// POST /api/pengumuman — hanya admin
async function create(req, res) {
  try {
    const { title, category, priority, content, date, time } = req.body;

    if (!title || !content) {
      return error(res, "Judul dan isi pengumuman wajib diisi", 400);
    }

    const data = await prisma.pengumuman.create({
      data: {
        title,
        category: category || "umum",
        priority: priority || "biasa",
        content,
        date: new Date(date),
        time,
        fileName: req.file ? req.file.originalname : null,
        filePath: req.file ? req.file.filename : null,
        fileSize: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : null,
        authorId: req.user.id,
      },
      include: { author: { select: { username: true, email: true } } },
    });

    return success(res, "Pengumuman berhasil dibuat", data, 201);
  } catch (err) {
    return error(res, "Gagal membuat pengumuman", 500, err.message);
  }
}

// PUT /api/pengumuman/:id — hanya admin
async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, category, priority, content, date, time } = req.body;

    const existing = await prisma.pengumuman.findUnique({ where: { id: Number(id) } });
    if (!existing) return error(res, "Pengumuman tidak ditemukan", 404);

    // Kalau ada file baru diupload, hapus file lama dari disk
    if (req.file && existing.filePath) {
      const oldPath = path.join(__dirname, "../../uploads/pengumuman", existing.filePath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const data = await prisma.pengumuman.update({
      where: { id: Number(id) },
      data: {
        title,
        category,
        priority,
        content,
        date: date ? new Date(date) : undefined,
        time,
        ...(req.file && {
          fileName: req.file.originalname,
          filePath: req.file.filename,
          fileSize: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
        }),
      },
      include: { author: { select: { username: true, email: true } } },
    });

    return success(res, "Pengumuman berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui pengumuman", 500, err.message);
  }
}

// DELETE /api/pengumuman/:id — hanya admin
async function remove(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.pengumuman.findUnique({ where: { id: Number(id) } });
    if (!existing) return error(res, "Pengumuman tidak ditemukan", 404);

    if (existing.filePath) {
      const filePath = path.join(__dirname, "../../uploads/pengumuman", existing.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.pengumuman.delete({ where: { id: Number(id) } });
    return success(res, "Pengumuman berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus pengumuman", 500, err.message);
  }
}

module.exports = { getAll, create, update, remove };