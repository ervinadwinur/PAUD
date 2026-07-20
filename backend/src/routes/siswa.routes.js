const router = require("express").Router();
const siswaController = require("../controllers/siswa.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);

// Admin: Kelola Data Siswa | Guru: Lihat Data Siswa | Orang Tua: Lihat Data Anak
router.get("/", authorize("ADMIN", "GURU", "ORANGTUA"), siswaController.getAll);
router.get("/:id", authorize("ADMIN", "GURU", "ORANGTUA"), siswaController.getById);

router.post("/", authorize("ADMIN"), siswaController.create);
router.put("/:id", authorize("ADMIN"), siswaController.update);
router.delete("/:id", authorize("ADMIN"), siswaController.remove);

module.exports = router;
