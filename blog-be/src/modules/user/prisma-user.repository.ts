import { PrismaClient } from '@prisma/client';
import { IUserRepository } from './user.repository';
import { PublicUser, publicUserArgs, UpdateProfileDto } from './user.dto';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserActiveById(userId: string): Promise<PublicUser | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
      ...publicUserArgs,
    });
  }

  async findUserByAdmin(userId: string): Promise<PublicUser | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      ...publicUserArgs,
    });
  }

  async findPasswordByUserId(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
      select: { password: true },
    });

    return user?.password ?? null;
  }

  async getAllUsers(): Promise<PublicUser[]> {
    return await this.prisma.user.findMany({
      where: { isDeleted: false },
      ...publicUserArgs,
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<PublicUser> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        updatedAt: new Date(),
        updatedBy: userId,
      },
      ...publicUserArgs,
    });
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<PublicUser> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar_url: avatarUrl,
        updatedAt: new Date(),
        updatedBy: userId,
      },
      ...publicUserArgs,
    });
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async updateStatus(userId: string, currentUserId: string, newStatus: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: newStatus,
        updatedAt: new Date(),
        updatedBy: currentUserId,
      },
    });
  }
}
