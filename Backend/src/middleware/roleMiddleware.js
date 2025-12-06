// src/middleware/roleMiddleware.js (backend)
module.exports = function requireRole(allowed = []) {
    return (req, res, next) => {
      const user = req.user; // authMiddleware must set this
      if (!user) return res.status(401).json({ ok:false, error:'Not authenticated' });
      if (!allowed.includes(user.role)) return res.status(403).json({ ok:false, error:'Forbidden' });
      next();
    };
  };
  