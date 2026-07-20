const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { success, error } = require("../utils/response");

// GET /api/pengguna
async function getAll(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        guru: { select: { id: true, nama: true } },
        orangTua: { select: { id: true, nama: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return success(res, "Daftar pengguna", users);
  } catch (err) {
    return error(res, "Gagal mengambil data pengguna", 500, err.message);
  }
}

// POST /api/pengguna
async function create(req, res) {
  try {
    const { username, email, password, role, nama, noTelepon, alamat, nip } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        role,
        ...(role === "GURU" && {
          guru: { create: { nama, nip, noTelepon, alamat } },
        }),
        ...(role === "ORANGTUA" && {
          orangTua: { create: { nama, noTelepon, alamat } },
        }),
      },
      include: { guru: true, orangTua: true },
    });

    return success(res, "Pengguna berhasil dibuat", user, 201);
  } catch (err) {
    return error(res, "Gagal membuat pengguna", 500, err.message);
  }
}

// PUT /api/pengguna/:id
async function update(req, res) {
  try {
    const { id } = req.params;
    const { email, isActive, role } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, isActive, role },
    });

    return success(res, "Pengguna berhasil diperbarui", user);
  } catch (err) {
    return error(res, "Gagal memperbarui pengguna", 500, err.message);
  }
}

// PUT /api/pengguna/:id/reset-password
async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashed },
    });

    return success(res, "Password pengguna berhasil direset");
  } catch (err) {
    return error(res, "Gagal reset password", 500, err.message);
  }
}

// DELETE /api/pengguna/:id
async function remove(req, res) {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    return success(res, "Pengguna berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus pengguna", 500, err.message);
  }
}

module.exports = { getAll, create, update, resetPassword, remove };
