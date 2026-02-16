import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, CreditCard, PartyPopper } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merci ! — Liste de Mariage",
};

interface ThankYouPageProps {
  searchParams: Promise<{ gift?: string }>;
}

export default async function ThankYouPage({
  searchParams,
}: ThankYouPageProps) {
  const { gift } = await searchParams;
  const settings = await prisma.settings.findFirst();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <div className="text-center">
          {/* Decorative icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-sage-50">
            <PartyPopper className="size-10 text-sage-500" />
          </div>

          {/* Thank you message */}
          <h1 className="font-serif text-4xl font-light text-foreground">
            Merci beaucoup !
          </h1>

          {gift && (
            <p className="mt-3 text-lg text-muted-foreground">
              Votre participation pour{" "}
              <span className="font-medium text-foreground">{gift}</span> a
              bien été enregistrée.
            </p>
          )}

          {!gift && (
            <p className="mt-3 text-lg text-muted-foreground">
              Votre participation a bien été enregistrée.
            </p>
          )}
        </div>

        {/* Reminder card */}
        <Card className="mt-8 border-border/60">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-50">
                <CreditCard className="size-4 text-rose-400" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-base font-medium text-foreground">
                  N&apos;oubliez pas le virement !
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pour finaliser votre cadeau, veuillez effectuer un virement
                  bancaire aux coordonnées indiquées. Le virement confirme
                  votre participation.
                </p>
                <Link
                  href="/bank-details"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Voir les coordonnées bancaires
                  <CreditCard className="size-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal note */}
        {settings && (
          <div className="mt-6 rounded-2xl bg-warm-50 p-6 text-center">
            <Heart className="mx-auto mb-2 size-5 text-rose-400" />
            <p className="font-serif text-base italic text-foreground/80">
              Votre générosité nous touche énormément.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Avec tout notre amour,
              <br />
              <span className="font-serif font-medium text-foreground">
                {settings.coupleName1} & {settings.coupleName2}
              </span>
            </p>
          </div>
        )}

        {/* Back to list */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            asChild
            className="rounded-full"
          >
            <Link href="/">
              <ArrowLeft className="size-4" />
              Retour à la liste de mariage
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
