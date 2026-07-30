const router = require("express").Router();
const guruController = require("../controllers/guru.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);

router.get("/", authorize("ADMIN", "GURU"), guruController.getAll);
router.get("/:id", authorize("ADMIN", "GURU"), guruController.getById);
router.post("/", authorize("ADMIN"), guruController.create);
router.put("/:id", authorize("ADMIN"), guruController.update);
router.delete("/:id", authorize("ADMIN"), guruController.remove);
router.post("/:id/reset-password", authorize("ADMIN"), guruController.resetPassword);

module.exports = router;