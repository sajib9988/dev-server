import { Router } from "express";
import { healthRoutes } from "../modules/health/health.route";
import { authRoutes } from "../modules/auth/auth.route";
import { AuditRoutes } from "../modules/audit/audit.route";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/audit", AuditRoutes);

export const apiRoutes = router;
