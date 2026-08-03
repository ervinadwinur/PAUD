const router = require("express").Router();
const kegiatanController = require("../controllers/kegiatanHarian.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const { uploadFotoKegiatan } = require("../middlewares/upload.middleware");

router.use(authenticate);

router.get("/", authorize("ADMIN", "GURU", "ORANGTUA"), kegiatanController.getAll);
router.post("/", authorize("GURU"), uploadFotoKegiatan.single("foto"), kegiatanController.create);
router.delete("/:id", authorize("GURU", "ADMIN"), kegiatanController.remove);

module.exports = router;