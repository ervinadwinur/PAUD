const router = require("express").Router();
const pengumumanController = require("../controllers/pengumuman.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const { uploadPengumuman } = require("../middlewares/upload.middleware");

router.use(authenticate);

// Semua role (admin, guru, orangtua) bisa lihat
router.get("/", pengumumanController.getAll);

// Hanya admin yang bisa CRUD
router.post("/", authorize("ADMIN"), uploadPengumuman.single("file"), pengumumanController.create);
router.put("/:id", authorize("ADMIN"), uploadPengumuman.single("file"), pengumumanController.update);
router.delete("/:id", authorize("ADMIN"), pengumumanController.remove);

module.exports = router;