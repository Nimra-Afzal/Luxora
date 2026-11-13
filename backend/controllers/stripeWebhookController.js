import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

export async function handleStripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed");
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("Webhook PaymentIntent:", paymentIntent.id);
        console.log("Webhook metadata:", paymentIntent.metadata);
        const session = await mongoose.startSession();

        try {
          await session.withTransaction(async () => {
            const order = await Order.findOneAndUpdate(
              {
                _id: paymentIntent.metadata.orderId,
                paymentIntentId: paymentIntent.id,
                inventoryDeducted: { $ne: true },
              },
              {
                $set: {
                  inventoryDeducted: true,
                  paymentStatus: "paid",
                  status: "paid",
                },
              },
              {
                new: true,
                session,
              },
            );

            if (!order) {
              const existingOrder = await Order.findOne({
                _id: paymentIntent.metadata.orderId,
                paymentIntentId: paymentIntent.id,
              }).session(session);

              if (!existingOrder) {
                throw new Error("Order not found for successful PaymentIntent");
              }

              if (existingOrder.inventoryDeducted) {
                return;
              }

              throw new Error("Unable to claim order for inventory deduction");
            }

            // Deduct stock only when sufficient stock exists.
            for (const item of order.items) {
              const product = await Product.findOneAndUpdate(
                {
                  _id: item.product,
                  stock: { $gte: item.quantity },
                },
                {
                  $inc: { stock: -item.quantity },
                },
                {
                  new: true,
                  session,
                },
              );

              if (!product) {
                throw new Error(
                  `Insufficient stock for product ${item.product}`,
                );
              }
            }

            
          });
        } finally {
          await session.endSession();
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          console.warn(
            "Failed-payment event has no orderId metadata:",
            paymentIntent.id,
          );
          break;
        }

        // A failed card attempt is not necessarily a permanently
        // failed order. Keep the order available for payment retries.
        const order = await Order.findOne({
          _id: orderId,
          paymentIntentId: paymentIntent.id,
        });

        if (!order) {
          console.warn(
            "No matching order for failed PaymentIntent:",
            paymentIntent.id,
          );
          break;
        }

        // Never overwrite a successful payment with a failure event.
        if (order.paymentStatus === "paid") {
          break;
        }

        // Leave the order's payment status unchanged so the customer
        // can retry using the existing PaymentIntent when appropriate.
        console.log(
          "Payment attempt failed; order remains available for retry:",
          order._id.toString(),
        );

        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error.message);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
