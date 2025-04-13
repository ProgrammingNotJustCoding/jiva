import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import logger from "../../config/logger.ts";
import { 
    uploadSMPDocument, 
    getAllDocuments,
    getDocumentById,
    updateDocument as updateDocumentService,
    softDeleteDocument
} from "../../services/document.service.ts";
import { approvalStatusEnum } from "../../database/schema/documents.schema.ts";

export const uploadDocument = async (c: Context) => {
    try {
        const formData = await c.req.formData();
        const file = formData.get('file') as File;
        console.log("File:", file);
        
        if (!file) {
            return c.json({
                error: errors[400]
            }, 400);
        }
        
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            return c.json({
                error: errors[400]
            }, 400);
        }
        
        const title = formData.get('title') as string;
        const version = parseInt(formData.get('version') as string || '1', 10);
        const approvalStatus = formData.get('approvalStatus') as string || 'draft';
        const isActive = formData.get('isActive') === 'true';
        
        const metadataSchema = z.object({
            title: z.string().min(1).optional(),
            version: z.number().int().positive().optional(),
            approvalStatus: z.enum(approvalStatusEnum.enumValues).optional(),
            isActive: z.boolean().optional()
        });
        
        const metadataResult = metadataSchema.safeParse({
            title,
            version,
            approvalStatus,
            isActive
        });
        
        if (!metadataResult.success) {
            return c.json({
                error: errors[400],
            }, 400);
        }
        
        const result = await uploadSMPDocument(file, {
            title: title || file.name,
            version,
            approvalStatus: approvalStatus as any,
            approvalDate: new Date(),
            isActive
        });
        
        return c.json({
            data: {
                signedUrl: result.signedUrl
            }
        }, 201);
        
    } catch (error) {
        logger.error("Error uploading document:", error);
        return c.json({
            error: errors[500],
        }, 500);
    }
};

export const getDocuments = async (c: Context) => {
    try {
        const page = parseInt(c.req.query('page') || '1', 10);
        const limit = parseInt(c.req.query('limit') || '10', 10);
        const sortBy = c.req.query('sortBy') || 'createdAt';
        const sortOrder = c.req.query('sortOrder') || 'desc';
        
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return c.json({
                error: errors[400],
            }, 400);
        }
        
        const validSortFields = ['id', 'title', 'version', 'approvalDate', 'createdAt', 'updatedAt'];
        if (!validSortFields.includes(sortBy)) {
            return c.json({
                error: "Invalid sort field",
            }, 400);
        }
        
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            return c.json({
                error: "Sort order must be 'asc' or 'desc'",
            }, 400);
        }
        
        const result = await getAllDocuments(page, limit, sortBy, sortOrder);
        
        return c.json({
            data: result.data,
            pagination: result.pagination
        }, 200);
    } catch (error) {
        logger.error("Error fetching documents:", error);
        return c.json({
            error: errors[500],
        }, 500);
    }
};

export const getDocument = async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        
        if (isNaN(id)) {
            return c.json({
                error: errors[400],
            }, 400);
        }
        
        try {
            const result = await getDocumentById(id);
            
            return c.json({
                data: {
                    document: result.document,
                    signedUrl: result.signedUrl
                }
            }, 200);
        } catch (error) {
            return c.json({
                error: errors[404],
                details: error,
            }, 404);
        }
    } catch (error) {
        logger.error(`Error fetching document:`, error);
        return c.json({
            error: errors[500],
        }, 500);
    }
};

export const updateDocument = async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        
        if (isNaN(id)) {
            return c.json({
                error: errors[400],
            }, 400);
        }
        
        const body = await c.req.json();
        
        const updateSchema = z.object({
            title: z.string().min(1).optional(),
            version: z.number().int().positive().optional(),
            approvalStatus: z.enum(approvalStatusEnum.enumValues).optional(),
            approvalDate: z.coerce.date().optional(),
            isActive: z.boolean().optional()
        });
        
        const result = updateSchema.safeParse(body);
        if (!result.success) {
            return c.json({
                error: errors[400],
                details: result.error.format()
            }, 400);
        }
        
        try {

            const updatedDocument = await updateDocumentService(id, result.data);
            return c.text("OK", 200);
        } catch (error) {

            return c.json({
                error: errors[404],
                details: error,
            }, 404);
        }
    } catch (error) {
        logger.error(`Error updating document:`, error);
        return c.json({
            error: errors[500],
        }, 500);
    }
};

export const deleteDocument = async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'), 10);
        
        if (isNaN(id)) {
            return c.json({
                error: errors[400],
            }, 400);
        }
        
        try {

            const deletedDocument = await softDeleteDocument(id);
            return c.text("OK", 200);
        } catch (error) {
            
            return c.json({
                error: errors[404],
                details: error,
            }, 404);
        }
    } catch (error) {
        
        logger.error(`Error deleting document:`, error);
        return c.json({
            error: errors[500],
        }, 500);
    }
};
