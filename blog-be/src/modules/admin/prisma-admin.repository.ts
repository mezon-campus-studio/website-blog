import { PrismaClient, ROLE, User } from '@prisma/client';
import { IAdminRepository } from './admin.repository';
import { AddUserDto, UpdateRoleDto } from './admin.dto';

export class PrismaAdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async addUser(data: AddUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        createdAt: new Date(),
        createdBy: data.name,
        lastLoginAt: new Date(),
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
        isDeleted: false,
        isActive: true,
      },
    });
  }

  async updateRole(data: UpdateRoleDto, userId: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: data.targetId,
      },
      data: {
        role: data.role,
        updatedBy: userId,
      },
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
