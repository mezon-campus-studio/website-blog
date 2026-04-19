import { authorize } from "@/common/middleware/authorize.middlerware";
import { passportAuthenticateJwt } from "@/config/passport.config";
import prisma from "@/lib/prisma";
import { PrismaUserRepository } from "@/modules/user/prisma-user.repository";
import { UserController } from "@/modules/user/user.controller";
import { UserService } from "@/modules/user/user.service";
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
   userController.getProfile.bind(userController)
);

userRouter.patch(
   "/profile",
   userController.updateProfile.bind(userController)
);

userRouter.patch(
   "/profile/password",
   userController.changePassword.bind(userController)
);

userRouter.post(
   "/profile/avatar",
   uploadAvatar.single("avatar"),
   userController.uploadAvatar.bind(userController)
);

userRouter.get(
   "/all",
   authorize("ADMIN"),
   userController.getAllUsers.bind(userController)
);

userRouter.patch(
   "/:userId/status",
   authorize("ADMIN"),
   userController.updateStatus.bind(userController)
);


export default userRouter;