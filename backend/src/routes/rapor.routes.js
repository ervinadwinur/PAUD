const router = require("express").Router();
const raporController = require("../controllers/rapor.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const { uploadRapor } = require("../middlewares/upload.middleware");

router.use(authenticate);

// Guru: Kelola/Input Rapor | Admin & Orang Tua: Lihat Rapor / Lihat Rapor Anak
router.get("/", authorize("ADMIN", "GURU", "ORANGTUA"), raporController.getAll);
router.post("/", authorize("GURU"), uploadRapor.single("file"), raporController.create);
router.delete("/:id", authorize("GURU", "ADMIN"), raporController.remove);

module.exports = router;