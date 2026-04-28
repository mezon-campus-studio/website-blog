import { Router } from 'express';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { validateDto } from '@/common/middleware/validate-dto.middleware';

import { passportAuthenticateJwt } from '@/config/passport.config';
import { PrismaAuthRepository } from '@/modules/auth/prisma-auth.repository';
import prisma from '@/lib/prisma';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { SignInDto, SignUpDto } from '@/modules/auth/auth.dto';

const authRouter = Router();
const authRepository = new PrismaAuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

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
