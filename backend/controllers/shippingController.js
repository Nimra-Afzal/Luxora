import { getShippingMethodsService } from "../services/shippingService.js";

export async function getShippingMethods(req, res) {
  try {
    const { country, subtotal } = req.body;

    if (!country || subtotal == null) {
      return res.status(400).json({
        error: "Country and subtotal are required",
      });
    }

    const methods = await getShippingMethodsService(
      country,
      Number(subtotal)
    );

    res.json({ methods });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}