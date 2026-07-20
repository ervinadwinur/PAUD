const router = require("express").Router();
const penggunaController = require("../controllers/pengguna.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate, authorize("ADMIN")); // Kelola Pengguna khusus Admin

router.get("/", penggunaController.getAll);
router.post("/", penggunaController.create);
router.put("/:id", penggunaController.update);
router.put("/:id/reset-password", penggunaController.resetPassword);
router.delete("/:id", penggunaController.remove);

module.exports = router;
