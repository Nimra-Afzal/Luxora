import ShippingZone from "../models/ShippingZone.js";
import ShippingMethod from "../models/ShippingMethod.js";

export async function getShippingMethodsService(country, subtotal) {
  // 1️⃣ Find zone that contains this country
  const zone = await ShippingZone.findOne({
    countries: country,
  });

  if (!zone) {
    throw new Error("No shipping zone available for this country");
  }

  // 2️⃣ Get methods for this zone
  const methods = await ShippingMethod.find({ zone: zone._id });

  // 3️⃣ Apply free shipping logic
  const calculatedMethods = methods.map(method => {
    let finalPrice = method.price;

    if (
      method.freeShippingThreshold > 0 &&
      subtotal >= method.freeShippingThreshold
    ) {
      finalPrice = 0;
    }

    return {
      _id: method._id,
      name: method.name,
      estimatedDays: method.estimatedDays,
      price: finalPrice,
      originalPrice: method.price,
      freeShippingApplied: finalPrice === 0,
    };
  });

  return calculatedMethods;
}