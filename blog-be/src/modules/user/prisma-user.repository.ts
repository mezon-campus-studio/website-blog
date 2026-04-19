import { PrismaClient } from "@prisma/client";
import { IUserRepository, PublicUser, publicUserArgs, UpdateProfileData } from "./user.repository";
import { Logger } from "winston";


export class PrismaUserRepository implements IUserRepository {
   constructor(
      private readonly prisma: PrismaClient,
      private readonly logger: Logger,
   ) { }

   findUserById(userId: string): Promise<PublicUser | null> {
      return this.prisma.user.findUnique({
         where: { id: userId, isActive: true },
         ...publicUserArgs,
      })
   }

   findUserByIdForAdmin(userId: string): Promise<PublicUser | null> {
      return this.prisma.user.findUnique({
         where: { id: userId, isDeleted: false },
         ...publicUserArgs,
      })
   }

   async findPasswordByUserId(userId: string): Promise<string | null> {
      const user = await this.prisma.user.findUnique({
         where: { id: userId, isActive: true },
         select: { password: true },
      });

      return user?.password ?? null;
   }

   getAllUsers(): Promise<PublicUser[]> {
      return this.prisma.user.findMany({
         where: { isDeleted: false },
         ...publicUserArgs,
      })
   }

   updateProfile(userId: string, data: UpdateProfileData): Promise<PublicUser> {
      return this.prisma.user.update({
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

   updateAvatar(userId: string, avatarUrl: string): Promise<PublicUser> {
      return this.prisma.user.update({
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