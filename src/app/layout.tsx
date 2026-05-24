import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Book a Package | WanderMate",
  description:
    "Book curated tour packages in Varanasi, Ayodhya and Prayagraj with WanderMate — your trusted travel partner from Kashi.",
  openGraph: {
    title: "Book a Package | WanderMate",
    description: "Curated spiritual & heritage tour packages in Varanasi, Ayodhya and Prayagraj.",
    url: "https://wandermate.in/book",
    siteName: "WanderMate",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-white text-navy">{children}</body>
    </html>
  );
}
