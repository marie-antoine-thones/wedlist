"use client";

import { useState, useMemo } from "react";
import { GiftCard } from "@/components/gift-card";
import type { GiftWithContributions } from "@/types";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  _count: { gifts: number };
}

interface GiftGridProps {
  gifts: GiftWithContributions[];
  categories: Category[];
}

export function GiftGrid({ gifts, categories }: GiftGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredGifts = useMemo(() => {
    if (activeCategory === "all") return gifts;
    return gifts.filter((gift) => gift.category.slug === activeCategory);
  }, [gifts, activeCategory]);

  return (
    <section id="gifts" className="scroll-mt-8">
      {/* Category filters */}
      <div className="mb-10 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            Tout
            <span className="ml-1.5 text-xs opacity-70">{gifts.length}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === cat.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
              <span className="ml-1.5 text-xs opacity-70">
                {cat._count.gifts}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Gift grid */}
      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGifts.map((gift, index) => (
            <div
              key={gift.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <GiftCard gift={gift} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-warm-100 p-6">
            <Gift className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl text-foreground/80">
            Aucun cadeau dans cette catégorie
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Essayez une autre catégorie ou consultez tous les cadeaux.
          </p>
          <button
            onClick={() => setActiveCategory("all")}
            className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Voir tous les cadeaux
          </button>
        </div>
      )}
    </section>
  );
}
