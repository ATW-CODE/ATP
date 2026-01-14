import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import { createPayment, paymentWebhook } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", authenticate, createPayment);
router.post("/webhook", paymentWebhook);

export default router;
