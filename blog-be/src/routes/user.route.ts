import { authorize } from "@/common/middleware/authorize.middlerware";
import { passportAuthenticateJwt } from "@/config/passport.config";
import { validateDto } from "@/common/middleware/validate-dto.middleware";
import prisma from "@/lib/prisma";
import { PrismaUserRepository } from "@/modules/user/prisma-user.repository";
import { UserController } from "@/modules/user/user.controller";
import { UserService } from "@/modules/user/user.service";
import { UpdateProfileDto } from "@/modules/user/dto/update-profile.dto";
import { ChangePasswordDto } from "@/modules/user/dto/change-password.dto";
import { Router } from "express";
import { loggers, format, transports, Logger } from "winston";
import { asyncHandler } from "@/common/middleware/async-handler.middleware";
import { uploadAvatar } from "@/common/middleware/upload-avatar.middleware";


loggers.add("user", {
   format: format.combine(
      format.timestamp(),
      format.json()
   ),
   transports: [
      new transports.Console()
   ]
});

const logger = loggers.get("user") as Logger;
const userRouter = Router();
const useRepository = new PrismaUserRepository(prisma, logger);
const userService = new UserService(useRepository, logger);
const userController = new UserController(userService);

userRouter.use(passportAuthenticateJwt);

userRouter.get(
   "/profile/:userId",
   asyncHandler(userController.getProfile.bind(userController))
);

userRouter.patch(
   "/profile",
   validateDto(UpdateProfileDto),
   asyncHandler(userController.updateProfile.bind(userController))
);

userRouter.patch(
   "/profile/password",
   validateDto(ChangePasswordDto),
   asyncHandler(userController.changePassword.bind(userController))
);

userRouter.post(
   "/profile/avatar",
   uploadAvatar.single("avatar"),
   asyncHandler(userController.uploadAvatar.bind(userController))
);

userRouter.get(
   "/all",
   authorize("ADMIN"),
   asyncHandler(userController.getAllUsers.bind(userController))
);

userRouter.patch(
   "/:userId/status",
   authorize("ADMIN"),
   asyncHandler(userController.updateStatus.bind(userController))
);


export default userRouter;