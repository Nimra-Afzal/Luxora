// import mongoose from "mongoose";
// import stripe from "../config/stripe.js";
// import Order from "../models/Order.js";
// import { validateCheckoutService } from "./checkoutService.js";


// async function getExistingCheckout(userId, checkoutKey) {
//   const order = await Order.findOne({
//     user: userId,
//     checkoutKey,
//   });

//   if (!order) {
//     return null;
//   }

//   if (order.paymentStatus === "paid") {
//     return {
//       orderId: order._id,
//       amount: order.total,
//       alreadyPaid: true,
//     };
//   }

//   if (!order.paymentIntentId) {
//     throw new Error(
//       "An existing checkout is still being initialized. Please try again shortly."
//     );
//   }

//   const paymentIntent = await stripe.paymentIntents.retrieve(
//     order.paymentIntentId
//   );

//   if (paymentIntent.status === "succeeded") {
//     return {
//       orderId: order._id,
//       amount: order.total,
//       alreadyPaid: true,
//     };
//   }

//   if (paymentIntent.status === "canceled") {
//     throw new Error(
//       "This checkout was canceled. Please start a new checkout."
//     );
//   }

//   return {
//     orderId: order._id,
//     clientSecret: paymentIntent.client_secret,
//     amount: order.total,
//     alreadyPaid: false,
//   };
// }

// export async function createPaymentService(
//   userId,
//   items,
//   addressId,
//   shippingMethodId,
//   checkoutKey,
// ) {
//   if (!mongoose.isValidObjectId(userId)) {
//     throw new Error("Invalid user");
//   }

//   // Recalculate prices and validate products, stock,
//   // address ownership, shipping, and tax on the backend.
//   const validation = await validateCheckoutService(
//     userId,
//     items,
//     addressId,
//     shippingMethodId,
//   );
//   if (
//     typeof checkoutKey !== "string" ||
//     checkoutKey.length < 10 ||
//     checkoutKey.length > 200
//   ) {
//     throw new Error("Invalid checkout idempotency key");
//   }
//   const existingCheckout = await getExistingCheckout(
//   userId,
//   checkoutKey
// );

// if (existingCheckout) {
//   return existingCheckout;
// }

//   // Stripe expects the amount in the smallest currency unit.
//   // This assumes Luxora's current prices are in USD.
//   const amountInCents = Math.round(validation.total * 100);

//   if (!Number.isSafeInteger(amountInCents) || amountInCents < 50) {
//     throw new Error("Order total must be at least $0.50");
//   }

//   let order;
//   let paymentIntent;

//   try {
//     order = await Order.create({
//       user: userId,
//       checkoutKey,
//       items: validation.validatedItems.map((item) => ({
//         product: item.product._id,
//         name: item.product.name,
//         price: item.price,
//         quantity: item.quantity,
//       })),
//       address: addressId,
//       subtotal: validation.subtotal,
//       shipping: validation.shipping,
//       tax: validation.tax,
//       total: validation.total,
//       status: "pending",
//       paymentStatus: "unpaid",
//     });

//     paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: "usd",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//       metadata: {
//         orderId: order._id.toString(),
//         userId: userId.toString(),
//       },
//     });

//     order.paymentIntentId = paymentIntent.id;
//     order.paymentStatus = "processing";
//     await order.save();

//     return {
//       orderId: order._id,
//       clientSecret: paymentIntent.client_secret,
//       amount: validation.total,
//     };
  
// } catch (error) {
//   // Clean up a PaymentIntent created by this request if
//   // checkout initialization fails.
//   if (paymentIntent) {
//     try {
//       await stripe.paymentIntents.cancel(paymentIntent.id);
//     } catch (cancelError) {
//       console.error(
//         "Failed to cancel PaymentIntent:",
//         cancelError.message
//       );
//     }
//   }

//   // If another concurrent request created the same checkout,
//   // return its existing payment details instead of failing.
//   if (error.code === 11000) {
//     const existingCheckout = await getExistingCheckout(
//       userId,
//       checkoutKey
//     );

//     if (existingCheckout) {
//       return existingCheckout;
//     }
//   }

//   // Delete only the order created by this request.
//   if (order) {
//     await Order.deleteOne({ _id: order._id });
//   }

//   throw error;
// }

// }

import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import { validateCheckoutService } from "./checkoutService.js";

async function getExistingCheckout(userId, checkoutKey) {
  const order = await Order.findOne({
    user: userId,
    checkoutKey,
  });

  if (!order) {
    return null;
  }

  if (order.paymentStatus === "paid") {
    return {
      orderId: order._id,
      amount: order.total,
      alreadyPaid: true,
    };
  }

  if (!order.paymentIntentId) {
    throw new Error(
      "An existing checkout is still being initialized. Please try again shortly."
    );
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(
    order.paymentIntentId
  );

 if (paymentIntent.status === "succeeded") {
  return {
    orderId: order._id,
    amount: order.total,
    alreadyPaid: order.paymentStatus === "paid",
    paymentPendingConfirmation: order.paymentStatus !== "paid",
  };
}

  if (paymentIntent.status === "canceled") {
    throw new Error(
      "This checkout was canceled. Please start a new checkout."
    );
  }

  return {
    orderId: order._id,
    clientSecret: paymentIntent.client_secret,
    amount: order.total,
    alreadyPaid: false,
  };
}

export async function createPaymentService(
  userId,
  items,
  addressId,
  shippingMethodId,
  checkoutKey
) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user");
  }

  if (
    typeof checkoutKey !== "string" ||
    checkoutKey.length < 10 ||
    checkoutKey.length > 200
  ) {
    throw new Error("Invalid checkout idempotency key");
  }

  const existingCheckout = await getExistingCheckout(
    userId,
    checkoutKey
  );

  if (existingCheckout) {
    return existingCheckout;
  }

  const validation = await validateCheckoutService(
    userId,
    items,
    addressId,
    shippingMethodId
  );

  const amountInCents = Math.round(validation.total * 100);

  if (!Number.isSafeInteger(amountInCents) || amountInCents < 50) {
    throw new Error("Order total must be at least $0.50");
  }

  let order;
  let paymentIntent;

  try {
    order = await Order.create({
      user: userId,
      checkoutKey,
      items: validation.validatedItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
      })),
      address: addressId,
      subtotal: validation.subtotal,
      shipping: validation.shipping,
      tax: validation.tax,
      total: validation.total,
      status: "pending",
      paymentStatus: "unpaid",
    });

    paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString(),
        },
      },
      {
        idempotencyKey: `luxora-order-${order._id}`,
      }
    );

    order.paymentIntentId = paymentIntent.id;
    order.paymentStatus = "processing";
    await order.save();

    return {
      orderId: order._id,
      clientSecret: paymentIntent.client_secret,
      amount: validation.total,
      alreadyPaid: false,
    };
  } catch (error) {
   
    if (paymentIntent) {
  try {
    await stripe.paymentIntents.cancel(paymentIntent.id);

    if (order) {
      await Order.deleteOne({ _id: order._id });
    }
  } catch (cancelError) {
    console.error(
      "PaymentIntent cleanup failed. Keeping order:",
      cancelError.message
    );
  }
} else if (order) {
  await Order.deleteOne({ _id: order._id });
}

    // Another request may have created this checkout first.
    if (error.code === 11000) {
      const existingCheckout = await getExistingCheckout(
        userId,
        checkoutKey
      );

      if (existingCheckout) {
        return existingCheckout;
      }
    }

    throw error;
  }
}

