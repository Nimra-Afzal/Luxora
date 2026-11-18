import { calculateTaxService } from "../services/taxService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function calculateTax(req, res) {
  try {
    const { country, subtotal } = req.body;

    if (!country || subtotal == null) {
      return res.status(400).json({
        error: "Country and subtotal are required",
      });
    }

    const result = await calculateTaxService(
      country,
      Number(subtotal)
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}