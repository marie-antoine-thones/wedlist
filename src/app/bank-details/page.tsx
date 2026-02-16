import { prisma } from "@/lib/db";
import Link from "next/link";
import { BankDetailsCard } from "@/components/bank-details-card";
import { ArrowLeft, Heart, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coordonnées bancaires — Liste de Mariage",
};

export default async function BankDetailsPage() {
  const settings = await prisma.settings.findFirst();

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Le site n&apos;est pas encore configuré.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <Heart className="size-4 text-rose-400" />
            <span className="h-px w-8 bg-border" />
          </div>
          <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
            Coordonnées Bancaires
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
            Pour effectuer votre virement, veuillez utiliser les coordonnées
            ci-dessous.
          </p>
        </div>

        <div className="space-y-6">
          {/* Bank details card */}
          <BankDetailsCard
            bankAccountHolder={settings.bankAccountHolder}
            bankIBAN={settings.bankIBAN}
            bankBIC={settings.bankBIC}
            bankName={settings.bankName}
            reference="MARIAGE-[VOTRE NOM]"
          />

          {/* Instructions */}
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
                  <Info className="size-4 text-sage-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    Comment effectuer le virement ?
                  </h3>
                  <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <li>
                      Connectez-vous à votre espace bancaire en ligne ou votre
                      application mobile.
                    </li>
                    <li>
                      Ajoutez un nouveau bénéficiaire avec l&apos;IBAN et le BIC
                      indiqués ci-dessus.
                    </li>
                    <li>
                      Effectuez un virement du montant souhaité.
                    </li>
                    <li>
                      Indiquez la référence{" "}
                      <strong className="text-foreground">
                        MARIAGE-[VOTRE NOM]
                      </strong>{" "}
                      dans le libellé du virement pour que nous puissions
                      identifier votre cadeau.
                    </li>
                  </ol>
                  <p className="text-sm text-muted-foreground">
                    Les virements SEPA sont généralement traités en{" "}
                    <strong className="text-foreground">1 à 2 jours ouvrés</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank you note */}
          <div className="rounded-2xl bg-sage-50 p-6 text-center">
            <p className="font-serif text-lg text-sage-600">
              Merci du fond du cœur pour votre générosité !
            </p>
            <p className="mt-2 text-sm text-sage-500">
              {settings.coupleName1} & {settings.coupleName2}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
