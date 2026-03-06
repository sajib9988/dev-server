import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload a buffer to Cloudinary
 * @param buffer - file buffer
 * @param filename - original filename
 * @returns secure URL
 */
export const uploadToCloudinary = async (buffer: Buffer, filename: string) => {
  return new Promise<string>((resolve, reject) => {
    const publicId = filename.replace(/\s/g, "_");
    cloudinary.uploader
      .upload_stream(
        { resource_type: "raw", folder: "audit_uploads", public_id: publicId },
        (error, result) => {
          if (error || !result) reject(error || new Error("Cloudinary upload failed"));
          else resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};