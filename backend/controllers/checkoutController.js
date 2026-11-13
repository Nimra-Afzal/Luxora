import { validateCheckoutService } from "../services/checkoutService.js";

export async function validateCheckout(req, res) {
  try {
    const { items, addressId, shippingMethodId } = req.body;

    const result = await validateCheckoutService(
      req.user.id,
      items,
      addressId,
      shippingMethodId
    );

    res.json({
      subtotal: result.subtotal,
      shipping: result.shipping,
      tax: result.tax,
      total: result.total,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}