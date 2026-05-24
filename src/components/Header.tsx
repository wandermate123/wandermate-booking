import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#0f2744] shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
        <Link href="https://www.wandermate.in" className="flex items-center gap-2">
          {/* Text logo fallback — replace src with actual logo once exported */}
          <span className="font-serif text-2xl font-semibold text-white tracking-wide">
            Wander<span className="text-[#e86228]">Mate</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
