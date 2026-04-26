import { Prisma } from '@prisma/client';
import { IsOptional, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6, 50)
  currentPassword!: string;

  @IsString()
  @Length(6, 50)
  newPassword!: string;

  @IsString()
  @Length(6, 50)
  confirmNewPassword!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  bio?: string;
}

export const publicUserArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    email: true,
    name: true,
    avatar_url: true,
    bio: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
    isActive: true,
    isDeleted: true,
    lastLoginAt: true,
  },
});

export type PublicUser = Prisma.UserGetPayload<typeof publicUserArgs>;
