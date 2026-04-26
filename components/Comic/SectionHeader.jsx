import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ kicker, title, subtitle, href }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {kicker && (
          <div className="mb-1 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
            <span className="h-1 w-1 rounded-full bg-accent" /> {kicker}
          </div>
        )}
        <h2 className="font-display text-2xl font-black tracking-tight text-text sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 max-w-xl text-sm text-subtext">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden items-center gap-1 text-sm text-subtext hover:text-accent sm:inline-flex"
        >
          See all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
