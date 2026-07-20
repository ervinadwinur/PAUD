const prisma = require("../config/db");
const { success, error } = require("../utils/response");

// GET /api/laporan/absensi?kelasId=&bulan=&tahun=
async function rekapAbsensi(req, res) {
  try {
    const { kelasId, bulan, tahun } = req.query;

    const siswaWhere = kelasId ? { kelasId: Number(kelasId) } : {};

    const siswa = await prisma.siswa.findMany({
      where: siswaWhere,
      select: {
        id: true,
        nama: true,
        nis: true,
        absensi: {
          where: bulan && tahun
            ? {
                tanggal: {
                  gte: new Date(Number(tahun), Number(bulan) - 1, 1),
                  lt: new Date(Number(tahun), Number(bulan), 1),
                },
              }
            : undefined,
        },
      },
    });

    const rekap = siswa.map((s) => ({
      siswaId: s.id,
      nama: s.nama,
      nis: s.nis,
      hadir: s.absensi.filter((a) => a.status === "HADIR").length,
      izin: s.absensi.filter((a) => a.status === "IZIN").length,
      sakit: s.absensi.filter((a) => a.status === "SAKIT").length,
      alpa: s.absensi.filter((a) => a.status === "ALPA").length,
    }));

    return success(res, "Rekap laporan absensi", rekap);
  } catch (err) {
    return error(res, "Gagal membuat laporan absensi", 500, err.message);
  }
}

// GET /api/laporan/pembayaran?bulan=&tahun=
async function rekapPembayaran(req, res) {
  try {
    const { bulan, tahun } = req.query;
    const where = {};
    if (bulan) where.bulan = Number(bulan);
    if (tahun) where.tahun = Number(tahun);

    const data = await prisma.pembayaran.findMany({
      where,
      include: { siswa: { select: { nama: true, nis: true, kelas: { select: { nama: true } } } } },
    });

    const ringkasan = {
      totalTagihan: data.reduce((sum, p) => sum + p.jumlah, 0),
      totalLunas: data.filter((p) => p.status === "LUNAS").reduce((s, p) => s + p.jumlah, 0),
      jumlahBelumBayar: data.filter((p) => p.status === "BELUM_BAYAR").length,
      jumlahMenungguVerifikasi: data.filter((p) => p.status === "MENUNGGU_VERIFIKASI").length,
      jumlahLunas: data.filter((p) => p.status === "LUNAS").length,
      detail: data,
    };

    return success(res, "Rekap laporan pembayaran SPP", ringkasan);
  } catch (err) {
    return error(res, "Gagal membuat laporan pembayaran", 500, err.message);
  }
}

// GET /api/laporan/siswa (ringkasan jumlah siswa per kelas)
async function rekapSiswa(req, res) {
  try {
    const kelas = await prisma.kelas.findMany({
      select: {
        id: true,
        nama: true,
        _count: { select: { siswa: true } },
      },
    });
    return success(res, "Rekap jumlah siswa per kelas", kelas);
  } catch (err) {
    return error(res, "Gagal membuat laporan siswa", 500, err.message);
  }
}

module.exports = { rekapAbsensi, rekapPembayaran, rekapSiswa };
