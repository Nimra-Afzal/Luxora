import Order from "../models/Order.js";
import Product from "../models/product.js";
import { validateCheckoutService } from "./checkoutService.js";

export async function createOrderService(
  userId,
  items,
  addressId,
  shippingMethodId
) {
  const validation = await validateCheckoutService(
    userId,
    items,
    addressId,
    shippingMethodId
    
  );

  // 🔹 Create order
  const order = await Order.create({
    user: userId,
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
  });

  // 🔹 Reduce stock
  for (const item of validation.validatedItems) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }

  return order;
}