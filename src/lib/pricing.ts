import {
  ADD_ONS,
  CHILD_MULTIPLIER,
  TAX_RATE,
  getVariant,
  isTestPackage,
  isVaranasiFamily,
  varanasiPlanFromFamily,
  type AddOn,
} from "./catalog";
import {
  calculateAddOnPrice,
  calculateVaranasiPrice,
  seasonFromDate,
  type PickupDropInput,
} from "./varanasi-pricing";

export type PricingInput = {
  family: string;
  variantId: string;
  adults: number;
  children: number;
  addOnIds: string[];
  startDate?: string;
  pickupDrop?: PickupDropInput;
};

export type PricingLineItem = {
  label: string;
  amount: number;
};

export type PricingBreakdown = {
  adultTotal: number;
  childTotal: number;
  addOnTotal: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  perAdult: number;
  lineItems?: PricingLineItem[];
  usesMarkup?: boolean;
};

export const TEST_PACKAGE_PRICE = 10;

export function getAddOnsForFamily(family: string): AddOn[] {
  if (isTestPackage(family)) return [];
  const plan = varanasiPlanFromFamily(family);
  if (plan === "classic") {
    return ADD_ONS.filter((ao) => ao.families.includes("varanasi-classic"));
  }
  if (plan === "premium") {
    return ADD_ONS.filter((ao) => ao.families.includes("varanasi-premium"));
  }
  return ADD_ONS.filter((ao) => ao.families.includes("default"));
}

export function getAddOnDisplayPrice(
  family: string,
  addOnId: string,
  adults = 2
): number {
  const plan = varanasiPlanFromFamily(family);
  if (plan) {
    return calculateAddOnPrice(plan, addOnId, Math.max(adults, 1));
  }
  const ao = ADD_ONS.find((a) => a.id === addOnId);
  return ao?.price ?? 0;
}

export function calculatePrice(input: PricingInput): PricingBreakdown | null {
  const variant = getVariant(input.family, input.variantId);
  if (!variant) return null;

  if (isTestPackage(input.family)) {
    return {
      adultTotal: TEST_PACKAGE_PRICE,
      childTotal: 0,
      addOnTotal: 0,
      subtotal: TEST_PACKAGE_PRICE,
      taxAmount: 0,
      total: TEST_PACKAGE_PRICE,
      perAdult: TEST_PACKAGE_PRICE,
    };
  }

  if (isVaranasiFamily(input.family)) {
    const plan = varanasiPlanFromFamily(input.family);
    if (!plan) return null;

    const days = variant.nights + 1;
    const season = input.startDate ? seasonFromDate(input.startDate) : "off";

    const breakdown = calculateVaranasiPrice({
      plan,
      nights: variant.nights,
      days,
      adults: input.adults,
      season,
      pickupDrop: input.pickupDrop,
      addOnIds: input.addOnIds,
    });

    return {
      adultTotal: breakdown.baseTotal,
      childTotal: 0,
      addOnTotal: breakdown.addOnTotal,
      subtotal: breakdown.baseSubtotal + breakdown.addOnTotal,
      taxAmount: breakdown.baseTotal - breakdown.baseSubtotal,
      total: breakdown.total,
      perAdult: Math.round(breakdown.baseTotal / Math.max(input.adults, 1)),
      lineItems: breakdown.lineItems,
      usesMarkup: true,
    };
  }

  const perAdult = variant.adultPrice;
  if (!perAdult) return null;
  const perChild = Math.round(perAdult * CHILD_MULTIPLIER);
  const adultTotal = perAdult * input.adults;
  const childTotal = perChild * input.children;

  const addOnTotal = input.addOnIds.reduce((sum, id) => {
    const ao = ADD_ONS.find((a) => a.id === id);
    return sum + (ao?.price ?? 0);
  }, 0);

  const packageSubtotal = adultTotal + childTotal;
  const taxAmount = Math.round(packageSubtotal * TAX_RATE);
  const total = packageSubtotal + taxAmount + addOnTotal;
  const subtotal = packageSubtotal + addOnTotal;

  return { adultTotal, childTotal, addOnTotal, subtotal, taxAmount, total, perAdult };
}

export function getGroupQuote(
  family: string,
  variantId: string,
  adults: number,
  options?: { startDate?: string; pickupDrop?: PickupDropInput }
): number | null {
  return (
    calculatePrice({
      family,
      variantId,
      adults,
      children: 0,
      addOnIds: [],
      startDate: options?.startDate,
      pickupDrop: options?.pickupDrop,
    })?.total ?? null
  );
}

/** Converts ₹ to paise for Razorpay */
export const toPaise = (rupees: number) => Math.round(rupees * 100);

/** Formats ₹ with Indian locale */
export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
