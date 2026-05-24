// ─── WanderMate Package Catalog ──────────────────────────────────────────────
// Edit prices, durations, add-ons and FAQs here — nowhere else.

export type Variant = {
  id: string;       // e.g. "3n4d"
  label: string;    // e.g. "3 Nights / 4 Days"
  nights: number;
  /** Per-adult list price — Spiritual Triangle only. Varanasi uses dynamic group pricing in varanasi-pricing.ts */
  adultPrice?: number;
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
  price: number; // display price for non-varanasi packages
  families: string[]; // package families this add-on applies to
};

// ─── Packages ─────────────────────────────────────────────────────────────────

export const PACKAGES: Package[] = [
  {
    family: "test-package",
    name: "Test Package",
    subtitle: "Live payment test only",
    tagline: "Flat ₹10 — use this to test booking, payment, and confirmation email on the live site.",
    includes: [
      "Not a real tour — payment flow testing only",
      "Triggers the same booking + Razorpay + email flow",
    ],
    highlights: [
      "₹10 flat total",
      "Same checkout as real packages",
      "Remove from catalog before public launch",
    ],
    variants: [{ id: "test", label: "Test booking", nights: 0, adultPrice: 10 }],
    faqs: [
      {
        q: "Is this a real tour?",
        a: "No. This package exists only to test payments and confirmation emails. Do not book unless you are testing the system.",
      },
    ],
  },
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
        q: "Which cities are covered and in what order?",
        a: "Varanasi (Kashi), Ayodhya, and Prayagraj. Your exact route and night-stops depend on your duration — we typically start from Varanasi and plan the loop so darshan timings and drive distances stay comfortable. All inter-city travel is by AC cab with your driver staying with the group.",
      },
      {
        q: "How long are the drives between cities?",
        a: "Varanasi to Ayodhya is roughly 3–4 hours by road. Ayodhya to Prayagraj is about 2.5–3 hours. Prayagraj back to Varanasi is around 2.5 hours. We build in rest stops and avoid late-night driving wherever possible.",
      },
      {
        q: "Is the Ram Mandir darshan included?",
        a: "Yes — a visit to Shri Ram Janmabhoomi in Ayodhya is a core part of the itinerary. Our guide helps with entry procedures and the best time slot for your dates. Carry a valid photo ID; mobile phones may need to be deposited at the cloakroom as per temple rules.",
      },
      {
        q: "Can we take a holy dip at Triveni Sangam?",
        a: "Yes. At Prayagraj we arrange your visit to the Triveni Sangam (confluence of Ganga, Yamuna, and the mythical Saraswati). Boat rides to the sangam point can be arranged on-site at nominal local rates. Our guide will explain the ritual respectfully — participation is entirely optional.",
      },
      {
        q: "What type of hotels are included?",
        a: "Clean, comfortable 3-star category hotels in each city with attached bathrooms and daily breakfast. Rooms are on twin-sharing basis (two beds). Upgrades to 4-star or heritage properties are available on request — message us on WhatsApp after booking.",
      },
      {
        q: "Is the food vegetarian?",
        a: "Yes. All included breakfasts are vegetarian, and our guides recommend trusted local restaurants that serve pure vegetarian meals — important for temple towns across this circuit. Let us know about Jain dietary needs or allergies in your special requests.",
      },
      {
        q: "Is train or flight fare included?",
        a: "No. The package covers hotels, breakfast, local sightseeing, guide, and AC cab transfers between the three cities. We are happy to suggest the best trains or flights into Varanasi (VNS airport / BSB or DDU junction) for your dates.",
      },
      {
        q: "Can I travel solo or as a couple?",
        a: "Absolutely. Solo travellers get a single-occupancy room. Couples, families, and small groups of up to 12 are welcome. For larger groups, contact us directly for a custom quote.",
      },
      {
        q: "What should I carry for temple visits?",
        a: "Valid photo ID (Aadhaar, passport, or driving licence), modest clothing covering shoulders and knees, a scarf for head covering where required, and a small bag for shoes (footwear is not allowed inside most temples). Avoid leather items inside temple premises where restricted.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Plans change — we understand. Message us on WhatsApp as early as possible if you need to cancel or move your dates. Refunds depend on how close you are to travel and whether hotels and transport have been confirmed. We'll always explain your options clearly before anything is finalised.",
      },
    ],
  },
  {
    family: "varanasi-classic",
    name: "Classic Varanasi Package",
    subtitle: "Kashi Essentials",
    tagline: "The perfect introduction to ancient Kashi — ghats, temples, and timeless rituals.",
    includes: [
      "3-star hotel accommodation (twin sharing)",
      "Daily breakfast",
      "Airport / station transfers",
      "Expert local guide (shared group)",
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
      { id: "1n2d", label: "1 Night / 2 Days",  nights: 1 },
      { id: "2n3d", label: "2 Nights / 3 Days", nights: 2 },
      { id: "3n4d", label: "3 Nights / 4 Days", nights: 3 },
      { id: "4n5d", label: "4 Nights / 5 Days", nights: 4 },
      { id: "5n6d", label: "5 Nights / 6 Days", nights: 5 },
      { id: "6n7d", label: "6 Nights / 7 Days", nights: 6 },
    ],
    faqs: [
      {
        q: "What's the best duration for a first visit to Varanasi?",
        a: "We recommend at least 2 Nights / 3 Days — enough for the ghats, Kashi Vishwanath, a boat ride, and Ganga Aarti without rushing. 3N/4D adds Sarnath and deeper lane walks. If you have only one night, we can still cover the essentials, but you'll feel the city deserves more time.",
      },
      {
        q: "Which ghats and temples will I visit?",
        a: "Dashashwamedh, Assi, Manikarnika, Kedar, and several quieter ghats depending on your duration. Temple visits include Kashi Vishwanath Corridor and other significant shrines in the old city. Your guide paces the walk to avoid crowds and midday heat.",
      },
      {
        q: "Is the Ganga Aarti included every night?",
        a: "Yes — the evening Ganga Aarti at Dashashwamedh Ghat is included on every night of your stay. Your guide helps you find a good viewing spot. Aarti typically starts around sunset (timing shifts seasonally). Arrive 30–45 minutes early during peak season.",
      },
      {
        q: "How does Kashi Vishwanath darshan work?",
        a: "Our guide accompanies you through the corridor and main temple. Standard queue darshan is included. For shorter wait times, you can add Sugam Darshan (priority entry) as an optional add-on at ₹300 per adult. Carry a valid photo ID and expect security screening.",
      },
      {
        q: "Is Sarnath included?",
        a: "Yes — a half-day trip to Sarnath (where Buddha gave his first sermon) is included in all packages of 2N/3D and above. You'll see the Dhamek Stupa, archaeological museum, and monasteries. It's a calmer contrast to the old city and well worth the visit.",
      },
      {
        q: "Are children charged? What about kids under 10?",
        a: "Children under 10 stay free (no extra bed). They are counted for food walk and activity charges. Children aged 10 and above are counted as adults for room and pricing purposes. Strollers are difficult in the old city's narrow lanes — a carrier is more practical.",
      },
      {
        q: "Is Varanasi safe for solo travellers and women?",
        a: "Varanasi is one of India's most visited pilgrimage cities and is generally safe with normal precautions. You'll have a dedicated local guide, verified drivers, and hotel stays in established areas. We recommend avoiding isolated ghat areas alone late at night — your guide will advise on this.",
      },
      {
        q: "What should I wear and bring?",
        a: "Modest clothing (shoulders and knees covered) for temples. Comfortable walking shoes that slip on and off easily. A scarf for head covering, sunscreen, a water bottle, and cash for small purchases — though UPI works at most shops. Photography is restricted inside many temples; your guide will point out where it's allowed.",
      },
      {
        q: "Are meals included beyond breakfast?",
        a: "Daily breakfast at the hotel is included. Lunch and dinner are not included — Varanasi's street food is part of the experience. A guided food walk is included, and your guide will recommend trusted local spots for kachori, lassi, and thali meals.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Message us on WhatsApp as early as possible if you need to cancel or reschedule. What we can refund depends on your travel date and whether your hotel and guide have been confirmed. We'll always be upfront about your options — no hidden terms.",
      },
    ],
  },
  {
    family: "varanasi-premium",
    name: "Premium Varanasi Package",
    subtitle: "WanderMate Premium Experience",
    tagline: "Private guiding, VIP rituals, and handpicked 3-star stays in the heart of Kashi.",
    includes: [
      "3-star hotel accommodation (twin sharing)",
      "Daily breakfast & one curated dinner",
      "Private AC airport / station transfers",
      "Dedicated private local guide",
      "VIP Ganga Aarti seating",
      "Private sunrise boat ride",
    ],
    highlights: [
      "Kashi Vishwanath Corridor & VIP darshan",
      "Exclusive ghat walk at dawn",
      "Banarasi silk atelier visit",
      "Private Sarnath heritage tour",
      "Curated street food & chai trail",
    ],
    variants: [
      { id: "1n2d", label: "1 Night / 2 Days",  nights: 1 },
      { id: "2n3d", label: "2 Nights / 3 Days", nights: 2 },
      { id: "3n4d", label: "3 Nights / 4 Days", nights: 3 },
      { id: "4n5d", label: "4 Nights / 5 Days", nights: 4 },
      { id: "5n6d", label: "5 Nights / 6 Days", nights: 5 },
      { id: "6n7d", label: "6 Nights / 7 Days", nights: 6 },
    ],
    faqs: [
      {
        q: "How is Premium different from Classic?",
        a: "Both Classic and Premium use comfortable 3-star hotels. Premium adds a private dedicated guide (not shared), VIP seating at Ganga Aarti, a private sunrise boat ride, one curated dinner, and Sugam Darshan included. Classic includes a shared guide and standard Aarti viewing. Both are fully private tours for your group — never mixed with strangers.",
      },
      {
        q: "Why does the price change by travel month?",
        a: "Premium hotel rates vary by season. October to March is peak season (Pleasant weather, festivals, and high demand). April to September is off-season with lower room rates. Your final price is calculated automatically based on the start date you select.",
      },
      {
        q: "Which hotels are included in Premium?",
        a: "Handpicked 3-star properties in or near the old city — clean, well-located, and suited to pilgrims. The exact hotel depends on your dates and group size. We confirm your hotel name within 24 hours of booking.",
      },
      {
        q: "What does VIP Ganga Aarti seating mean?",
        a: "We reserve a dedicated viewing area close to the Aarti platform at Dashashwamedh Ghat — not the distant crowd behind barriers. You arrive with your guide who manages timing and seating. It's the difference between watching from afar and being part of the ceremony.",
      },
      {
        q: "Is airport or railway pickup included?",
        a: "Pickup and drop are optional add-ons you select at booking — railway station ₹600 per way, airport ₹1,100 per way (per vehicle, not per person). If you don't need transfers, simply leave both as 'Not needed'. Your guide meets you at the hotel if you're arriving independently.",
      },
      {
        q: "Is Sugam Darshan included or extra?",
        a: "Included in Premium — no add-on needed. We arrange priority entry at Kashi Vishwanath so you spend less time in queue and more time inside the temple. Carry valid photo ID; follow the dress code and leave phones at the designated counter.",
      },
      {
        q: "What's the best duration for Premium?",
        a: "3 Nights / 4 Days is our most popular Premium option — enough for unhurried ghat walks at dawn, Sarnath, silk atelier visits, and multiple Aarti evenings. 2N/3D works for a focused spiritual getaway. Longer stays let us include day trips and deeper craft experiences.",
      },
      {
        q: "Is Sarnath included?",
        a: "Yes — a private half-day Sarnath heritage tour is included in all Premium packages of 2N/3D and above. Your private guide covers the stupa, museum, and key monasteries at your pace, with time for quiet reflection.",
      },
      {
        q: "Can you accommodate dietary restrictions or elderly travellers?",
        a: "Yes. Mention vegetarian, Jain, no-onion-garlic, or allergy requirements in your special requests — your curated dinner and restaurant recommendations will be planned accordingly. For elderly guests or limited mobility, we adjust walking routes, use vehicle drop-offs closer to ghats, and avoid steep steps where possible.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Premium hotels are blocked in advance, so early notice helps. WhatsApp us if you need to cancel or change dates — we'll explain what's possible based on your travel date and confirmed bookings. We aim to be fair and transparent, never vague.",
      },
    ],
  },
];

// ─── Add-ons ──────────────────────────────────────────────────────────────────

export const ADD_ONS: AddOn[] = [
  {
    id: "photography",
    name: "Professional Photography Session",
    description:
      "2-hour golden-hour ghat session with a professional photographer. 30 edited photos delivered.",
    price: 3999,
    families: ["varanasi-classic", "varanasi-premium"],
  },
  {
    id: "private-boat",
    name: "Private Boat Ride",
    description:
      "One private wooden boat for your group — best views of the ghats, away from tourist crowds.",
    price: 2500,
    families: ["varanasi-classic", "varanasi-premium"],
  },
  {
    id: "sugam-darshan",
    name: "Sugam Darshan",
    description: "Priority darshan arrangement at Kashi Vishwanath Temple.",
    price: 300,
    families: ["varanasi-classic"],
  },
  {
    id: "airport-transfer",
    name: "Airport / Station Transfer",
    description: "Private AC cab pickup and drop at Varanasi airport or railway station.",
    price: 999,
    families: ["default"],
  },
  {
    id: "premium-boat",
    name: "Premium Sunrise Boat Ride",
    description:
      "Private wooden boat at sunrise — best views of the ghats, away from tourist crowds.",
    price: 1499,
    families: ["default"],
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

export function isTestPackage(family: string): boolean {
  return family === "test-package";
}

export function isVaranasiFamily(family: string): boolean {
  return family === "varanasi-classic" || family === "varanasi-premium";
}

export function varanasiPlanFromFamily(family: string): "classic" | "premium" | null {
  if (family === "varanasi-classic") return "classic";
  if (family === "varanasi-premium") return "premium";
  return null;
}
