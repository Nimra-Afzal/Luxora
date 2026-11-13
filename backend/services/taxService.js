import TaxRate from "../models/TaxRate.js";

export async function calculateTaxService(country, subtotal) {
  const taxConfig = await TaxRate.findOne({ country });

  if (!taxConfig) {
    return {
      rate: 0,
      taxAmount: 0,
    };
  }

  const taxAmount = (subtotal * taxConfig.rate) / 100;

  return {
    rate: taxConfig.rate,
    taxAmount,
  };
}