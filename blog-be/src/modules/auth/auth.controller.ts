import { HTTPSTATUS } from '@/config/http.config';
import { clearJwtAuthCookie, setJwtAuthCookie } from '@/common/utils/cookie';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { Env } from '@/config/env.config';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response) {
    const dto = req.body as SignUpDto;
    const user = await this.authService.register(dto);
    const userId = user.id.toString();

    const accessToken = setJwtAuthCookie({
      res,
      userId,
    });
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'User registered successfully',
      accessToken,
      user,
    });
  }

  async login(req: Request, res: Response) {
    const dto = req.body as SignInDto;
    const user = await this.authService.login(dto);
    const userId = user.id.toString();
    const accessToken = setJwtAuthCookie({
      res,
      userId,
    });
    return res.status(HTTPSTATUS.OK).json({
      message: 'User logged in successfully',
      accessToken,
      user,
    });
  }

  async logout(req: Request, res: Response) {
    return clearJwtAuthCookie(res).status(HTTPSTATUS.OK).json({
      message: 'User logged out successfully',
    });
  }

  async authStatus(req: Request, res: Response) {
    const user = req.user;
    return res.status(HTTPSTATUS.OK).json({
      message: 'User authenticated successfully',
      user,
    });
  }

  async oauthCallback(req: Request, res: Response) {
    const user = req.user as { id: string };

    if (!user) {
      return res.redirect(`${Env.FRONTEND_URL}/signin?error=oauth_failed`);
    }

    const accessToken = setJwtAuthCookie({
      res,
      userId: user.id,
    });

    // Redirect to frontend with token
    return res.redirect(`${Env.FRONTEND_URL}/oauth/callback?token=${accessToken}`);
  }
}
