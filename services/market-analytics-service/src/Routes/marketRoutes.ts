import { Router } from "express";
const router = Router();

import { onGetCoins, onGetCoin } from "../Controllers/Assets";

router.get("/coins", onGetCoins);
router.get("/coin", onGetCoin);

export default router;
