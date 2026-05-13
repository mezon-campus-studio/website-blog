import { Request, Response } from 'express';
import { HTTPSTATUS } from '@/config/http.config';
import { UserService } from './user.service';
import { ChangePasswordDto, UpdateProfileDto } from './user.dto';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();

    return res.status(HTTPSTATUS.OK).json({
      message: 'Get users successfully',
      users,
    });
  }

  async getProfile(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing userId parameter',
      });
    }
    const profile = await this.userService.getProfile(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Get profile successfully',
      profile,
    });
  }

  async updateProfile(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const dto = req.body as UpdateProfileDto;
    const profile = await this.userService.updateProfile(userId, dto);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Update profile successfully',
      profile,
    });
  }

  async uploadAvatar(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const profile = await this.userService.updateAvatar(userId, req.file);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Upload avatar successfully',
      profile,
    });
  }

  async changePassword(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const dto = req.body as ChangePasswordDto;
    await this.userService.changePassword(userId, dto);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Change password successfully',
    });

    // Có nên redirect về login sau khi đổi mật khẩu không ạ? Nếu có thì frontend sẽ clear cookie và redirect về login, backend chỉ cần trả về message success thôi
    // return clearJwtAuthCookie(res).status(HTTPSTATUS.OK).json({
    //    message: "Change password successfully! Please login again with your new password",
    // });
  }

  async updateStatus(req: Request, res: Response) {
    const { userId } = req.params as { userId: string };

    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    await this.userService.updateStatus(userId, currentUserId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Update user status successfully',
    });
  }
}
