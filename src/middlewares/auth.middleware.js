import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../dao/models/user.model.js';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_JWT,
};

passport.use(
  'jwt',
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await UserModel.findById(jwtPayload.id).lean();
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const authToken = passport.authenticate('jwt', { session: false });

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado. No se ha autenticado correctamente.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: Rol no autorizado.' });
    }

    next();
  };
};
