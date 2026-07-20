const router = require("express").Router();
const perkembanganController = require("../controllers/perkembangan.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);

// Guru: Kelola/Input Perkembangan Anak | Orang Tua: Lihat (via getAll)
router.get("/", authorize("ADMIN", "GURU", "ORANGTUA"), perkembanganController.getAll);
router.post("/", authorize("GURU"), perkembanganController.create);
router.put("/:id", authorize("GURU"), perkembanganController.update);
router.delete("/:id", authorize("GURU", "ADMIN"), perkembanganController.remove);

module.exports = router;
