import cloudinary from '@/config/cloudinary.config';

const AVATAR_FOLDER = 'website-blog/avatars';
const IMAGE_FOLDER = 'website-blog/posts/images';
const THUMBNAIL_FOLDER = 'website-blog/posts/thumbnails';
export type CloudinaryAvatar = {
  secureUrl: string;
  publicId: string;
};

export const uploadAvatarToCloudinary = async (
  fileBuffer: Buffer,
  originalName: string,
): Promise<CloudinaryAvatar> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: AVATAR_FOLDER,
        resource_type: 'image',
        public_id: `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9_-]/g, '')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  } catch (error) {
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  originalName: string,
): Promise<CloudinaryAvatar> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: IMAGE_FOLDER,
        resource_type: 'image',
        public_id: `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9_-]/g, '')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const uploadThumbnailToCloudinary = async (
  fileBuffer: Buffer,
  originalName: string,
): Promise<CloudinaryAvatar> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: THUMBNAIL_FOLDER,
        resource_type: 'image',
        public_id: `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9_-]/g, '')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};
