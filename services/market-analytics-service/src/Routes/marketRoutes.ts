import { Router } from "express";
const router = Router();

import { onGetCoins } from "../Controllers/Assets"

router.get("/coins", onGetCoins);

export default router;
