const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  updatePassword,
  updateTheme,
} = require("../controllers/authController");
const protect = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);
router.put("/password", protect, updatePassword);
router.put("/theme", protect, updateTheme);

module.exports = router;
