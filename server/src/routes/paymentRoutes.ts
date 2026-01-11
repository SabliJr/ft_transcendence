import { Router } from "express";
import bodyParser from "body-parser";
import {
  onCheckOut,
  onSubscriptionSuccess,
  onStripeWebhooks,
  onCancelSubscription,
  onCheckOutOneTime,
} from "../controllers/paymentController";

const router = Router();

// All routes here are prefixed with /payment from appRoutes.ts
router.get("/checkout", onCheckOut); // /payment/checkout
router.get("/checkout-onetime", onCheckOutOneTime); // /payment/checkout-onetime
router.get("/success", onSubscriptionSuccess); // /payment/success
router.get("/cancel", onCancelSubscription); // /payment/cancel

// Special case for webhook that needs raw body
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  onStripeWebhooks
); // /payment/webhook

export default router;
