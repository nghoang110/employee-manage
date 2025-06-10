exports.requireRole = (role) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role)
      return res.status(401).json({ error: "Chưa đăng nhập" });

    if (Array.isArray(role)) {
      if (!role.includes(user.role)) {
        return res.status(403).json({ error: "Không đủ quyền truy cập" });
      }
    } else {
      if (user.role !== role) {
        return res.status(403).json({ error: "Không đủ quyền truy cập" });
      }
    }

    next();
  };
};
