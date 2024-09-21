export const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Error 403. User role not found.' });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Error 403. You are not allowed to perform this action.' });
      }
  
      next();
    };
  };
  