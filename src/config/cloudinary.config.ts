import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./config";
import AppError from "../error-helper/app.error.helper";
import { StatusCodes } from "http-status-codes";
import { buffer } from "node:stream/consumers";
import { statusCodes } from "better-auth";
import { resolve } from "node:dns";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  filename: string,
): Promise<UploadApiResponse> => {
  if (!buffer || !filename) {
    throw new AppError(
      statusCodes.BAD_REQUEST,
      "File buffer and file name are requerd for upload",
    );
  }

  const extension = filename.split(".").pop()?.toLowerCase();

  const fileNameWithoutExtension = filename
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) +
    "-" +
    Date.now() +
    "-" +
    fileNameWithoutExtension;

  const folder = extension === "pdf" ? "pdfs" : "images";

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          public_id: `ph-healthcare/${folder}/${uniqueName}`,
          folder: `ph-healthcare/${folder}`,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                statusCodes.INTERNAL_SERVER_ERROR,
                "Failed to upload file to Cloudinary",
              ),
            );
          }
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};

export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error dleting file from Cloudinary:", error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete fiel from cloudinary",
    );
  }
};

export const cloudinaryUpload = cloudinary;
