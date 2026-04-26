import { UnauthorizedException } from "@/utils/app-error";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Env } from "./env.config";
import { findByIdUserService } from "@/services/user.service";


passport.use(
   new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([
         (req) => {
            const token = req.cookies.accessToken;
            if (!token) throw new UnauthorizedException("Unauthorized: No token provided");
            return token;
         }
      ]),
      secretOrKey: Env.JWT_SECRET,
      audience: ["user"],
      algorithms: ["HS256"],
   },
      async ({ userId }, done) => {
         try {
            const user = userId && (await findByIdUserService(userId));

            if (!user) {
               return done(null, false);
            }

            return done(null, user);
         } catch (error) {
            return done(null, false);
         }
      }
   )
);
export const passportAuthenticateJwt = passport.authenticate("jwt", { session: false });
