const router = require("express").Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const {
  register,
  login,
  getMe,
  updatePassword,
  getAllUsers,
  changeUserRole,
  toggleUserStatus,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, getMe);

router.put("/password", auth, updatePassword);

router.get("/all", auth, requireRole("admin"), getAllUsers);

// Only admin should be allowed — so keep auth + admin middleware
router.put("/role", auth, requireRole("admin"), changeUserRole);

router.put("/status", auth, requireRole("admin"), toggleUserStatus);

module.exports = router;
