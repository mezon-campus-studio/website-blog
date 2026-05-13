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
<<<<<<< HEAD:blog-be/src/types/post-reader.type.ts
=======
    user: {
      select: {
        id: true,
        name: true,
        avatar_url: true,
      },
    },
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/types/post-reader.type.ts
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
