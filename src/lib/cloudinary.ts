import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Folder name in Cloudinary (default: 'portfolio')
 * @returns Upload result with URL and metadata
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = 'portfolio/projects'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image' as const,
      transformation: [
        { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
    };

    // Handle buffer upload
    if (Buffer.isBuffer(file)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(error.message));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
      );
      uploadStream.end(file);
    } 
    // Handle base64 or URL upload
    else {
      cloudinary.uploader.upload(file, uploadOptions)
        .then((result: UploadApiResponse) => {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        })
        .catch((error: UploadApiErrorResponse) => {
          reject(new Error(error.message));
        });
    }
  });
}

/**
 * Upload a profile image with circular crop
 */
export async function uploadProfileImage(
  file: Buffer | string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'portfolio/profile',
      resource_type: 'image' as const,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
    };

    if (Buffer.isBuffer(file)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(error.message));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
      );
      uploadStream.end(file);
    } else {
      cloudinary.uploader.upload(file, uploadOptions)
        .then((result: UploadApiResponse) => {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        })
        .catch((error: UploadApiErrorResponse) => {
          reject(new Error(error.message));
        });
    }
  });
}

/**
 * Upload a resume/document to Cloudinary
 */
export async function uploadDocument(
  file: Buffer | string,
  filename: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'portfolio/documents',
      resource_type: 'raw' as const,
      public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension for public_id
    };

    if (Buffer.isBuffer(file)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(error.message));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: 0,
              height: 0,
              format: result.format || 'pdf',
            });
          }
        }
      );
      uploadStream.end(file);
    } else {
      cloudinary.uploader.upload(file, uploadOptions)
        .then((result: UploadApiResponse) => {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: 0,
            height: 0,
            format: result.format || 'pdf',
          });
        })
        .catch((error: UploadApiErrorResponse) => {
          reject(new Error(error.message));
        });
    }
  });
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}

/**
 * Get optimized URL for an image
 */
export function getOptimizedUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
}): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: options?.width || 800,
        height: options?.height,
        crop: options?.crop || 'fill',
      },
      { quality: 'auto', fetch_format: 'auto' }
    ],
  });
}

export default cloudinary;
