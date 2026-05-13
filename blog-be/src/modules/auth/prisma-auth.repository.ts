import { PrismaClient, User } from '@prisma/client';
import { IAuthRepository } from './auth.repository';
import { CreateUserDto } from './auth.dto';

export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
        isDeleted: false,
        isActive: true,
      },
    });
  }

  async updateLastLogin(userId: string, lastLoginAt: Date): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        createdAt: new Date(),
        createdBy: data.name,
        lastLoginAt: new Date(),
      },
    });
  }
}
