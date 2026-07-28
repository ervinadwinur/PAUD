const router = require("express").Router();
const controller = require("../controllers/pengumuman.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);
router.get("/", controller.getAll);
router.post("/", authorize("ADMIN"), controller.create);
router.put("/:id", authorize("ADMIN"), controller.update);
router.delete("/:id", authorize("ADMIN"), controller.remove);
module.exports = router;
