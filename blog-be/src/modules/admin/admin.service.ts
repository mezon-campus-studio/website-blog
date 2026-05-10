import { BadRequestException, NotFoundException } from '@/common/utils/app-error';
import { AddUserDto, UpdateRoleDto } from './admin.dto';
import { IAdminRepository } from './admin.repository';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export class AdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}
  async addUser(data: AddUserDto) {
    try {
      const { name, email, password, role } = data;
      const existingUser = await this.adminRepository.findUserByEmail(email);

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.adminRepository.addUser({
        name,
        email,
        password: hashedPassword,
        role,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRole(data: UpdateRoleDto, userId: string): Promise<User> {
    try {
      const existingUser = await this.adminRepository.findUserById(data.targetId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      if (data.role === existingUser.role) {
        throw new BadRequestException('User has this role already');
      }
      return await this.adminRepository.updateRole(data, userId);
    } catch (error) {
      throw error;
    }
  }
}
