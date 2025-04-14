import { Client } from "minio";
import { env } from "../config/env.ts";
import { createReadStream } from "fs";
import logger from "../config/logger.ts";
import fs from "fs";
import path from "path";

const mimeTypes: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
};

const minioClient = new Client({
  endPoint: new URL(env.S3_BUCKET_ENDPOINT).hostname,
  port: parseInt(new URL(env.S3_BUCKET_ENDPOINT).port) || 9000,
  useSSL: env.S3_BUCKET_ENDPOINT.startsWith("https"),
  accessKey: env.AWS_ACCESS_KEY_ID,
  secretKey: env.AWS_SECRET_ACCESS_KEY,
});

export const initializeBucket = async () => {
  try {
    const bucketExists = await minioClient.bucketExists(env.S3_BUCKET_NAME);

    if (!bucketExists) {
      await minioClient.makeBucket(env.S3_BUCKET_NAME, env.AWS_REGION);
    } else {
    }
  } catch (err) {
    logger.error(`Error initializing MinIO bucket: ${err}`);
    throw new Error(`Failed to initialize MinIO bucket: ${err}`);
  }
};

export const uploadFile = async (key: string, filePath: string) => {
  try {
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch (e) {
      logger.error("Error reading file from path:", e);
      throw new Error(`Failed to read file from path: ${filePath}`);
    }

    const fileStream = createReadStream(filePath);
    const fileSize = fs.statSync(filePath).size;
    const fileExt = path.extname(filePath).substring(1).toLowerCase();

    const contentType = mimeTypes[fileExt] || `application/${fileExt}`;

    const data = await minioClient.putObject(
      env.S3_BUCKET_NAME,
      key,
      fileStream,
      fileSize,
      { "Content-Type": contentType },
    );

    return data;
  } catch (e) {
    logger.error(`MinIO upload error for key ${key}:`, e);
    throw new Error(`MinIO upload failed: ${e}`);
  }
};

export const getFileByKey = async (key: string) => {
  try {
    logger.debug(`Fetching file from MinIO with key ${key}`);

    const fileStream = await minioClient.getObject(env.S3_BUCKET_NAME, key);

    return fileStream;
  } catch (e) {
    logger.error(`Error fetching file from MinIO with key ${key}:`, e);
    throw new Error(`Failed to fetch file from MinIO: ${e}`);
  }
};

export const getS3SignedUrl = async (key: string, expiresIn: number) => {
  try {
    logger.debug(
      `Generating signed URL for ${key} with expiration of ${expiresIn} seconds`,
    );

    const url = await minioClient.presignedGetObject(
      env.S3_BUCKET_NAME,
      key,
      expiresIn,
    );

    return url;
  } catch (e) {
    logger.error(`Error generating signed URL for ${key}:`, e);
    throw new Error(`Failed to generate signed URL: ${e}`);
  }
};

export const deleteFile = async (key: string) => {
  try {
    await minioClient.removeObject(env.S3_BUCKET_NAME, key);

    return { success: true };
  } catch (e) {
    logger.error(`Error deleting file ${key} from MinIO:`, e);
    throw new Error(`Failed to delete file: ${e}`);
  }
};

export const fileExists = async (key: string) => {
  try {
    await minioClient.statObject(env.S3_BUCKET_NAME, key);
    return true;
  } catch (e) {
    return false;
  }
};
