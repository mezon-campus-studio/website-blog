import { NextFunction, Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AddUserDto, UpdateRoleDto } from './admin.dto';
import { HTTPSTATUS } from '@/config/http.config';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  async addUser(req: Request, res: Response, _next: NextFunction) {
    const dto = req.body as AddUserDto;
    const result = await this.adminService.addUser(dto);
    return res.status(201).json({
      message: 'Add new user successfully',
      data: result,
    });
  }

  async updateRole(req: Request, res: Response, _next: NextFunction) {
    const userId = (req as any).user.id;
    const dto = req.body as UpdateRoleDto;

    const result = await this.adminService.updateRole(dto, userId);
    return res.status(200).json({
      message: 'Update role successfully',
      data: result,
    });
  }
}
