import { IPostRepository } from "./post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "@prisma/client";
import slugify from "slugify";
import { deleteAvatarFromCloudinary, uploadImageToCloudinary, uploadThumbnailToCloudinary } from "@/common/utils/cloudinary";
import { UpdatePostDto } from "./dto/update-post.dto";
import { BadRequestException } from "@/common/utils/app-error";

export class PostService {
    constructor(
        private readonly postRepository: IPostRepository,
    ) {}

    async createPost(data: CreatePostDto, userId: string,
        thumbnailFile?: Express.Multer.File,
        imageFiles?: Express.Multer.File[]
    ): Promise<Post> {
        try {
            if(data.title.length == 0) {
            throw new BadRequestException("Title is required");
        }
            if(data.content.length <10) {
                throw new BadRequestException("Content is too short");
            }
            if(data.categoryId == null){
                throw new BadRequestException("Category is required");
            }
            
        let slug = slugify(data.title, {
                lower: true,
                strict: true,
            });

            const existedPost = await this.postRepository.findBySlug(slug);

            if (existedPost) {
                slug = `${slug}-${Date.now()}`;
            }

            let thumbnailUrl: string | null = null;
            let thumbnailPublicId: string | null = null;

            if (thumbnailFile) {
                const uploadedThumbnail = await uploadThumbnailToCloudinary(
                thumbnailFile.buffer,
                thumbnailFile.originalname
                );

                thumbnailUrl = uploadedThumbnail.secureUrl;
                thumbnailPublicId = uploadedThumbnail.publicId;
            }

            const images: { url: string; publicId: string }[] = [];

            if (imageFiles?.length) {
                for (const file of imageFiles) {
                const uploadedImage = await uploadImageToCloudinary(
                    file.buffer,
                    file.originalname
                );

                images.push({
                    url: uploadedImage.secureUrl,
                    publicId: uploadedImage.publicId,
                });
                }
            }

            return this.postRepository.createPost(
                {
                ...data,
                slug,
                thumbnailUrl,
                thumbnailPublicId,
                images,
                },
                userId
            );
            
        } catch (error) {
            throw error;
        }
        
    }

    async getPostById(postId: string): Promise<Post> {
        const post = await this.postRepository.findPostById(postId);
        if(!post) {
            throw new BadRequestException("Post not found");
        }
        return post;
    }

    async getAllPost(page: number, limit: number): Promise<Post[]> {
        return this.postRepository.findAllPost(page, limit);
    }

    async getPostByUserId(page: number, limit: number, userId: string): Promise<Post[]> {
        return this.postRepository.findPostByUserId(page, limit, userId);
    }

    async getPostByCategoryId(page: number, limit: number, categoryId: string): Promise<Post[]> {
        return this.postRepository.findPostByCategoryId(page, limit, categoryId);
    }

    async updatePost(data: UpdatePostDto, userId: string, postId: string, thumbnailFile?: Express.Multer.File,
        imageFiles?: Express.Multer.File[]): Promise<Post> {
        try {
            const post = await this.postRepository.findPostById(postId);
            if(!post) {
                throw new BadRequestException("Post not found");
            }
            if(post.userId !== userId) {
                throw new BadRequestException("You are not authorized to update this post");
            }
            if(data.content && data.content.length <10) {
                throw new BadRequestException("Content is too short");
            }
            let slug =  post.slug;
            if(data.title && data.title !== post.title){
                slug = slugify(data.title, {
                    lower: true,
                    strict: true,
                });
                const existedPost = await this.postRepository.findBySlug(slug);

                if (existedPost) {
                    slug = `${slug}-${Date.now()}`;
                }
            }

            let thumbnailUrl = post.thumbnailUrl;
            let thumbnailPublicId = post.thumbnailPublicId;

            if (thumbnailFile) {
                if(post.thumbnailPublicId){
                    await deleteAvatarFromCloudinary(post.thumbnailPublicId);
                }
                const uploadedThumbnail = await uploadThumbnailToCloudinary(
                    thumbnailFile.buffer,
                    thumbnailFile.originalname
                );

                thumbnailUrl = uploadedThumbnail.secureUrl;
                thumbnailPublicId = uploadedThumbnail.publicId;
            }

            let images = (post.images as {url: string, publicId: string}[] | null) ?? [];

            if (imageFiles?.length) {
                for (const image of images) {
                    await deleteAvatarFromCloudinary(image.publicId);
                }

                images = [];

                for (const file of imageFiles) {
                    const uploadedImage = await uploadImageToCloudinary(
                        file.buffer,
                        file.originalname
                    );

                    images.push({
                        url: uploadedImage.secureUrl,
                        publicId: uploadedImage.publicId,
                    });
                }
            }

            return this.postRepository.updatePost(
                {
                    ...data,
                    slug,
                    thumbnailUrl,
                    thumbnailPublicId,
                    images,
                },
                userId,
                postId
            );
        } catch (error) {
            throw error;
        }
    }
    
    async deletePost(userId: string, postId: string): Promise<Post> {
        try {
            const post = await this.postRepository.findPostById(postId);
            if(!post) {
                throw new BadRequestException("Post not found");
            }
            if(post.userId !== userId) {
                throw new BadRequestException("You are not authorized to delete this post");
            }
            return this.postRepository.deletePost(userId, postId);
        } catch (error) {
            throw error;
        }
    }

    async saveDraft(userId: string, postId: string): Promise<Post> {
        try {
            const post = await this.postRepository.findPostById(postId);
            if(!post) {
                throw new BadRequestException("Post not found");
            }
            if(post.userId !== userId) {
                throw new BadRequestException("You are not authorized to save this post");
            }
            return this.postRepository.saveDraft(userId, postId);
        } catch (error) {
            throw error;
        }
    }

    async publishPost(userId: string, postId: string): Promise<Post> {
        try {
            const post = await this.postRepository.findPostById(postId);
            if(!post) {
                throw new BadRequestException("Post not found");
            }
            if(post.userId !== userId) {
                throw new BadRequestException("You are not authorized to publish this post");
            }
            if(post.isDraft !== true) {
                throw new BadRequestException("Post is already published");
            }
            return this.postRepository.publishPost(userId, postId);
        } catch (error) {
            throw error;
        }
    }
}