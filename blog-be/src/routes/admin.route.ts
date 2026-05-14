import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { authorize } from '@/common/middleware/authorize.middlerware';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import { passportAuthenticateJwt } from '@/config/passport.config';
import prisma from '@/lib/prisma';
import { AdminController } from '@/modules/admin/admin.controller';
import { AddUserDto, UpdateRoleDto } from '@/modules/admin/admin.dto';
import { AdminService } from '@/modules/admin/admin.service';
import { PrismaAdminRepository } from '@/modules/admin/prisma-admin.repository';
import { Router } from 'express';

const adminRouter = Router();
const adminnRepository = new PrismaAdminRepository(prisma);
const adminService = new AdminService(adminnRepository);
const adminController = new AdminController(adminService);

adminRouter.use(passportAuthenticateJwt);
adminRouter.post(
  '/add-user',
  authorize('ADMIN'),
  validateDto(AddUserDto),
  asyncHandler(adminController.addUser.bind(adminController)),
);

adminRouter.patch(
  '/role',
  authorize('ADMIN'),
  validateDto(UpdateRoleDto),
  asyncHandler(adminController.updateRole.bind(adminController)),
);
export default adminRouter;
