// ─── WanderMate Package Catalog ──────────────────────────────────────────────
// Edit prices, durations, add-ons and FAQs here — nowhere else.

export type Variant = {
  id: string;       // e.g. "3n4d"
  label: string;    // e.g. "3 Nights / 4 Days"
  nights: number;
  adultPrice: number; // ₹ per adult
};

export type Package = {
  family: string;
  name: string;
  subtitle: string;
  tagline: string;
  includes: string[];
  highlights: string[];
  variants: Variant[];
  faqs: { q: string; a: string }[];
};

export type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number; // flat per booking
};

// ─── Packages ─────────────────────────────────────────────────────────────────

export const PACKAGES: Package[] = [
  {
    family: "spiritual-triangle",
    name: "The Spiritual Triangle",
    subtitle: "Kashi · Ayodhya · Prayagraj",
    tagline: "Three sacred cities, one unforgettable journey along the Ganga.",
    includes: [
      "Hotel accommodation (twin sharing)",
      "Daily breakfast",
      "AC cab for all transfers",
      "Expert local guide",
      "Ganga Aarti experience",
      "Boat ride on the Ganges",
    ],
    highlights: [
      "Kashi Vishwanath Corridor",
      "Ram Mandir Darshan, Ayodhya",
      "Triveni Sangam Snan, Prayagraj",
      "Dashashwamedh Ghat Aarti",
      "Sarnath Buddhist circuit",
    ],
    variants: [
      { id: "3n4d", label: "3 Nights / 4 Days", nights: 3, adultPrice: 10999 },
      { id: "4n5d", label: "4 Nights / 5 Days", nights: 4, adultPrice: 12999 },
      { id: "5n6d", label: "5 Nights / 6 Days", nights: 5, adultPrice: 15999 },
    ],
    faqs: [
      {
        q: "Which cities are covered?",
        a: "Varanasi (Kashi), Ayodhya, and Prayagraj. We handle all inter-city transfers by AC cab.",
      },
      {
        q: "Is the package customisable?",
        a: "Yes — contact us on WhatsApp after booking and our host will adjust the itinerary based on your preferences.",
      },
      {
        q: "What type of hotels are included?",
        a: "3-star category hotels in each city. Upgrades to 4-star or heritage properties are available on request.",
      },
      {
        q: "Is airfare / train fare included?",
        a: "No. The package covers local travel between cities only. We'll share the best train options for your dates.",
      },
      {
        q: "Can I travel solo?",
        a: "Absolutely. Solo bookings are welcome; hotel rooms are on single-occupancy basis.",
      },
    ],
  },
  {
    family: "varanasi",
    name: "Varanasi Package",
    subtitle: "Kashi Exclusive",
    tagline: "Immerse yourself in the living heart of ancient Kashi.",
    includes: [
      "Hotel accommodation (twin sharing)",
      "Daily breakfast",
      "Airport / station transfers",
      "Expert local guide",
      "Ganga Aarti experience",
      "Morning boat ride",
    ],
    highlights: [
      "Kashi Vishwanath Temple",
      "Manikarnika & Assi Ghats",
      "Banarasi silk & craft lanes",
      "Sarnath Stupa & Museum",
      "Street food walk",
    ],
    variants: [
      { id: "1n2d", label: "1 Night / 2 Days",  nights: 1, adultPrice: 4999  },
      { id: "2n3d", label: "2 Nights / 3 Days", nights: 2, adultPrice: 7999  },
      { id: "3n4d", label: "3 Nights / 4 Days", nights: 3, adultPrice: 9999  },
      { id: "4n5d", label: "4 Nights / 5 Days", nights: 4, adultPrice: 12999 },
      { id: "5n6d", label: "5 Nights / 6 Days", nights: 5, adultPrice: 16999 },
      { id: "6n7d", label: "6 Nights / 7 Days", nights: 6, adultPrice: 20999 },
    ],
    faqs: [
      {
        q: "Which ghats will I visit?",
        a: "Dashashwamedh, Assi, Manikarnika, Kedar, and several lesser-known ghats depending on your duration.",
      },
      {
        q: "Is the Ganga Aarti included every night?",
        a: "Yes — the evening Ganga Aarti at Dashashwamedh is included on all nights of your stay.",
      },
      {
        q: "What's the best duration for a first visit?",
        a: "We recommend at least 2 Nights / 3 Days for a comfortable first visit. 3N/4D is our most popular option.",
      },
      {
        q: "Are meals included beyond breakfast?",
        a: "Breakfast is included. Lunch and dinner can be added as an optional add-on, or our guide will recommend the best local spots.",
      },
      {
        q: "Is Sarnath included?",
        a: "Yes, a half-day Sarnath excursion is included in all packages of 2N/3D and above.",
      },
    ],
  },
];

// ─── Add-ons ──────────────────────────────────────────────────────────────────

export const ADD_ONS: AddOn[] = [
  {
    id: "airport-transfer",
    name: "Airport / Station Transfer",
    description: "Private AC cab pickup and drop at Varanasi airport or railway station.",
    price: 999,
  },
  {
    id: "photography",
    name: "Professional Photography Session",
    description: "2-hour golden-hour ghat session with a professional photographer. 30 edited photos delivered.",
    price: 2499,
  },
  {
    id: "premium-boat",
    name: "Premium Sunrise Boat Ride",
    description: "Private wooden boat at sunrise — best views of the ghats, away from tourist crowds.",
    price: 1499,
  },
];

// ─── Pricing rules ────────────────────────────────────────────────────────────

export const CHILD_MULTIPLIER = 0.5; // children 5–11: 50% of adult price
export const TAX_RATE         = 0.05; // 5% GST
export const MAX_PAX          = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPackage(family: string): Package | undefined {
  return PACKAGES.find((p) => p.family === family);
}

export function getVariant(family: string, variantId: string): Variant | undefined {
  return getPackage(family)?.variants.find((v) => v.id === variantId);
}
