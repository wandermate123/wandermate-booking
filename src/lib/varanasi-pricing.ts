export type Season = "peak" | "off";
export type PickupDropType = "railway" | "airport";

export type PickupDropInput = {
  arrival?: PickupDropType | null;
  departure?: PickupDropType | null;
};

export type VaranasiPlan = "classic" | "premium";

export type VaranasiPricingInput = {
  plan: VaranasiPlan;
  nights: number;
  days: number;
  adults: number;
  season?: Season;
  pickupDrop?: PickupDropInput;
  addOnIds?: string[];
};

export type VaranasiLineItem = {
  label: string;
  amount: number;
};

export type VaranasiPricingBreakdown = {
  lineItems: VaranasiLineItem[];
  baseSubtotal: number;
  baseTotal: number;
  addOnTotal: number;
  total: number;
};

const MARKUP = 1.25;

const CLASSIC_STAY: Record<number, number> = {
  1: 2000, 2: 2000, 3: 2700, 4: 4000, 5: 4700,
  6: 5400, 7: 6700, 8: 7400, 9: 8100,
};

const PREMIUM_STAY_OFF: Record<number, number> = {
  1: 4000, 2: 4000, 3: 5000, 4: 8000, 5: 9000,
  6: 10000, 7: 13000, 8: 14000, 9: 15000,
};

const PREMIUM_STAY_PEAK: Record<number, number> = {
  1: 5000, 2: 5000, 3: 7000, 4: 10000, 5: 12000,
  6: 14000, 7: 17000, 8: 19000, 9: 21000,
};

function stayRate(table: Record<number, number>, adults: number): number {
  const key = Math.min(Math.max(adults, 1), 9);
  return table[key];
}

function guideDailyRate(adults: number): number {
  return adults >= 5 ? 2000 : 1500;
}

function classicGuideDays(days: number): number {
  return days === 2 ? 2 : days - 2;
}

function classicVehicleDays(days: number): number {
  return days === 2 ? 1 : days - 2;
}

function premiumGuideDays(days: number): number {
  return days < 3 ? days : days - 1;
}

function premiumVehicleDays(days: number): number {
  return days < 3 ? days : days - 1;
}

function classicVehicleDailyRate(adults: number): number {
  if (adults <= 4) return 2000;
  if (adults <= 6) return 2400;
  return 4400;
}

function premiumVehicleDailyRate(adults: number): number {
  if (adults <= 4) return 2000;
  if (adults <= 6) return 2800;
  return 4800;
}

function pickupDropLegCost(type: PickupDropType): number {
  return type === "railway" ? 600 : 1100;
}

export function seasonFromDate(dateStr: string): Season {
  const month = new Date(`${dateStr}T12:00:00`).getMonth() + 1;
  return month >= 4 && month <= 9 ? "off" : "peak";
}

function calculatePickupDropCost(
  pickupDrop?: PickupDropInput
): { total: number; label: string | null } {
  if (!pickupDrop?.arrival && !pickupDrop?.departure) {
    return { total: 0, label: null };
  }

  const legs: PickupDropType[] = [];
  if (pickupDrop.arrival) legs.push(pickupDrop.arrival);
  if (pickupDrop.departure) legs.push(pickupDrop.departure);

  const total = legs.reduce((sum, leg) => sum + pickupDropLegCost(leg), 0);
  const parts: string[] = [];
  if (pickupDrop.arrival) {
    parts.push(`${pickupDrop.arrival === "railway" ? "Railway" : "Airport"} arrival`);
  }
  if (pickupDrop.departure) {
    parts.push(`${pickupDrop.departure === "railway" ? "Railway" : "Airport"} departure`);
  }

  return { total, label: `Pickup / drop (${parts.join(", ")})` };
}

function calculateAddOnTotal(plan: VaranasiPlan, adults: number, addOnIds: string[]): number {
  return addOnIds.reduce((sum, id) => sum + calculateAddOnPrice(plan, id, adults), 0);
}

export function calculateAddOnPrice(
  plan: VaranasiPlan,
  addOnId: string,
  adults: number
): number {
  switch (addOnId) {
    case "photography":
      return 3999;
    case "private-boat":
      return 2500;
    case "sugam-darshan":
      if (plan !== "classic") return 0;
      return 300 * adults;
    default:
      return 0;
  }
}

export function calculateVaranasiPrice(
  input: VaranasiPricingInput
): VaranasiPricingBreakdown {
  const { plan, nights, days, adults, season = "off", pickupDrop, addOnIds = [] } = input;
  const lineItems: VaranasiLineItem[] = [];

  const stayPerNight =
    plan === "classic"
      ? stayRate(CLASSIC_STAY, adults)
      : stayRate(season === "peak" ? PREMIUM_STAY_PEAK : PREMIUM_STAY_OFF, adults);
  const stayCost = stayPerNight * nights;
  lineItems.push({ label: `Stay (${nights} night${nights === 1 ? "" : "s"})`, amount: stayCost });

  const guideDays =
    plan === "classic" ? classicGuideDays(days) : premiumGuideDays(days);
  const guideCost = guideDailyRate(adults) * guideDays;
  lineItems.push({
    label: `Guide (${guideDays} day${guideDays === 1 ? "" : "s"})`,
    amount: guideCost,
  });

  const vehicleDays =
    plan === "classic" ? classicVehicleDays(days) : premiumVehicleDays(days);
  const vehicleRate =
    plan === "classic"
      ? classicVehicleDailyRate(adults)
      : premiumVehicleDailyRate(adults);
  const vehicleCost = vehicleRate * vehicleDays;
  lineItems.push({
    label: `Vehicle (${vehicleDays} day${vehicleDays === 1 ? "" : "s"})`,
    amount: vehicleCost,
  });

  if (plan === "premium") {
    const pickup = calculatePickupDropCost(pickupDrop);
    if (pickup.total > 0 && pickup.label) {
      lineItems.push({ label: pickup.label, amount: pickup.total });
    }
  }

  const foodWalk = 200 * adults;
  lineItems.push({ label: "Food walk", amount: foodWalk });

  if (plan === "premium") {
    const darshan = 300 * adults;
    lineItems.push({ label: "Sugam darshan", amount: darshan });
  }

  const misc = 200 * adults;
  lineItems.push({ label: "Miscellaneous", amount: misc });

  const baseSubtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const baseTotal = Math.round(baseSubtotal * MARKUP);
  const addOnTotal = calculateAddOnTotal(plan, adults, addOnIds);

  return {
    lineItems,
    baseSubtotal,
    baseTotal,
    addOnTotal,
    total: baseTotal + addOnTotal,
  };
}
