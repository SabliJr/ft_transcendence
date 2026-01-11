import { Router } from "express";
import {
  onLogin,
  onLogout,
  onGetCredentials,
} from "../controllers/auth";
import { onAuthWithGoogle } from "../controllers/gAuth";

const router = Router();

// All routes here are prefixed with /auth from appRoutes.ts
router.post("/login", onLogin); // /auth/login
router.get("/logout", onLogout); // /auth/logout
router.get("/credentials", onGetCredentials); // /auth/credentials

router.get("/google/callback", onAuthWithGoogle); // /auth/google

export default router;
