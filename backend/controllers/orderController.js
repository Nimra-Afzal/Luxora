// import { createOrderService } from "../services/orderService.js";

// export async function createOrder(req, res) {
//   try {
//     const { items, addressId, shippingMethodId } = req.body;

//     const order = await createOrderService(
//       req.user.id,
//       items,
//       addressId,
//       shippingMethodId
//     );

//     res.status(201).json({ order });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }

import { createOrderService } from "../services/orderService.js";
import { createPaymentService } from "../services/paymentService.js";
import Order from "../models/Order.js";

export async function createOrder(req, res) {
  try {
    const { items, addressId, shippingMethodId } = req.body;

    const order = await createOrderService(
      req.user.id,
      items,
      addressId,
      shippingMethodId,
    );

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function createPaymentIntent(req, res) {
  try {
    const { items, addressId, shippingMethodId } = req.body;
    const checkoutKey = req.get("Idempotency-Key");

    if (!checkoutKey) {
      return res.status(400).json({
        error: "Missing checkout idempotency key",
      });
    }

    const payment = await createPaymentService(
      req.user.id,
      items,
      addressId,
      shippingMethodId,
      checkoutKey,
    );

    res.status(201).json(payment);
  } catch (err) {
    console.error("Payment initialization failed:", err.message);

    res.status(400).json({
      error: err.message || "Failed to initialize payment",
    });
  }
}

export async function getOrderPaymentStatus(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    }).select("status paymentStatus");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paid: order.paymentStatus === "paid",
    });
  } catch (error) {
    console.error("Failed to get order payment status:", error.message);
    return res.status(500).json({ error: "Failed to check payment status" });
  }
}
