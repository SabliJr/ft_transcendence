import { Router } from "express";
import authRoutes from "./routes/authRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import servicesRoutes from "./routes/servicesRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/payment", paymentRoutes);
router.use("/services", servicesRoutes);

export default router;
