const router = require("express").Router();
const orangTuaController = require("../controllers/orangtua.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate, authorize("ADMIN"));

router.get("/", orangTuaController.getAll);
router.get("/:id", orangTuaController.getById);
router.post("/", orangTuaController.create);
router.put("/:id", orangTuaController.update);
router.delete("/:id", orangTuaController.remove);

module.exports = router;
