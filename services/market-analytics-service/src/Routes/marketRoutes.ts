import { Router } from "express";
const router = Router();

import {
  onGetCoins,
  onGetCoin,
  onGetCoinChartData,
} from "../Controllers/Assets";

router.get("/coins", onGetCoins);
router.get("/coin", onGetCoin);
router.get("/coin/chart_data", onGetCoinChartData);

export default router;
