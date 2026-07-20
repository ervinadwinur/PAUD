const router = require("express").Router();
const laporanController = require("../controllers/laporan.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate, authorize("ADMIN", "GURU")); // Kelola/Lihat Laporan

router.get("/absensi", laporanController.rekapAbsensi);
router.get("/pembayaran", laporanController.rekapPembayaran);
router.get("/siswa", laporanController.rekapSiswa);

module.exports = router;
