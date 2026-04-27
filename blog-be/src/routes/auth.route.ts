import { Router } from 'express';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import { SignUpDto } from '@/modules/auth/dto/signup.dto';
import { SignInDto } from '@/modules/auth/dto/signin.dto';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { PrismaAuthRepository } from '@/modules/auth/prisma-auth.repository';
import prisma from '@/lib/prisma';
import { Logger, loggers, transports, format } from 'winston';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';

loggers.add('auth', {
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});
const logger = loggers.get('auth') as Logger;
const authRouter = Router();
const authRepository = new PrismaAuthRepository(prisma, logger);
const authService = new AuthService(authRepository, logger);
const authController = new AuthController(authService, logger);

authRouter.post(
  '/register',
  validateDto(SignUpDto),
  asyncHandler(authController.register.bind(authController)),
);

authRouter.post(
  '/login',
  validateDto(SignInDto),
  asyncHandler(authController.login.bind(authController)),
);

authRouter.post(
  '/logout',
  passportAuthenticateJwt,
  asyncHandler(authController.logout.bind(authController)),
);

authRouter.get(
  '/status',
  passportAuthenticateJwt,
  asyncHandler(authController.authStatus.bind(authController)),
);

export default authRouter;
