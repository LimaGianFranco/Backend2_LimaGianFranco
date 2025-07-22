import passport from 'passport';
import { UserModel } from '../dao/models/user.model.js';  
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await UserModel.findById(jwtPayload.id).lean();
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));
