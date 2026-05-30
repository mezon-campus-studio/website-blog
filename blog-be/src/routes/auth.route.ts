import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { validateDto } from '@/common/middleware/validate-dto.middleware';

import { passportAuthenticateJwt } from '@/config/passport.config';
import '@/config/passport-oauth.config';
import { PrismaAuthRepository } from '@/modules/auth/prisma-auth.repository';
import prisma from '@/lib/prisma';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { SignInDto, SignUpDto } from '@/modules/auth/auth.dto';
import { Env } from '@/config/env.config';

const authRouter = Router();
const authRepository = new PrismaAuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

// ─── Local Auth ──────────────────────────────────────────────
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

// ─── Google OAuth ────────────────────────────────────────────
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${Env.FRONTEND_URL}/signin?error=google_auth_failed`,
  }),
  asyncHandler(authController.oauthCallback.bind(authController)),
);

// ─── GitHub OAuth ────────────────────────────────────────────
authRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false }),
);

authRouter.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${Env.FRONTEND_URL}/signin?error=github_auth_failed`,
  }),
  asyncHandler(authController.oauthCallback.bind(authController)),
);

export default authRouter;
