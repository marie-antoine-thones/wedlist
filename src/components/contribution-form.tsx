"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { Loader2, Heart, Send } from "lucide-react";

interface ContributionFormProps {
  giftId: number;
  giftTitle: string;
  isGroupGift: boolean;
  targetAmount: number;
  totalContributed: number;
}

export function ContributionForm({
  giftId,
  giftTitle,
  isGroupGift,
  targetAmount,
  totalContributed,
}: ContributionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const remaining = targetAmount - totalContributed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!guestName.trim()) {
      toast.error("Veuillez entrer votre nom.");
      return;
    }

    if (isGroupGift) {
      const numAmount = parseFloat(amount);
      if (!amount || isNaN(numAmount) || numAmount <= 0) {
        toast.error("Veuillez entrer un montant valide.");
        return;
      }
      if (numAmount > remaining) {
        toast.error(
          `Le montant dépasse le restant (${formatCurrency(remaining)}).`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const body: Record<string, unknown> = {
        guestName: guestName.trim(),
        message: message.trim(),
        paymentMethod: "wire_transfer",
      };

      if (guestEmail.trim()) {
        body.guestEmail = guestEmail.trim();
      }

      if (isGroupGift) {
        body.amount = parseFloat(amount);
      } else {
        body.amount = targetAmount;
      }

      const res = await fetch(`/api/gifts/${giftId}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      toast.success(
        isGroupGift
          ? "Votre participation a été enregistrée !"
          : "Le cadeau a été réservé !"
      );

      router.push(`/thank-you?gift=${encodeURIComponent(giftTitle)}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick amount suggestions for group gifts
  const suggestedAmounts = isGroupGift
    ? [20, 50, 100].filter((a) => a <= remaining)
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-serif text-xl font-medium text-foreground">
        {isGroupGift ? "Participer à ce cadeau" : "Réserver ce cadeau"}
      </h3>

      {/* Amount for group gifts */}
      {isGroupGift && (
        <div className="space-y-2">
          <Label htmlFor="amount">
            Montant de votre participation
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (restant : {formatCurrency(remaining)})
            </span>
          </Label>
          {suggestedAmounts.length > 0 && (
            <div className="flex gap-2">
              {suggestedAmounts.map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => setAmount(suggested.toString())}
                  className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary data-[active=true]:border-primary data-[active=true]:bg-primary/5 data-[active=true]:text-primary"
                  data-active={amount === suggested.toString()}
                >
                  {formatCurrency(suggested)}
                </button>
              ))}
            </div>
          )}
          <div className="relative">
            <Input
              id="amount"
              type="number"
              min="1"
              max={remaining}
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-8"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              €
            </span>
          </div>
        </div>
      )}

      {/* Guest name */}
      <div className="space-y-2">
        <Label htmlFor="guestName">Votre nom</Label>
        <Input
          id="guestName"
          placeholder="Prénom et nom"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
      </div>

      {/* Guest email */}
      <div className="space-y-2">
        <Label htmlFor="guestEmail">
          Email
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optionnel)
          </span>
        </Label>
        <Input
          id="guestEmail"
          type="email"
          placeholder="votre@email.com"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Un petit mot
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optionnel)
          </span>
        </Label>
        <Textarea
          id="message"
          placeholder="Félicitations aux mariés !"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Envoi en cours…
          </>
        ) : isGroupGift ? (
          <>
            <Send className="size-4" />
            Participer
            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0
              ? ` — ${formatCurrency(parseFloat(amount))}`
              : ""}
          </>
        ) : (
          <>
            <Heart className="size-4" />
            Réserver ce cadeau
          </>
        )}
      </Button>
    </form>
  );
}
