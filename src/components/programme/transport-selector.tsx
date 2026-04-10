"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Bus, Car, AlertTriangle } from "lucide-react";

type TransportType = "hermitage" | "midi" | "voiture" | "tardif" | null;

const options: { id: TransportType; label: string; emoji: string }[] = [
  { id: "hermitage", label: "Bus — Hôtel l'Hermitage", emoji: "🚌" },
  { id: "midi", label: "Bus — Hôtel du Midi", emoji: "🚌" },
  { id: "voiture", label: "En voiture", emoji: "🚗" },
  { id: "tardif", label: "Arrivée tardive", emoji: "⏰" },
];

function TransportHermitage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <Clock className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Premier départ</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            L'autocar arrive à l'Hôtel l'Hermitage à <strong className="text-foreground">14h20</strong> et repart à <strong className="text-foreground">14h30</strong>.
          </p>
          <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-500">
            ⚠️ <strong>Le bus doit être quasi complet avant de partir.</strong> Un témoin sera désigné pour s'en assurer !
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <Bus className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Le trajet</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            L'autocar vous dépose au début de la piste d'accès au restaurant, où des minibus 4×4 pneus neige vous emmènent jusqu'au lac.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <MapPin className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Point de départ</p>
          <a
            href="https://maps.app.goo.gl/u2NAZd5mHtxKveaG9"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <MapPin className="size-3.5" />
            Hôtel l'Hermitage — voir sur Maps
          </a>
          <p className="mt-1 text-xs text-muted-foreground">
            Chauffeur : Jean-Michel — +33 6 66 59 68 84
          </p>
        </div>
      </div>
    </div>
  );
}

function TransportMidi() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <Clock className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Deuxième rotation — ~15h15</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Après avoir déposé les premiers invités, l'autocar revient à l'Hermitage pour les retardataires, <strong className="text-foreground">puis s'arrête à l'Hôtel du Midi</strong> avant de rejoindre le début de la piste.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <MapPin className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Point de départ</p>
          <a
            href="https://maps.app.goo.gl/YhWVwugtZ7Ltt1Ge8"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <MapPin className="size-3.5" />
            Hôtel du Midi — voir sur Maps
          </a>
          <p className="mt-1 text-xs text-muted-foreground">
            Chauffeur : Jean-Michel — +33 6 66 59 68 84
          </p>
        </div>
      </div>
    </div>
  );
}

function TransportVoiture() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <MapPin className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Adresse GPS</p>
          <p className="mt-1 text-sm text-muted-foreground">1800 route du col de Merdassier</p>
          <a
            href="https://maps.app.goo.gl/qGXz5bBNXvZtTmXA8"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <MapPin className="size-3.5" />
            Voir sur Google Maps
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <Car className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Garez-vous en bas des pistes</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Profitez ensuite des minibus 4×4 pneus neige pour monter jusqu'au lac (aller et retour inclus).
            Les minibus seront positionnés dès <strong className="text-foreground">14h30</strong> et assurent des rotations continues.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="size-4 text-rose-400" />
        </div>
        <div>
          <p className="font-medium text-foreground">Si vous ratez le dernier minibus</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Vous pouvez monter en voiture jusqu'au lac et vous garer dans la neige, mais c'est plus risqué. Laissez la place aux navettes pour faire demi-tour. Depuis le lac, 400m de marche.
          </p>
        </div>
      </div>
    </div>
  );
}

function TransportTardif() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <MapPin className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Montez jusqu'au lac en voiture</p>
          <p className="mt-1 text-sm text-muted-foreground">1800 route du col de Merdassier</p>
          <a
            href="https://maps.app.goo.gl/qGXz5bBNXvZtTmXA8"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <MapPin className="size-3.5" />
            Voir sur Google Maps
          </a>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Garez-vous au lac artificiel, puis <strong className="text-foreground">400m de marche dans la neige</strong> jusqu'au restaurant.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50">
          <Clock className="size-4 text-sage-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">Retour assuré</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Les navettes minibus assurent le retour de <strong className="text-foreground">22h à 3h du matin</strong> en rotation continue jusqu'aux voitures.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-sage-50 p-3 text-sm text-sage-600">
        🤰 Besoin d'aide pour la montée ? Une motoneige (9 places) fera des allers-retours pour éviter les 400m de marche.
      </div>
      <div className="rounded-lg bg-warm-100 p-3 text-sm text-muted-foreground">
        🚕 Taxi depuis la gare : <strong className="text-foreground">Antony — 06 20 17 40 98</strong>
      </div>
    </div>
  );
}

const contentMap: Record<NonNullable<TransportType>, React.ReactNode> = {
  hermitage: <TransportHermitage />,
  midi: <TransportMidi />,
  voiture: <TransportVoiture />,
  tardif: <TransportTardif />,
};

export function TransportSelector() {
  const [active, setActive] = useState<TransportType>(null);

  return (
    <div className="space-y-5">
      {/* Pill buttons */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActive(active === opt.id ? null : opt.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              active === opt.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <span className="mr-1.5">{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {active ? (
        <Card className="border-border/60">
          <CardContent className="pt-5 pb-5">
            {contentMap[active]}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Sélectionnez votre mode de transport pour voir les instructions qui vous concernent.
        </p>
      )}
    </div>
  );
}
