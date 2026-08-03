// routes/pembayaran.routes.js
const router = require("express").Router();
const pembayaranController = require("../controllers/pembayaran.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const { uploadBukti } = require("../middlewares/upload.middleware");

router.use(authenticate);

router.get("/", authorize("ADMIN", "GURU", "ORANGTUA"), pembayaranController.getAll);
router.post("/tagihan", authorize("ADMIN"), pembayaranController.createTagihan);
router.post("/:id/upload-bukti", authorize("ORANGTUA"), uploadBukti.single("bukti"), pembayaranController.uploadBukti);
router.put("/:id/verifikasi", authorize("ADMIN"), pembayaranController.verifikasi);
router.post("/:id/pengingat-wa", authorize("ADMIN"), pembayaranController.buatPengingatWhatsApp);

module.exports = router;