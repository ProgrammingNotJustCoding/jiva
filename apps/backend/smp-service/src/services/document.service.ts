import { db } from "../database/db.ts";
import { smpDocuments } from "../database/schema/documents.schema.ts";
import type { InsertSMPDocument } from "../database/types.ts";
import { randomUUID } from "crypto";
import os from "os";
import fs from "fs";
import path from "path";
import { uploadFile, getS3SignedUrl, deleteFile } from "./minio.service.ts";
import logger from "../config/logger.ts";
import { and, asc, desc, eq, gte, lte, isNull, sql } from "drizzle-orm";

const insertDocument = async (document: InsertSMPDocument) => {
    const newDocument = await db.insert(smpDocuments).values(document).returning();

    if (!newDocument) {
        throw new Error("Failed to create document");
    }
    return newDocument;
}

export const uploadSMPDocument = async (file: File, documentData: Partial<InsertSMPDocument>) => {
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
        
        const signedUrl = await getS3SignedUrl(s3Key, 3600);
        
        const document: InsertSMPDocument = {
            version: documentData.version || 1,
            title: documentData.title || file.name,
            approvalDate: documentData.approvalDate || new Date(),
            approvalStatus: documentData.approvalStatus || "draft",
            isActive: documentData.isActive !== undefined ? documentData.isActive : true,
            documentS3Key: s3Key,
        };
        
        const newDocument = await insertDocument(document);
        
        return {
            document: newDocument[0],
            signedUrl
        };
    } catch (error) {
        logger.error("Error uploading document:", error);
        throw new Error(`Failed to upload document: ${error}`);
    }
}

export const getAllDocuments = async (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const offset = (page - 1) * limit;
        
        const whereConditions = and(
            eq(smpDocuments.isDeleted, false)
        );
        
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(smpDocuments)
            .where(whereConditions);
            
        const totalCount = countResult[0].count;
        
        if (!(sortBy in smpDocuments)) {
            throw new Error(`Invalid sort column: ${sortBy}`);
        }
        
        let documents;

        const columnMap = {
            'id': smpDocuments.id,
            'version': smpDocuments.version,
            'title': smpDocuments.title,
            'approvalDate': smpDocuments.approvalDate,
            'approvalStatus': smpDocuments.approvalStatus,
            'isActive': smpDocuments.isActive,
            'documentS3Key': smpDocuments.documentS3Key,
            'createdAt': smpDocuments.createdAt,
            'updatedAt': smpDocuments.updatedAt,
            'deletedAt': smpDocuments.deletedAt,
            'isDeleted': smpDocuments.isDeleted,
        };

        const column = columnMap[sortBy as keyof typeof columnMap] || smpDocuments.createdAt;

        if (sortOrder === 'desc') {
            documents = await db
            .select()
            .from(smpDocuments)
            .where(whereConditions)
            .orderBy(desc(column))
            .limit(limit)
            .offset(offset);
        
        } else {
            documents = await db
            .select()
            .from(smpDocuments)
            .where(whereConditions)
            .orderBy(asc(column))
            .limit(limit)
            .offset(offset);
        }
        
        return {
            data: documents,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: Math.ceil(totalCount / limit)
            }
        };
    } catch (error) {
        logger.error("Error fetching documents:", error);
        throw new Error(`Failed to fetch documents: ${error}`);
    }
}

export const getDocumentById = async (id: number) => {
    try {
        const document = await db
            .select()
            .from(smpDocuments)
            .where(and(
                eq(smpDocuments.id, id),
                eq(smpDocuments.isDeleted, false)
            ))
            .limit(1);
            
        if (!document || document.length === 0) {
            throw new Error(`Document with ID ${id} not found`);
        }
        
        const signedUrl = await getS3SignedUrl(document[0].documentS3Key, 3600);
        
        return {
            document: document[0],
            signedUrl
        };
    } catch (error) {
        logger.error(`Error fetching document with ID ${id}:`, error);
        throw error;
    }
}

export const updateDocument = async (id: number, updateData: Partial<InsertSMPDocument>) => {
    try {
        const existingDocument = await db
            .select()
            .from(smpDocuments)
            .where(and(
                eq(smpDocuments.id, id),
                eq(smpDocuments.isDeleted, false)
            ))
            .limit(1);
            
        if (!existingDocument || existingDocument.length === 0) {
            throw new Error(`Document with ID ${id} not found`);
        }
        
        const updatedDocument = {
            ...updateData,
            updatedAt: new Date()
        };
        
        const result = await db
            .update(smpDocuments)
            .set(updatedDocument)
            .where(eq(smpDocuments.id, id))
            .returning();
            
        return result[0];
    } catch (error) {
        logger.error(`Error updating document with ID ${id}:`, error);
        throw error;
    }
}

export const softDeleteDocument = async (id: number) => {
    try {
        const existingDocument = await db
            .select()
            .from(smpDocuments)
            .where(and(
                eq(smpDocuments.id, id),
                eq(smpDocuments.isDeleted, false)
            ))
            .limit(1);
            
        if (!existingDocument || existingDocument.length === 0) {
            throw new Error(`Document with ID ${id} not found or already deleted`);
        }
        
        const result = await db
            .update(smpDocuments)
            .set({
                isDeleted: true,
                deletedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(smpDocuments.id, id))
            .returning();
            
        return result[0];
    } catch (error) {
        logger.error(`Error soft-deleting document with ID ${id}:`, error);
        throw error;
    }
}

export const hardDeleteDocument = async (id: number) => {
    try {
        const existingDocument = await db
            .select()
            .from(smpDocuments)
            .where(eq(smpDocuments.id, id))
            .limit(1);
            
        if (!existingDocument || existingDocument.length === 0) {
            throw new Error(`Document with ID ${id} not found`);
        }
        
        await deleteFile(existingDocument[0].documentS3Key);

        await db
            .delete(smpDocuments)
            .where(eq(smpDocuments.id, id));
            
        return { success: true, message: `Document with ID ${id} permanently deleted` };
    } catch (error) {
        logger.error(`Error hard-deleting document with ID ${id}:`, error);
        throw error;
    }
}
