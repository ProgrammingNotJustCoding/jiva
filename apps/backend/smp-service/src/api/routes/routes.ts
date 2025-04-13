import { Hono } from "hono";
import {
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
  uploadDocument,
} from "../controllers/document.controller.ts";
import {
  deleteHazard,
  getHazards,
  postHazard,
  putHazard,
} from "../controllers/hazards.controller.ts";
import {
  getControls,
  postControl,
  postControlStep,
} from "../controllers/control.controller.ts";

export const router = new Hono();

router.get("/health", async (c) => {
  return c.text("OK");
});

export const documentRouter = new Hono();

documentRouter.post("/", uploadDocument);
documentRouter.get("/", getDocuments);
documentRouter.get("/:id", getDocument);
documentRouter.put("/:id", updateDocument);
documentRouter.delete("/:id", deleteDocument);

export const hazardsRouter = new Hono();

hazardsRouter.post("/", postHazard);
hazardsRouter.get("/", getHazards);
hazardsRouter.put("/:id", putHazard);
hazardsRouter.delete("/:id", deleteHazard);

export const controlsRouter = new Hono();

controlsRouter.post("/", postControl);
controlsRouter.post("/step", postControlStep);
controlsRouter.get("/:id", getControls);
