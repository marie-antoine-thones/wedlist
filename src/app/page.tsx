import { prisma } from "@/lib/db";
import { HeroSection } from "@/components/hero-section";
import { GiftGrid } from "@/components/gift-grid";
import Link from "next/link";
import { Heart, CreditCard } from "lucide-react";

export default async function HomePage() {
  const [settings, categories, gifts] = await Promise.all([
    prisma.settings.findFirst(),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { gifts: true } } },
    }),
    prisma.giftItem.findMany({
      include: {
        category: true,
        contributions: {
          select: {
            id: true,
            guestName: true,
            amount: true,
            message: true,
            isConfirmed: true,
            createdAt: true,
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Le site n&apos;est pas encore configuré.
        </p>
      </div>
    );
  }

  const giftsWithTotals = gifts.map((gift) => {
    const totalContributed = gift.contributions.reduce(
      (sum, c) => sum + c.amount,
      0
    );
    return {
      ...gift,
      totalContributed,
      contributionCount: gift.contributions.length,
      createdAt: gift.createdAt.toISOString(),
      contributions: gift.contributions.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    };
  });

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <HeroSection
        coupleName1={settings.coupleName1}
        coupleName2={settings.coupleName2}
        weddingDate={settings.weddingDate.toISOString()}
        personalMessage={settings.personalMessage}
        heroImageUrl={settings.heroImageUrl}
      />

      {/* Gift list section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <Heart className="size-4 text-rose-400" />
            <span className="h-px w-8 bg-border" />
          </div>
          <h2 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
            Notre Liste de Mariage
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Chaque cadeau compte pour nous. N&apos;hésitez pas à participer à un
            cadeau groupé ou à réserver celui qui vous fait plaisir.
          </p>
        </div>

        {/* Gifts */}
        <GiftGrid gifts={giftsWithTotals} categories={categories} />
      </div>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-warm-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-border" />
              <Heart className="size-4 text-rose-400" />
              <span className="h-px w-8 bg-border" />
            </div>
            <p className="font-serif text-lg text-foreground/80">
              {settings.coupleName1} & {settings.coupleName2}
            </p>
            <Link
              href="/bank-details"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              <CreditCard className="size-4" />
              Coordonnées bancaires
            </Link>
            <p className="text-xs text-muted-foreground/60">
              Fait avec amour pour notre mariage
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
