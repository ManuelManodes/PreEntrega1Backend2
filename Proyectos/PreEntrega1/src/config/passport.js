import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import usersModel from "../models/users.model.js";

const JWT_SECRET = "manodes3000";

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req.signedCookies.tokenCookie
  ]),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await usersModel.findById(jwt_payload.user._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;