import Product from "../models/product.js";
import Address from "../models/Address.js";
import { getShippingMethodsService } from "./shippingService.js";
import { calculateTaxService } from "./taxService.js";

export async function validateCheckoutService(
  userId,
  items,
  addressId,
  shippingMethodId
) {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  let subtotal = 0;

  // 🔹 Validate products & calculate subtotal
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product || product.status !== "active") {
      throw new Error("One of the products is unavailable");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const priceToUse =
      product.discountPrice ?? product.price;

    subtotal += priceToUse * item.quantity;

    validatedItems.push({
      product,
      quantity: item.quantity,
      price: priceToUse,
    });
  }

  // 🔹 Validate address
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Invalid address selected");
  }

  // 🔹 Shipping
  const methods = await getShippingMethodsService(
    address.country,
    subtotal
  );

  const selectedMethod = methods.find(
    (m) => m._id.toString() === shippingMethodId
  );

  if (!selectedMethod) {
    throw new Error("Invalid shipping method");
  }

  const shippingCost = selectedMethod.price;

  // 🔹 Tax
  const { taxAmount } = await calculateTaxService(
    address.country,
    subtotal
  );

  const total = subtotal + shippingCost + taxAmount;

  return {
    validatedItems,
    subtotal,
    shipping: shippingCost,
    tax: taxAmount,
    total,
  };
}