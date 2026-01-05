// src/middleware/role.js
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user; // decoded from auth middleware

      if (!user || !user.role) {
        return res.status(403).json({ error: "No role assigned" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (err) {
      console.error("Role error:", err);
      res.status(500).json({ error: "Server role check failed" });
    }
  };
};

module.exports = requireRole;
