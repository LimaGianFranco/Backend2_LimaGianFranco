import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import { UserModel } from '../models/user.model.js';

dotenv.config();
const SECRET = process.env.SECRET_JWT;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await UserModel.findById(jwt_payload.user._id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));
