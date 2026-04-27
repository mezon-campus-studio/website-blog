import { Logger } from 'winston';
import bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from '@/common/utils/app-error';
import { IUserRepository, UpdateProfileData } from './user.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  deleteImageFromCloudinary,
  uploadAvatarToCloudinary,
  CloudinaryAvatar,
} from '@/common/utils/cloudinary';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: Logger,
  ) {}

  async findUserById(userId: string) {
    return await this.userRepository.findUserById(userId);
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async getProfile(userId: string) {
    const profile = await this.userRepository.findUserById(userId);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      const dto = plainToInstance(UpdateProfileDto, data);
      const validationErrors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (validationErrors.length > 0) {
        throw new BadRequestException('Invalid profile data');
      }

      if (dto.name === undefined && dto.bio === undefined) {
        throw new BadRequestException('No profile fields provided');
      }

      return await this.userRepository.updateProfile(userId, {
        name: dto.name,
        bio: dto.bio,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerException('Failed to update profile');
    }
  }

  async updateAvatar(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    let uploadedAvatar: CloudinaryAvatar | undefined;

    try {
      uploadedAvatar = await uploadAvatarToCloudinary(file.buffer, file.originalname);
      return await this.userRepository.updateAvatar(userId, uploadedAvatar.secureUrl);
    } catch (error) {
      if (uploadedAvatar) {
        const publicId = uploadedAvatar.publicId;
        await deleteImageFromCloudinary(publicId).catch((rollbackError) => {
          this.logger.warn('Failed to rollback avatar on Cloudinary', {
            userId,
            publicId,
            rollbackError,
          });
        });
      }

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerException('Failed to upload avatar');
    }
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    try {
      const dto = plainToInstance(ChangePasswordDto, data);
      const validationErrors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (validationErrors.length > 0) {
        throw new BadRequestException('Invalid password data');
      }

      if (dto.newPassword !== dto.confirmNewPassword) {
        throw new BadRequestException('New password and confirmation do not match');
      }

      const currentPasswordHash = await this.userRepository.findPasswordByUserId(userId);

      if (!currentPasswordHash) {
        throw new NotFoundException('User profile not found');
      }

      const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, currentPasswordHash);
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const isSameAsOldPassword = await bcrypt.compare(dto.newPassword, currentPasswordHash);
      if (isSameAsOldPassword) {
        throw new BadRequestException('New password must be different from current password');
      }

      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
      await this.userRepository.changePassword(userId, hashedPassword);
    } catch (error) {
      throw new InternalServerException('Failed to change password');
    }
  }

  async updateStatus(userId: string, currentUserId: string | undefined) {
    try {
      const user = await this.userRepository.findUserByIdForAdmin(userId);

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
