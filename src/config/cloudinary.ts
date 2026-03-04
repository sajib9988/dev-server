import { v2 as cloudinary, UploadStream } from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string,
    publicId: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            public_id: publicId,
            resource_type: "raw",
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result?.secure_url || "");
            }
        });
        uploadStream.end(buffer);
    });
};