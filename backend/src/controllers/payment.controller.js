import crypto from "crypto";
import razorpay from "../utils/razorpay.js";
import pool from "../db/index.js";

export const createOrder = async (req, res) => {
  try {
    const { jobId } = req.body;

    const jobResult = await pool.query(
      `SELECT cost FROM print_jobs WHERE id = $1`,
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const amount = jobResult.rows[0].cost * 100; // Razorpay uses paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ATP_${jobId.slice(0, 12)}`
    });

    res.json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    await pool.query(
      `UPDATE print_jobs SET payment_status = 'paid' WHERE id = $1`,
      [jobId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
