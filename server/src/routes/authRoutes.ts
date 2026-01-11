import { Router } from "express";
import {
  onLogin,
  onLogout,
  onAuthWithGoogle,
  onGetCredentials,
} from "../controllers/authController";

const router = Router();

// All routes here are prefixed with /auth from appRoutes.ts
router.post("/login", onLogin); // /auth/login
router.get("/logout", onLogout); // /auth/logout
router.get("/google/callback", onAuthWithGoogle); // /auth/google
router.get("/credentials", onGetCredentials); // /auth/credentials

export default router;
