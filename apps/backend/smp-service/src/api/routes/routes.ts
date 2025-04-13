import { Hono } from "hono";
import { deleteDocument, getDocument, getDocuments, updateDocument, uploadDocument } from "../controllers/document.controller.ts";

export const router = new Hono()

router.get("/health", async(c) => {
    return c.text("OK");
})

export const documentRouter = new Hono();

documentRouter.post("/", uploadDocument);
documentRouter.get("/", getDocuments);
documentRouter.get("/:id", getDocument);
documentRouter.put("/:id", updateDocument);
documentRouter.delete("/:id", deleteDocument);

