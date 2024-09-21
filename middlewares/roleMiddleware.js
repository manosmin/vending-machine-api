export const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Access denied. User role not found.' });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
  
      next();
    };
  };
  