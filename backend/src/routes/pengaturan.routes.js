const router = require("express").Router();
const controller = require("../controllers/pengaturan.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.use(authenticate);
router.get("/", controller.get);
router.put("/", authorize("ADMIN"), controller.update);
module.exports = router;
