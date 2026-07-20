const router = require("express").Router();
const absensiController = require("../controllers/absensi.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);

// Admin: Kelola Absensi | Guru: Input Absensi | Orang Tua: Lihat Absensi Anak
router.get("/", authorize("ADMIN", "GURU", "ORANGTUA"), absensiController.getAll);
router.post("/", authorize("ADMIN", "GURU"), absensiController.create);
router.put("/:id", authorize("ADMIN", "GURU"), absensiController.update);
router.delete("/:id", authorize("ADMIN"), absensiController.remove);

module.exports = router;
