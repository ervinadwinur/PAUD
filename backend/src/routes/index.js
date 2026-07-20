const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/pengguna", require("./pengguna.routes"));
router.use("/guru", require("./guru.routes"));
router.use("/orang-tua", require("./orangtua.routes"));
router.use("/kelas", require("./kelas.routes"));
router.use("/siswa", require("./siswa.routes"));
router.use("/absensi", require("./absensi.routes"));
router.use("/kegiatan-harian", require("./kegiatanHarian.routes"));
router.use("/perkembangan", require("./perkembangan.routes"));
router.use("/rapor", require("./rapor.routes"));
router.use("/pembayaran", require("./pembayaran.routes"));
router.use("/laporan", require("./laporan.routes"));

module.exports = router;
