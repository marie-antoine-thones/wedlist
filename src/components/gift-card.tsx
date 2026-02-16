import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import type { GiftWithContributions, GiftStatus } from "@/types";
import { Gift, Heart, CheckCircle2, Users } from "lucide-react";

function getStatusConfig(status: GiftStatus) {
  switch (status) {
    case "available":
      return {
        label: "Disponible",
        variant: "outline" as const,
        className: "border-sage-500/30 text-sage-600 bg-sage-50",
      };
    case "reserved":
      return {
        label: "Réservé",
        variant: "secondary" as const,
        className: "bg-rose-100 text-rose-500 border-rose-200",
      };
    case "partially_funded":
      return {
        label: "En cours",
        variant: "secondary" as const,
        className: "bg-warm-100 text-warm-600 border-warm-200",
      };
    case "funded":
      return {
        label: "Financé",
        variant: "secondary" as const,
        className: "bg-sage-100 text-sage-600 border-sage-200",
      };
    case "purchased":
      return {
        label: "Acheté",
        variant: "secondary" as const,
        className: "bg-sage-100 text-sage-600 border-sage-200",
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
        className: "",
      };
  }
}

interface GiftCardProps {
  gift: GiftWithContributions;
}

export function GiftCard({ gift }: GiftCardProps) {
  const statusConfig = getStatusConfig(gift.status as GiftStatus);
  const targetAmount = gift.targetAmount || gift.price;
  const progress = gift.isGroupGift
    ? Math.min((gift.totalContributed / targetAmount) * 100, 100)
    : 0;
  const isUnavailable =
    gift.status === "reserved" ||
    gift.status === "funded" ||
    gift.status === "purchased";

  return (
    <Link href={`/gifts/${gift.id}`} className="group block">
      <Card className="gap-0 overflow-hidden border-border/60 p-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-sage-500/10">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
          {gift.imageUrl ? (
            <Image
              src={gift.imageUrl}
              alt={gift.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gift className="size-12 text-sage-200" />
            </div>
          )}

          {/* Status overlay for unavailable */}
          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <CheckCircle2 className="size-10 text-sage-500" />
            </div>
          )}

          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <Badge
              variant="secondary"
              className="border-none bg-white/90 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur-sm"
            >
              {gift.category.icon && (
                <span className="mr-0.5">{gift.category.icon}</span>
              )}
              {gift.category.name}
            </Badge>
          </div>

          {/* Status badge */}
          {gift.status !== "available" && (
            <div className="absolute right-3 top-3">
              <Badge className={`text-xs ${statusConfig.className}`}>
                {statusConfig.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-serif text-lg leading-snug font-medium text-foreground/90 transition-colors group-hover:text-sage-600">
            {gift.title}
          </h3>

          {/* Price */}
          <p className="mt-2 text-lg font-semibold text-sage-500">
            {formatCurrency(gift.price)}
          </p>

          {/* Group gift progress */}
          {gift.isGroupGift && (
            <div className="mt-3 space-y-2">
              <Progress value={progress} className="h-1.5 bg-sage-100" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {gift.contributionCount}{" "}
                  {gift.contributionCount > 1
                    ? "participations"
                    : "participation"}
                </span>
                <span>
                  {formatCurrency(gift.totalContributed)} /{" "}
                  {formatCurrency(targetAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Available indicator */}
          {!isUnavailable && !gift.isGroupGift && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-sage-500">
              <Heart className="size-3" />
              <span>Disponible</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
