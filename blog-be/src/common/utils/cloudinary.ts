import cloudinary from '@/config/cloudinary.config';

export enum FolderType {
  AVATARS = 'avatars',
  IMAGES = 'images',
  THUMBNAILS = 'thumbnails',
}

const FOLDER = 'website-blog';

export type CloudinaryAvatar = {
  secureUrl: string;
  publicId: string;
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

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  originalName: string,
  folderType: FolderType,
): Promise<CloudinaryAvatar> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${FOLDER}/${folderType}`,
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


