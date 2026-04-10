import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Clock,
  Users,
  Shirt,
  Snowflake,
  Moon,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TransportSelector } from "@/components/programme/transport-selector";
import { ContactCard } from "@/components/programme/contact-card";

export const metadata: Metadata = {
  title: "Le Programme — Marie & Antoine",
  description:
    "Toutes les informations pratiques pour les deux jours de festivités : vendredi mairie de Thônes, samedi restaurant La-Ô en montagne.",
};

function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      {label ? (
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      ) : (
        <Heart className="size-4 text-rose-400" />
      )}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function InfoRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-50 mt-0.5">
        {icon}
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground pt-1">
        {children}
      </div>
    </div>
  );
}

export default function ProgrammePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
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

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 space-y-16">

        {/* Page header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <Heart className="size-4 text-rose-400" />
            <span className="h-px w-8 bg-border" />
          </div>
          <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
            Le Programme
          </h1>
          <p className="mx-auto max-w-md text-base text-muted-foreground">
            Tout ce qu&apos;il faut savoir pour les deux jours de festivités.
          </p>
        </div>

        {/* Quick overview cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border-border/60 bg-gradient-to-br from-warm-50 to-rose-50">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Vendredi 10 avril
              </p>
              <p className="font-serif text-xl font-light text-foreground">
                Mariage civil
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                <span>17h15</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                <span>Mairie de Thônes</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-gradient-to-br from-sage-50 to-warm-50">
            <CardContent className="p-5 space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Samedi 11 avril
              </p>
              <p className="font-serif text-xl font-light text-foreground">
                Réception
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                <span>15h00</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                <span>Restaurant La-Ô, en montagne</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── VENDREDI ─────────────────────────────────── */}
        <section className="space-y-6">
          <SectionDivider label="Vendredi 10 avril — Mariage civil" />

          <Card className="overflow-hidden border-border/60">
            {/* Image */}
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src="/images/wed_friday.jpeg"
                alt="Fontaine et mairie de Thônes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <CardContent className="p-6 space-y-4">
              <InfoRow icon={<Clock className="size-4 text-sage-500" />}>
                Rendez-vous devant la <strong className="text-foreground">fontaine de la mairie de Thônes</strong> à{" "}
                <strong className="text-foreground">17h15</strong>.
              </InfoRow>

              <InfoRow icon={<MapPin className="size-4 text-sage-500" />}>
                <a
                  href="https://www.google.com/maps/place/Mairie/@45.8819554,6.3223456,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Mairie de Thônes — voir sur Google Maps
                </a>
              </InfoRow>

              <InfoRow icon={<span className="text-base">🥂</span>}>
                Ensuite, verres en terrasse au{" "}
                <strong className="text-foreground">Café du Marché</strong>, puis repas à la{" "}
                <strong className="text-foreground">Pizzeria Talinum</strong>.
              </InfoRow>

              <InfoRow icon={<Users className="size-4 text-sage-500" />}>
                <strong className="text-foreground">Enfants bienvenus !</strong>
              </InfoRow>

              <InfoRow icon={<Shirt className="size-4 text-sage-500" />}>
                Dress code : <strong className="text-foreground">décontracté</strong>.
              </InfoRow>
            </CardContent>
          </Card>
        </section>

        {/* ─── SAMEDI ───────────────────────────────────── */}
        <section className="space-y-8">
          <SectionDivider label="Samedi 11 avril — Réception" />

          {/* Intro */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            La réception commence à <strong className="text-foreground">15h</strong> au restaurant{" "}
            <strong className="text-foreground">La-Ô</strong>, situé en altitude au milieu des pistes
            sur un domaine dont les remontées mécaniques sont fermées. Des navettes sont prévues pour
            vous emmener jusqu&apos;au restaurant.
          </p>

          {/* Transport selector */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-light text-foreground">
              Comment j&apos;y vais ?
            </h2>
            <TransportSelector />
          </div>

          {/* Track map — always visible */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-light text-foreground">
              Sur place
            </h2>

            <Card className="overflow-hidden border-border/60">
              <div className="relative h-56 w-full sm:h-80">
                <Image
                  src="/images/wed_track.jpeg"
                  alt="Carte du parcours — piste bleue jusqu'au lac puis 400m à pied"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-base">🎿</span>
                  <span>Les navettes minibus empruntent la <strong className="text-foreground">piste bleue</strong> depuis le bas des pistes.</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-base">🏔️</span>
                  <span>L&apos;enneigement actuel ne permet pas de monter jusqu&apos;au restaurant : <strong className="text-foreground">arrêt au lac artificiel</strong>, puis <strong className="text-foreground">400m de marche dans la neige</strong>.</span>
                </div>
                <div className="rounded-lg bg-warm-100 px-4 py-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <Snowflake className="size-4 shrink-0 mt-0.5 text-sage-500" />
                  <span>
                    <strong className="text-foreground">Prévoir des chaussures adaptées à la neige</strong> — ça tombe bien, c&apos;est le thème du déguisement !
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assistance */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-light text-foreground">
              Assistance
            </h2>

            <Card className="border-border/60 bg-gradient-to-br from-sage-50 to-warm-50">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/80">
                    <span className="text-base">🤰</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      Femmes enceintes &amp; mobilité réduite
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Une motoneige pouvant transporter <strong className="text-foreground">9 personnes</strong> fera des allers-retours pour éviter les 400m de marche.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warm-100">
                    <span className="text-base">🚕</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Taxi</p>
                    <p className="text-sm text-muted-foreground">
                      Depuis la gare ou pour le dimanche.
                    </p>
                    <a
                      href="tel:+33620174098"
                      className="inline-flex items-center gap-1.5 mt-1 text-sm font-medium text-primary hover:underline"
                    >
                      <Phone className="size-3.5" />
                      Antony : 06 20 17 40 98
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Return */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-light text-foreground">
              Le retour
            </h2>

            <Card className="border-border/60">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warm-100">
                    <Moon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">22h – 3h du matin</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Les 3 chauffeurs minibus assurent des rotations continues pour redescendre les invités à Thônes (et ailleurs si besoin).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warm-100">
                    <Clock className="size-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Fréquence des départs</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Les chauffeurs attendent jusqu&apos;à <strong className="text-foreground">10 minutes</strong> après les premiers montants, ou partent dès <strong className="text-foreground">5 passagers</strong>.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-warm-50 px-4 py-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>
                    Il fera nuit — des points d&apos;éclairage seront mis en place pour vous guider jusqu&apos;au point de départ des navettes.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── CONTACTS ─────────────────────────────────── */}
        <section className="space-y-6">
          <SectionDivider label="Contacts utiles" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ContactCard
              name="Jean-Michel"
              role="Chauffeur — Autocar"
              phone="06 66 59 68 84"
              emoji="🚌"
            />
            <ContactCard
              name="Hécine"
              role="Chauffeur — Minibus 4×4"
              phone="07 81 21 49 69"
              emoji="🚙"
            />
            <ContactCard
              name="Soufiane"
              role="Chauffeur — Minibus 4×4"
              phone="07 51 65 87 44"
              emoji="🚙"
            />
            <ContactCard
              name="Nabil"
              role="Chauffeur — Minibus 4×4"
              phone="06 77 39 76 22"
              emoji="🚙"
            />
            <ContactCard
              name="Antony"
              role="Taxi"
              phone="06 20 17 40 98"
              emoji="🚕"
            />
          </div>
        </section>

        {/* Footer note */}
        <div className="rounded-2xl bg-sage-50 p-6 text-center space-y-2">
          <p className="font-serif text-lg text-sage-600">
            À très bientôt pour fêter ça ensemble !
          </p>
          <p className="text-sm text-sage-500">Marie &amp; Antoine</p>
        </div>
      </div>
    </main>
  );
}
