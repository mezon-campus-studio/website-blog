import { Prisma } from '@prisma/client';

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

export type UpdateProfileData = {
  name?: string;
  bio?: string;
};

export interface IUserRepository {
  findUserById(userId: string): Promise<PublicUser | null>;

  findUserByIdForAdmin(userId: string): Promise<PublicUser | null>;

  findPasswordByUserId(userId: string): Promise<string | null>;

  getAllUsers(): Promise<PublicUser[]>;

  updateProfile(userId: string, data: UpdateProfileData): Promise<PublicUser>;

  updateAvatar(userId: string, avatarUrl: string): Promise<PublicUser>;

  changePassword(userId: string, newPassword: string): Promise<void>;

  updateStatus(
    userId: string,
    currentUserId: string | undefined,
    newStatus: boolean,
  ): Promise<void>;
}
