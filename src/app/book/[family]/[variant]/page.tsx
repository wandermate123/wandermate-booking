import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import BookingForm from "@/components/BookingForm";
import FAQSidebar from "@/components/FAQSidebar";
import { getPackage, getVariant } from "@/lib/catalog";
import Link from "next/link";

type Params = { family: string; variant: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { family, variant: variantId } = await params;
  const pkg     = getPackage(family);
  const variant = getVariant(family, variantId);
  if (!pkg || !variant) return {};
  return {
    title: `Book ${pkg.name} — ${variant.label} | WanderMate`,
    description: pkg.tagline,
  };
}

export default async function BookingPage({ params }: { params: Promise<Params> }) {
  const { family, variant: variantId } = await params;
  const pkg     = getPackage(family);
  const variant = getVariant(family, variantId);

  if (!pkg || !variant) notFound();

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-[#fdf6ec] border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto text-xs text-gray-400 flex items-center gap-1.5">
          <Link href="https://www.wandermate.in" className="hover:text-[#0f2744]">Home</Link>
          <span>›</span>
          <Link href="/book" className="hover:text-[#0f2744]">Packages</Link>
          <span>›</span>
          <span className="text-[#0f2744] font-medium">{pkg.name}</span>
        </div>
      </div>

      {/* Page header */}
      <section className="bg-[#0f2744] text-white px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#e86228] text-xs font-semibold uppercase tracking-widest mb-2">
            {pkg.subtitle}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
            {pkg.name}
          </h1>
          <p className="text-gray-300 text-sm">{variant.label}</p>
        </div>
      </section>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-[1fr_360px] gap-12 items-start">

        {/* Left — booking form */}
        <div className="card p-8">
          {/* What's included */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h2 className="font-serif text-xl font-semibold text-[#0f2744] mb-4">
              What's Included
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {pkg.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-[#e86228] mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <BookingForm pkg={pkg} initialVariant={variant} />
        </div>

        {/* Right — FAQ sidebar */}
        <div className="sticky top-24">
          <FAQSidebar faqs={pkg.faqs} />
        </div>
      </main>
    </>
  );
}
