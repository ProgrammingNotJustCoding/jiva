import path from "path";
import os from "os";
import fs from "fs";
import { randomUUID } from "crypto";
import logger from "../config/logger.ts";
import { incidentAttachments } from "../database/schema/attachments.schema.ts";
import type { InsertAttachment } from "../database/types.ts";
import { uploadFile } from "../services/minio.service.ts";

export const insertAttachment = async (
  tx: any,
  attachmentData: InsertAttachment,
) => {
  const [newAttachment] = await tx
    .insert(incidentAttachments)
    .values(attachmentData)
    .returning();

  if (!newAttachment) {
    throw new Error("Failed to insert attachment");
  }

  return newAttachment;
};

export const uploadAttachment = async (
  tx: any,
  file: File,
  incidentId: string,
) => {
  try {
    const fileExtension = path.extname(file.name);
    const s3Key = `documents/${randomUUID()}${fileExtension}`;

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${randomUUID()}${fileExtension}`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempFilePath, buffer);

    await uploadFile(s3Key, tempFilePath);

    fs.unlinkSync(tempFilePath);

    const insertAttachmentData: InsertAttachment = {
      incidentId: Number(incidentId),
      fileName: file.name,
      storagePath: s3Key,
    };

    const newAttachment = await insertAttachment(tx, insertAttachmentData);

    return newAttachment;
  } catch (e) {
    logger.error(`Failed to upload attachment: ${e}`);
    throw new Error("Failed to upload attachment");
  }
};
