const router = require("express").Router();
const pembayaranController = require("../controllers/pembayaran.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

router.use(authenticate);

// Admin: Verifikasi Pembayaran | Orang Tua: Unggah Bukti & Lihat Status Pembayaran
router.get("/", authorize("ADMIN", "ORANGTUA"), pembayaranController.getAll);
router.post("/tagihan", authorize("ADMIN"), pembayaranController.createTagihan);
router.post("/:id/pengingat-wa", authorize("ADMIN"), pembayaranController.buatPengingatWhatsApp);
router.post("/:id/upload-bukti", authorize("ORANGTUA"), upload.single("bukti"), pembayaranController.uploadBukti);
router.put("/:id/verifikasi", authorize("ADMIN"), pembayaranController.verifikasi);

module.exports = router;
