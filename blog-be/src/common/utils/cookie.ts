import jwt from 'jsonwebtoken';
import { Env } from '../../config/env.config';
import { Response } from 'express';
import ms from 'ms';

type Time = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;
type Duration = `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

type Cookie = {
  res: Response;
  userId: string;
};

export const setJwtAuthCookie = ({ res, userId }: Cookie) => {
  const payload = { userId };
  const expiresIn = Env.JWT_EXPIRES_IN as Time;
  const token = jwt.sign(payload, Env.JWT_SECRET, {
    audience: ['user'],
    expiresIn: expiresIn || '7d',
  });

  res.cookie('accessToken', token, {
    maxAge: ms(Env.COOKIE_MAX_AGE as Duration),
    httpOnly: true,
    secure: Env.NODE_ENV === 'production',
    sameSite: Env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return token;
};

export const clearJwtAuthCookie = (res: Response) => res.clearCookie('accessToken', { path: '/' });
