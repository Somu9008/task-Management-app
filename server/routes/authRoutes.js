const express = require("express");
const {
  register,
  login,
  logout,
  me,
  allUser,
} = require("../controllers/authController");
const { isLoggedIn } = require("../middlewares/authMiddleware");

const router = express.Router();

// router.route("/register").post(register);
// router.route("/login").post(login);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
router.get("/users", isLoggedIn, allUser);

module.exports = router;
