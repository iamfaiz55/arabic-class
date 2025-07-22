import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAudio = async (fileBuffer: Buffer, filename: string) => {
  try {
     await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'class-audio',
        public_id: filename,
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'class-audio',
          public_id: filename,
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    throw new Error('Failed to upload audio to Cloudinary');
  }
};

export const deleteAudio = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
  } catch (error) {
    console.error('Failed to delete audio from Cloudinary:', error);
  }
};

export default cloudinary;