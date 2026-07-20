const router = require("express").Router();
const kegiatanController = require("../controllers/kegiatanHarian.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

router.use(authenticate);

// Guru: Input Kegiatan Harian | Orang Tua: Lihat Kegiatan Harian
router.get("/", authorize("ADMIN", "GURU", "ORANGTUA"), kegiatanController.getAll);
router.post("/", authorize("GURU"), upload.single("foto"), kegiatanController.create);
router.put("/:id", authorize("GURU"), kegiatanController.update);
router.delete("/:id", authorize("GURU", "ADMIN"), kegiatanController.remove);

module.exports = router;
