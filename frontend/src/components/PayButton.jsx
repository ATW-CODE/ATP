import { apiFetch } from "../utils/api.js";
import React from "react";

export default function PayButton({ printJobId }) {
  const handlePayment = async () => {
    // 1️⃣ Create order on backend
    const order = await apiFetch("/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ printJobId }),
    });

    // 2️⃣ Open Razorpay Checkout
    const options = {
      key: order.key,
      amount: order.amount,
      currency: "INR",
      name: "ATP Printing",
      description: "Print Job Payment",
      order_id: order.orderId,

      handler: function () {
        // Payment success is confirmed ONLY via webhook
        alert("Payment successful. Job will be printed shortly.");
      },

      prefill: {
        email: localStorage.getItem("user_email") || "",
      },

      theme: {
        color: "#000000",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay & Print</button>;
}
