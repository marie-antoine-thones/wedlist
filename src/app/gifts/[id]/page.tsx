import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ContributionForm } from "@/components/contribution-form";
import { BankDetailsCard } from "@/components/bank-details-card";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  ArrowLeft,
  Gift,
  Heart,
  Users,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";

interface GiftPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const giftId = parseInt(id, 10);
  if (isNaN(giftId)) return { title: "Cadeau introuvable" };

  const gift = await prisma.giftItem.findUnique({
    where: { id: giftId },
    select: { title: true },
  });

  return {
    title: gift ? `${gift.title} — Liste de Mariage` : "Cadeau introuvable",
  };
}

export default async function GiftDetailPage({ params }: GiftPageProps) {
  const { id } = await params;
  const giftId = parseInt(id, 10);
  if (isNaN(giftId)) notFound();

  const [gift, settings] = await Promise.all([
    prisma.giftItem.findUnique({
      where: { id: giftId },
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
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.settings.findFirst(),
  ]);

  if (!gift) notFound();

  const totalContributed = gift.contributions.reduce(
    (sum, c) => sum + c.amount,
    0
  );
  const targetAmount = gift.targetAmount || gift.price;
  const progress = gift.isGroupGift
    ? Math.min((totalContributed / targetAmount) * 100, 100)
    : 0;
  const isUnavailable =
    gift.status === "reserved" ||
    gift.status === "funded" ||
    gift.status === "purchased";
  const canContribute = !isUnavailable || gift.isGroupGift;

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Left column — Gift info */}
          <div className="space-y-8">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-100">
              {gift.imageUrl ? (
                <Image
                  src={gift.imageUrl}
                  alt={gift.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Gift className="size-16 text-sage-200" />
                </div>
              )}

              {/* Unavailable overlay */}
              {isUnavailable && !gift.isGroupGift && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto size-12 text-sage-500" />
                    <p className="mt-2 font-serif text-lg text-sage-600">
                      {gift.status === "reserved"
                        ? "Déjà réservé"
                        : "Déjà financé"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Title & details */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-sage-50 text-sage-600"
                >
                  {gift.category.icon && (
                    <span className="mr-0.5">{gift.category.icon}</span>
                  )}
                  {gift.category.name}
                </Badge>
                {isUnavailable && (
                  <Badge
                    variant="secondary"
                    className={
                      gift.status === "funded"
                        ? "bg-sage-100 text-sage-600"
                        : "bg-rose-100 text-rose-500"
                    }
                  >
                    {gift.status === "reserved"
                      ? "Réservé"
                      : gift.status === "funded"
                        ? "Financé"
                        : "Acheté"}
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
                {gift.title}
              </h1>

              <p className="mt-2 text-2xl font-semibold text-sage-500">
                {formatCurrency(gift.price)}
              </p>

              {gift.description && (
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {gift.description}
                </p>
              )}
            </div>

            {/* Group gift progress */}
            {gift.isGroupGift && (
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-sage-500" />
                      <span className="text-sm font-medium text-foreground">
                        Cadeau participatif
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="mb-3 h-2 bg-sage-100" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(totalContributed)} collectés
                    </span>
                    <span className="font-medium text-foreground">
                      Objectif : {formatCurrency(targetAmount)}
                    </span>
                  </div>
                  {gift.contributions.length > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {gift.contributions.length}{" "}
                      {gift.contributions.length > 1
                        ? "personnes ont participé"
                        : "personne a participé"}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contributors */}
            {gift.contributions.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-medium text-foreground">
                  <Heart className="size-4 text-rose-400" />
                  Messages des participants
                </h2>
                <div className="space-y-3">
                  {gift.contributions.map((contrib) => (
                    <div
                      key={contrib.id}
                      className="rounded-xl border border-border/40 bg-warm-50/50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {contrib.guestName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(contrib.createdAt)}
                        </span>
                      </div>
                      {contrib.message && (
                        <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                          <MessageCircle className="mt-0.5 size-3 shrink-0" />
                          {contrib.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — Form + Bank details */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            {/* Contribution / Reserve form */}
            {canContribute && gift.status !== "funded" && (
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <ContributionForm
                    giftId={gift.id}
                    giftTitle={gift.title}
                    isGroupGift={gift.isGroupGift}
                    targetAmount={targetAmount}
                    totalContributed={totalContributed}
                  />
                </CardContent>
              </Card>
            )}

            {/* Unavailable message */}
            {!canContribute && (
              <Card className="border-border/60">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="mx-auto size-10 text-sage-500" />
                  <p className="mt-3 font-serif text-lg font-medium text-foreground">
                    Ce cadeau a déjà été{" "}
                    {gift.status === "reserved" ? "réservé" : "financé"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Merci de consulter les autres cadeaux de notre liste.
                  </p>
                  <Link
                    href="/"
                    className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Voir la liste complète
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Bank details */}
            {settings && (
              <>
                <Separator />
                <BankDetailsCard
                  bankAccountHolder={settings.bankAccountHolder}
                  bankIBAN={settings.bankIBAN}
                  bankBIC={settings.bankBIC}
                  bankName={settings.bankName}
                  reference={`MARIAGE-${gift.title.substring(0, 20).toUpperCase().replace(/\s+/g, "-")}`}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
