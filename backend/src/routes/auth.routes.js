const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/auth.middleware");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.get("/me", authenticate, authController.me);
router.post("/change-password", authenticate, authController.changePassword);

module.exports = router;
