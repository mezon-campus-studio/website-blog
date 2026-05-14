import { authorize } from '@/common/middleware/authorize.middlerware';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import prisma from '@/lib/prisma';
import { PrismaUserRepository } from '@/modules/user/prisma-user.repository';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';

import { Router } from 'express';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { uploadImage } from '@/common/middleware/upload-image.middleware';
import { ChangePasswordDto, UpdateProfileDto } from '@/modules/user/user.dto';

const userRouter = Router();
const useRepository = new PrismaUserRepository(prisma);
const userService = new UserService(useRepository);
const userController = new UserController(userService);

userRouter.use(passportAuthenticateJwt);

userRouter.get('/profile/:userId', asyncHandler(userController.getProfile.bind(userController)));

userRouter.patch(
  '/profile',
  validateDto(UpdateProfileDto),
  asyncHandler(userController.updateProfile.bind(userController)),
);

userRouter.patch(
  '/profile/password',
  validateDto(ChangePasswordDto),
  asyncHandler(userController.changePassword.bind(userController)),
);

userRouter.post(
  '/profile/avatar',
  uploadImage.single('avatar'),
  asyncHandler(userController.uploadAvatar.bind(userController)),
);

userRouter.get(
  '/all',
  authorize('ADMIN'),
  asyncHandler(userController.getAllUsers.bind(userController)),
);

userRouter.patch(
  '/:userId/status',
  authorize('ADMIN'),
  asyncHandler(userController.updateStatus.bind(userController)),
);

export default userRouter;
