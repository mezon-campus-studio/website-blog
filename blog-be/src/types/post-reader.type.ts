import { Prisma } from '@prisma/client';

export const readerPostArgs = Prisma.validator<Prisma.PostDefaultArgs>()({
  select: {
    id: true,
    title: true,
    slug: true,
    content: true,
    thumbnailUrl: true,
    createdAt: true,
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    tags: {
      where: {
        isDeleted: false,
        isActive: true,
        tag: {
          isDeleted: false,
          isActive: true,
        },
      },
      select: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
});

export type ReaderPostItem = Prisma.PostGetPayload<typeof readerPostArgs>;

export type ReaderPostFilter = {
  page: number;
  limit: number;
  categoryId?: string;
  categorySlug?: string;
  tagId?: string;
};
