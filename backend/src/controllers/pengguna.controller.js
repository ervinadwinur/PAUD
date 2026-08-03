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
        guru: { select: { id: true, nama: true, nip: true, noTelepon: true, alamat: true } },
        orangTua: { select: { id: true, nama: true, noTelepon: true, alamat: true } },
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
// Bisa mengubah email/isActive/role, dan jika pengguna punya profil guru/orangTua
// terkait, ikut memperbarui nama/no. telepon/alamat (dan nip khusus guru).
async function update(req, res) {
  try {
    const { id } = req.params;
    const { email, isActive, role, nama, nip, noTelepon, alamat } = req.body;

    const existing = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { guru: true, orangTua: true },
    });

    if (!existing) {
      return error(res, "Pengguna tidak ditemukan", 404);
    }

    const data = {
      ...(email !== undefined && { email }),
      ...(isActive !== undefined && { isActive }),
      ...(role !== undefined && { role }),
    };

    if (existing.guru) {
      data.guru = {
        update: {
          ...(nama !== undefined && { nama }),
          ...(nip !== undefined && { nip }),
          ...(noTelepon !== undefined && { noTelepon }),
          ...(alamat !== undefined && { alamat }),
        },
      };
    } else if (existing.orangTua) {
      data.orangTua = {
        update: {
          ...(nama !== undefined && { nama }),
          ...(noTelepon !== undefined && { noTelepon }),
          ...(alamat !== undefined && { alamat }),
        },
      };
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data,
      include: { guru: true, orangTua: true },
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