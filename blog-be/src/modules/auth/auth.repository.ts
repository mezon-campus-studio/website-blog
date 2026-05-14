import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;

  updateLastLogin(userId: string, lastLoginAt: Date): Promise<User>;

  createUser(data: CreateUserDto): Promise<User>;
}
