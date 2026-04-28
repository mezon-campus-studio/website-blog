import bcrypt from 'bcrypt';

import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from '@/common/utils/app-error';
import { IUserRepository } from './user.repository';

import {
  deleteImageFromCloudinary,
  uploadToCloudinary,
  CloudinaryAvatar,
  FolderType,
} from '@/common/utils/cloudinary';
import { ChangePasswordDto, UpdateProfileDto } from './user.dto';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findUserActiveById(userId: string) {
    return await this.userRepository.findUserActiveById(userId);
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async getProfile(userId: string) {
    const profile = await this.userRepository.findUserActiveById(userId);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    try {
      return await this.userRepository.updateProfile(userId, {
        name: data.name,
        bio: data.bio,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAvatar(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    let uploadedAvatar: CloudinaryAvatar | undefined;

    try {
      uploadedAvatar = await uploadToCloudinary(file.buffer, file.originalname, FolderType.AVATARS);
      return await this.userRepository.updateAvatar(userId, uploadedAvatar.secureUrl);
    } catch (error) {
      if (uploadedAvatar) {
        const publicId = uploadedAvatar.publicId;
        await deleteImageFromCloudinary(publicId);
      }

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerException('Failed to upload avatar');
    }
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    try {
      if (data.newPassword !== data.confirmNewPassword) {
        throw new BadRequestException('New password and confirmation do not match');
      }

      const currentPasswordHash = await this.userRepository.findPasswordByUserId(userId);

      if (!currentPasswordHash) {
        throw new NotFoundException('User profile not found');
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        data.currentPassword,
        currentPasswordHash,
      );
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const isSameAsOldPassword = await bcrypt.compare(data.newPassword, currentPasswordHash);
      if (isSameAsOldPassword) {
        throw new BadRequestException('New password must be different from current password');
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await this.userRepository.changePassword(userId, hashedPassword);
    } catch (error) {
      throw new InternalServerException('Failed to change password');
    }
  }

  async updateStatus(userId: string, currentUserId: string | undefined) {
    try {
      const user = await this.userRepository.findUserByAdmin(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newStatus = !user.isActive;

      await this.userRepository.updateStatus(userId, currentUserId, newStatus);
    } catch (error) {
      throw new InternalServerException('Failed to update user status');
    }
  }
}
