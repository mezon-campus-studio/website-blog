import { PrismaClient, User } from '@prisma/client';
import { IAuthRepository, OAuthUserData } from './auth.repository';
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

  async findOrCreateOAuthUser(data: OAuthUserData): Promise<User> {
    // 1. Try to find user by provider + providerId
    const existingByProvider = await this.prisma.user.findFirst({
      where: {
        provider: data.provider,
        providerId: data.providerId,
        isDeleted: false,
      },
    });

    if (existingByProvider) {
      return await this.prisma.user.update({
        where: { id: existingByProvider.id },
        data: { lastLoginAt: new Date() },
      });
    }

    // 2. Try to find user by email (link accounts)
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingByEmail) {
      return await this.prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          provider: data.provider,
          providerId: data.providerId,
          avatar_url: existingByEmail.avatar_url || data.avatar_url,
          lastLoginAt: new Date(),
        },
      });
    }

    // 3. Create new user
    return await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        avatar_url: data.avatar_url,
        provider: data.provider,
        providerId: data.providerId,
        createdAt: new Date(),
        createdBy: data.name,
        lastLoginAt: new Date(),
      },
    });
  }
}

