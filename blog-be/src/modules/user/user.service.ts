import { Logger } from "winston";
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@/common/utils/app-error";
import { IUserRepository, UpdateProfileData } from "./user.repository";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";


export class UserService {
   constructor(
      private readonly userRepository: IUserRepository,
      private readonly logger: Logger,
   ) { }

   async findUserById(userId: string) {
      return this.userRepository.findUserById(userId);
   }

   async getAllUsers() {
      return this.userRepository.getAllUsers();
   }

   async getProfile(userId: string) {
      if (!userId) {
         throw new BadRequestException("Missing authenticated user");
      }

      const profile = await this.userRepository.findUserById(userId);
      if (!profile) {
         throw new NotFoundException("User profile not found");
      }

      return profile;
   }

   async updateProfile(userId: string | undefined, data: UpdateProfileData) {

      if (!userId) {
         throw new BadRequestException("Missing authenticated user");
      }

      const dto = plainToInstance(UpdateProfileDto, data);
      const validationErrors = await validate(dto, {
         whitelist: true,
         forbidNonWhitelisted: true,
      });

      if (validationErrors.length > 0) {
         throw new BadRequestException("Invalid profile data");
      }

      if (dto.name === undefined && dto.bio === undefined) {
         throw new BadRequestException("No profile fields provided");
      }

      return this.userRepository.updateProfile(userId, {
         name: dto.name,
         bio: dto.bio,
      });
   }

   async updateAvatar(userId: string | undefined, fileName?: string) {

      if (!userId) {
         throw new BadRequestException("Missing authenticated user");
      }

      if (!fileName) {
         throw new BadRequestException("Avatar file is required");
      }

      const avatarUrl = `/uploads/avatars/${fileName}`;
      return this.userRepository.updateAvatar(userId, avatarUrl);
   }


   async changePassword(userId: string | undefined, data: ChangePasswordDto) {
      if (!userId) {
         throw new BadRequestException("Missing authenticated user");
      }

      const dto = plainToInstance(ChangePasswordDto, data);
      const validationErrors = await validate(dto, {
         whitelist: true,
         forbidNonWhitelisted: true,
      });

      if (validationErrors.length > 0) {
         throw new BadRequestException("Invalid password data");
      }

      if (dto.newPassword !== dto.confirmNewPassword) {
         throw new BadRequestException("New password and confirmation do not match");
      }

      const currentPasswordHash = await this.userRepository.findPasswordByUserId(userId);

      if (!currentPasswordHash) {
         throw new NotFoundException("User profile not found");
      }

      const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, currentPasswordHash);
      if (!isCurrentPasswordValid) {
         throw new UnauthorizedException("Current password is incorrect");
      }

      const isSameAsOldPassword = await bcrypt.compare(dto.newPassword, currentPasswordHash);
      if (isSameAsOldPassword) {
         throw new BadRequestException("New password must be different from current password");
      }

      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

      await this.userRepository.changePassword(userId, hashedPassword);
   }

   async updateStatus(userId: string, currentUserId: string | undefined) {
      const user = await this.userRepository.findUserByIdForAdmin(userId);

      if (!user) {
         throw new NotFoundException("User not found");
      }

      const newStatus = !user.isActive;

      await this.userRepository.updateStatus(userId, currentUserId, newStatus);
   }

}