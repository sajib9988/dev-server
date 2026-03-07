import express from "express";

import { authorize as auth } from "../../shared/middlewares/authorize.middleware";
import multer from "multer";

import AuditController from "./audit.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Copy-paste snippet route
router.post("/snippet", auth(), AuditController.createSnippetAudit);

// File / ZIP upload route
router.post("/upload", auth(), upload.single("file"), AuditController.createFileAudit);

// Get user audits
router.get("/my-audits", auth(), AuditController.getUserAudit);

export const AuditRoutes = router;