// backend/src/controllers/payment.controller.js
import crypto from "crypto";
import pool from "../db/index.js";
import { razorpay } from "../config/razorpay.js";

export const paymentWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  if (signature !== expected) {
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;

    await pool.query("BEGIN");

    await pool.query(
      `
      UPDATE payments
      SET status='success',
          provider_payment_id=$1
      WHERE provider_order_id=$2
      `,
      [payment.id, orderId]
    );

    await pool.query(
      `
      UPDATE print_jobs
      SET payment_status='paid',
          paid_at=now()
      WHERE id = (
        SELECT print_job_id
        FROM payments
        WHERE provider_order_id=$1
      )
      `,
      [orderId]
    );

    await pool.query("COMMIT");
  }

  res.json({ ok: true });
};


export const createPayment = async (req, res) => {
  const userId = req.user.sub;
  const { printJobId } = req.body;

  const job = await pool.query(
    `SELECT cost FROM print_jobs WHERE id=$1 AND user_id=$2`,
    [printJobId, userId]
  );

  if (!job.rows.length) {
    return res.status(404).json({ message: "Job not found" });
  }

  const order = await razorpay.orders.create({
    amount: job.rows[0].cost * 100,
    currency: "INR",
    receipt: printJobId,
  });

  await pool.query(
    `
    INSERT INTO payments (
      user_id,
      print_job_id,
      provider,
      provider_order_id,
      amount,
      status
    )
    VALUES ($1,$2,'razorpay',$3,$4,'created')
    `,
    [userId, printJobId, order.id, job.rows[0].cost]
  );

  res.json({
    key: process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: order.amount,
  });
};
