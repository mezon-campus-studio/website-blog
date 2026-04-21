import { UnauthorizedException } from "@/common/utils/app-error";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Env } from "./env.config";
import prisma from "@/lib/prisma";
import { UserService } from "@/modules/user/user.service";
import { PrismaUserRepository } from "@/modules/user/prisma-user.repository";
import { createLogger, format, transports } from "winston";

const logger = createLogger({
   format: format.combine(format.timestamp(), format.json()),
   transports: [new transports.Console()],
});

const userRepository = new PrismaUserRepository(prisma, logger);
const userService = new UserService(userRepository, logger);


passport.use(
   new JwtStrategy(
      {
         jwtFromRequest: ExtractJwt.fromExtractors([
            (req) => {
               const token = req.cookies.accessToken;
               if (!token) throw new UnauthorizedException('Unauthorized: No token provided');
               return token;
            },
         ]),
         secretOrKey: Env.JWT_SECRET,
         audience: ["user"],
         algorithms: ["HS256"],
      },
      async ({ userId }, done) => {
         try {
            const user = userId && (await userService.findUserById(userId));

            if (!user) {
               throw new UnauthorizedException("Unauthorized: User not found");
            }

            return done(null, user);
         } catch (error) {
            return done(error, false);
         }
      }

   ),
);
export const passportAuthenticateJwt = passport.authenticate('jwt', { session: false });
