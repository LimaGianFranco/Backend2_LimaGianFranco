import passport from 'passport';

export const authToken = passport.authenticate('jwt', { session: false });
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  next();
};
