const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const { success, error } = require("../utils/response");

function generatePassword(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function getAll(req, res) {
  try {
    const data = await prisma.guru.findMany({
      include: { user: { select: { username: true, email: true, isActive: true } }, kelas: true },
      orderBy: { nama: "asc" },
    });
    return success(res, "Daftar guru", data);
  } catch (err) {
    return error(res, "Gagal mengambil data guru", 500, err.message);
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const data = await prisma.guru.findUnique({
      where: { id: Number(id) },
      include: { user: true, kelas: true },
    });
    if (!data) return error(res, "Guru tidak ditemukan", 404);
    return success(res, "Detail guru", data);
  } catch (err) {
    return error(res, "Gagal mengambil detail guru", 500, err.message);
  }
}

async function create(req, res) {
  try {
    const { username, email, password, nama, nip, noTelepon, alamat } = req.body;

    if (!username || !nama) {
      return error(res, "Username dan nama wajib diisi", 400);
    }

    const usernameTaken = await prisma.user.findUnique({ where: { username } });
    if (usernameTaken) return error(res, "Username sudah digunakan", 400);

    if (email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) return error(res, "Email sudah digunakan", 400);
    }

    // Kalau admin tidak mengisi password, generate otomatis
    const isGenerated = !password;
    const plainPassword = password || generatePassword();

    if (plainPassword.length < 6) {
      return error(res, "Password minimal 6 karakter", 400);
    }

    const data = await prisma.user.create({
      data: {
        username,
        email,
        password: await bcrypt.hash(plainPassword, 10),
        role: "GURU",
        guru: { create: { nama, nip, noTelepon, alamat } },
      },
      include: { guru: true },
    });

    return success(
      res,
      "Data guru berhasil ditambahkan",
      {
        guru: data.guru,
        generatedPassword: isGenerated ? plainPassword : null,
      },
      201,
    );
  } catch (err) {
    return error(res, "Gagal menambahkan guru", 500, err.message);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nama, nip, noTelepon, alamat, email, isActive } = req.body;

    const guru = await prisma.guru.findUnique({ where: { id: Number(id) } });
    if (!guru) return error(res, "Guru tidak ditemukan", 404);

    // Update email/status akun (kalau dikirim) sekaligus profil guru
    if (email !== undefined || isActive !== undefined) {
      await prisma.user.update({
        where: { id: guru.userId },
        data: {
          ...(email !== undefined && { email }),
          ...(isActive !== undefined && { isActive }),
        },
      });
    }

    const data = await prisma.guru.update({
      where: { id: Number(id) },
      data: { nama, nip, noTelepon, alamat },
      include: { user: true, kelas: true },
    });

    return success(res, "Data guru berhasil diperbarui", data);
  } catch (err) {
    return error(res, "Gagal memperbarui data guru", 500, err.message);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const guru = await prisma.guru.findUnique({ where: { id: Number(id) } });
    if (!guru) return error(res, "Guru tidak ditemukan", 404);

    // Hapus guru DAN akun user-nya sekaligus, biar tidak ada akun nyantel tanpa profil
    await prisma.$transaction([
      prisma.guru.delete({ where: { id: Number(id) } }),
      prisma.user.delete({ where: { id: guru.userId } }),
    ]);

    return success(res, "Data guru berhasil dihapus");
  } catch (err) {
    return error(res, "Gagal menghapus data guru", 500, err.message);
  }
}

async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return error(res, "Password minimal 6 karakter", 400);
    }

    const guru = await prisma.guru.findUnique({ where: { id: Number(id) } });
    if (!guru) return error(res, "Guru tidak ditemukan", 404);

    await prisma.user.update({
      where: { id: guru.userId },
      data: { password: await bcrypt.hash(password, 10) },
    });

    return success(res, "Password guru berhasil direset");
  } catch (err) {
    return error(res, "Gagal mereset password", 500, err.message);
  }
}

module.exports = { getAll, getById, create, update, remove, resetPassword };