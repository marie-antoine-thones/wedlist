"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "sonner";
import { Copy, Check, Building2 } from "lucide-react";

interface BankDetailsCardProps {
  bankAccountHolder: string;
  bankIBAN: string;
  bankBIC: string;
  bankName: string;
  reference?: string;
}

export function BankDetailsCard({
  bankAccountHolder,
  bankIBAN,
  bankBIC,
  bankName,
  reference,
}: BankDetailsCardProps) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopyIBAN = () => {
    copyToClipboard(bankIBAN);
    toast.success("IBAN copié dans le presse-papier !");
  };

  // Format IBAN with spaces for readability
  const formattedIBAN = bankIBAN.replace(/(.{4})/g, "$1 ").trim();

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-sage-50">
            <Building2 className="size-5 text-sage-500" />
          </div>
          <CardTitle className="font-serif text-lg font-medium">
            Coordonnées bancaires
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bank name */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Banque
          </p>
          <p className="text-sm font-medium text-foreground">{bankName}</p>
        </div>

        {/* Account holder */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Titulaire du compte
          </p>
          <p className="text-sm font-medium text-foreground">
            {bankAccountHolder}
          </p>
        </div>

        <Separator className="my-2" />

        {/* IBAN */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            IBAN
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-warm-50 px-3 py-2 font-mono text-sm tracking-wider text-foreground">
              {formattedIBAN}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyIBAN}
              className="shrink-0"
              aria-label="Copier l'IBAN"
            >
              {copied ? (
                <Check className="size-4 text-sage-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {/* BIC */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            BIC / SWIFT
          </p>
          <code className="inline-block rounded-lg bg-warm-50 px-3 py-1.5 font-mono text-sm tracking-wider text-foreground">
            {bankBIC}
          </code>
        </div>

        {/* Reference */}
        {reference && (
          <>
            <Separator className="my-2" />
            <div className="rounded-lg bg-sage-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-sage-600">
                Référence suggérée pour le virement
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-sage-600">
                {reference}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
