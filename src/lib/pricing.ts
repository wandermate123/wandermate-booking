import { ADD_ONS, CHILD_MULTIPLIER, TAX_RATE, getVariant } from "./catalog";

export type PricingInput = {
  family: string;
  variantId: string;
  adults: number;
  children: number;
  addOnIds: string[];
};

export type PricingBreakdown = {
  adultTotal:   number;
  childTotal:   number;
  addOnTotal:   number;
  subtotal:     number;
  taxAmount:    number;
  total:        number;
  perAdult:     number;
};

export function calculatePrice(input: PricingInput): PricingBreakdown | null {
  const variant = getVariant(input.family, input.variantId);
  if (!variant) return null;

  const perAdult    = variant.adultPrice;
  const perChild    = Math.round(perAdult * CHILD_MULTIPLIER);
  const adultTotal  = perAdult * input.adults;
  const childTotal  = perChild * input.children;

  const addOnTotal = input.addOnIds.reduce((sum, id) => {
    const ao = ADD_ONS.find((a) => a.id === id);
    return sum + (ao?.price ?? 0);
  }, 0);

  const subtotal  = adultTotal + childTotal + addOnTotal;
  const taxAmount = Math.round(subtotal * TAX_RATE);
  const total     = subtotal + taxAmount;

  return { adultTotal, childTotal, addOnTotal, subtotal, taxAmount, total, perAdult };
}

/** Converts ₹ to paise for Razorpay */
export const toPaise = (rupees: number) => Math.round(rupees * 100);

/** Formats ₹ with Indian locale */
export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
