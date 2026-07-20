const router = require("express").Router();
const kelasController = require("../controllers/kelas.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);

router.get("/", authorize("ADMIN", "GURU"), kelasController.getAll);
router.post("/", authorize("ADMIN"), kelasController.create);
router.put("/:id", authorize("ADMIN"), kelasController.update);
router.delete("/:id", authorize("ADMIN"), kelasController.remove);

module.exports = router;
