import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

interface ContactCardProps {
  name: string;
  role: string;
  phone: string;
  emoji?: string;
}

export function ContactCard({ name, role, phone, emoji }: ContactCardProps) {
  const tel = phone.replace(/\s/g, "");

  return (
    <Card className="border-border/60 transition-shadow hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              {emoji && <span className="text-base">{emoji}</span>}
              <p className="font-medium text-foreground">{name}</p>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{role}</p>
          </div>
          <a
            href={`tel:${tel}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Phone className="size-3.5" />
            {phone}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
