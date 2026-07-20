const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");

// POST /api/auth/login
// Frontend mengirim { email, password } — role dikembalikan lowercase
// (admin | guru | orangtua) agar cocok dengan routing di frontend.
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email dan password wajib diisi", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { guru: true, orangTua: true },
    });

    if (!user || !user.isActive) {
      return error(res, "Email atau kata sandi salah", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, "Email atau kata sandi salah", 401);
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role, // tetap UPPERCASE (ADMIN/GURU/ORANGTUA) — dipakai middleware authorize()
      nama: user.guru?.nama ?? user.orangTua?.nama ?? user.username,
      guruId: user.guru?.id ?? null,
      orangTuaId: user.orangTua?.id ?? null,
    };

    const token = generateToken(payload);

    return success(res, "Login berhasil", {
      token,
      user: payload,
    });
  } catch (err) {
    return error(res, "Gagal login", 500, err.message);
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        guru: true,
        orangTua: true,
      },
    });
    return success(res, "Data pengguna", user);
  } catch (err) {
    return error(res, "Gagal mengambil data pengguna", 500, err.message);
  }
}

// POST /api/auth/change-password
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return error(res, "Password lama salah", 400);

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    return success(res, "Password berhasil diubah");
  } catch (err) {
    return error(res, "Gagal mengubah password", 500, err.message);
  }
}

module.exports = { login, me, changePassword };
