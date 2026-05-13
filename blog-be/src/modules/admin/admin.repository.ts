import { ROLE, User } from '@prisma/client';
import { AddUserDto, UpdateRoleDto } from './admin.dto';

export interface IAdminRepository {
  addUser(data: AddUserDto): Promise<User>;

  findUserByEmail(email: string): Promise<User | null>;

  updateRole(data: UpdateRoleDto, userId: string): Promise<User>;

  findUserById(userId: string): Promise<User | null>;
}
