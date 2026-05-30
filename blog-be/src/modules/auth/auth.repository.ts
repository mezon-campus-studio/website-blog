import { User } from '@prisma/client';
import { CreateUserDto } from './auth.dto';

export interface OAuthUserData {
  email: string;
  name: string;
  avatar_url?: string;
  provider: string;
  providerId: string;
}

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;

  updateLastLogin(userId: string, lastLoginAt: Date): Promise<User>;

  createUser(data: CreateUserDto): Promise<User>;

  findOrCreateOAuthUser(data: OAuthUserData): Promise<User>;
}

