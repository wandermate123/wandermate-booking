# WanderMate Booking Engine

Next.js 15 · Prisma · Neon Postgres · Razorpay · Vercel

---

## What's inside

| Route | Description |
|---|---|
| `/book` | Package picker (Spiritual Triangle vs Varanasi) |
| `/book/spiritual-triangle/3n4d` | Booking form for a specific variant |
| `/book/varanasi/2n3d` | Same pattern for any family/variant |
| `/book/thank-you` | Post-payment confirmation page |
| `POST /api/bookings` | Create booking record (status: PENDING) |
| `POST /api/razorpay/order` | Create Razorpay order linked to booking |
| `POST /api/razorpay/webhook` | Handle `payment.captured` → mark PAID |

---

## Quick start

### 1. Clone & install
```bash
git clone <your-repo>
cd wandermate-booking
npm install
```

### 2. Set up Neon Postgres
1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the **connection string** (both pooled and direct URLs)

### 3. Set up Razorpay
1. [razorpay.com/dashboard](https://dashboard.razorpay.com) → Settings → API Keys
2. Generate a **Live** key pair
3. Settings → Webhooks → Add `https://yourdomain.com/api/razorpay/webhook`
   - Event: `payment.captured`
   - Copy the **webhook secret**

### 4. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

| Variable | Where to find it |
|---|---|
| `DATABASE_URL` | Neon dashboard → Connection string (pooled) |
| `DIRECT_URL` | Neon dashboard → Connection string (direct) |
| `RAZORPAY_KEY_ID` | Razorpay dashboard → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard → API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay dashboard → Webhooks |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as `RAZORPAY_KEY_ID` |
| `NEXT_PUBLIC_WHATSAPP_BOOKING_NUMBER` | Your WhatsApp number, e.g. `919876543210` |

### 5. Push database schema
```bash
npm run db:push
```

### 6. Run locally
```bash
npm run dev
# Open http://localhost:3000/book
```

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Then add all `.env.local` variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

After deploying, update the Razorpay webhook URL to `https://yourdomain.vercel.app/api/razorpay/webhook`.

---

## Customising packages / prices

Everything is in **`src/lib/catalog.ts`** — edit prices, durations, add-ons, highlights, and FAQs there. No other file needs to change.

```typescript
// Change adult price for Spiritual Triangle 4N/5D
{ id: "4n5d", label: "4 Nights / 5 Days", nights: 4, adultPrice: 13999 },
```

---

## Logo

The header uses a text fallback. To use your actual logo:

1. Export `Wandermate_logo.png` from your Wix site (or use the existing CDN URL)
2. Place it in `/public/logo.png`
3. In `src/components/Header.tsx`, replace the `<span>` with:
```tsx
<Image src="/logo.png" alt="WanderMate" width={140} height={40} priority />
```

---

## Tech stack

- **Next.js 15** — App Router, server components, API routes
- **Prisma + Neon** — PostgreSQL ORM with serverless Postgres
- **Razorpay** — Indian payment gateway (UPI, cards, net banking, wallets)
- **Tailwind CSS** — Utility-first styling with WanderMate brand tokens
- **Vercel** — Zero-config deployment

---

## Out of scope (by design)
- Admin dashboard
- Email confirmation (add Resend/Nodemailer if needed)
- Heritage walks & custom quotes
- Capacity limits per date
