import { formatDate } from "@/lib/format";
import { ChevronDown, CalendarDays } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  coupleName1: string;
  coupleName2: string;
  weddingDate: string;
  personalMessage: string;
  heroImageUrl: string | null;
}

export function HeroSection({
  coupleName1,
  coupleName2,
  weddingDate,
  personalMessage,
  heroImageUrl,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      {/* Background image */}
      {heroImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sage-200 via-warm-100 to-rose-100" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white">
        {/* Decorative element */}
        <div className="animate-fade-in-up mb-6 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-white/60" />
          <span className="text-sm font-light uppercase tracking-[0.3em] text-white/80">
            Nous nous marions
          </span>
          <span className="h-px w-12 bg-white/60" />
        </div>

        {/* Couple names */}
        <h1 className="animate-fade-in-up-delay-1 font-serif text-5xl leading-tight font-light tracking-wide sm:text-6xl md:text-7xl">
          {coupleName1}
          <span className="mx-3 text-3xl italic text-white/70 sm:mx-4 sm:text-4xl md:text-5xl">
            &
          </span>
          {coupleName2}
        </h1>

        {/* Wedding date */}
        <p className="animate-fade-in-up-delay-2 mt-6 text-lg font-light tracking-wider text-white/90 sm:text-xl">
          {formatDate(weddingDate)}
        </p>

        {/* Personal message */}
        {personalMessage && (
          <p className="animate-fade-in-up-delay-3 mx-auto mt-8 max-w-xl text-base leading-relaxed font-light text-white/80 sm:text-lg">
            {personalMessage}
          </p>
        )}

        {/* CTAs */}
        <div className="animate-fade-in-up-delay-3 mt-12 flex flex-col items-center gap-5">
          <Link
            href="/programme"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/60"
          >
            <CalendarDays className="size-4" />
            Le Programme
          </Link>

          <a
            href="#gifts"
            className="inline-flex flex-col items-center gap-2 text-sm font-light uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
          >
            Découvrir notre liste
            <ChevronDown className="size-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
