import { Router } from "express";
const router = Router();

import marketRoutes from "./Routes/marketRoutes";


router.use("/market", marketRoutes);

export default router;
