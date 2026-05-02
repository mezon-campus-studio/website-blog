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
