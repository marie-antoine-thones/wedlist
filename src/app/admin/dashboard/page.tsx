"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import {
  GiftIcon,
  BookmarkCheckIcon,
  CircleCheckIcon,
  HandCoinsIcon,
  BadgeCheckIcon,
  ClockIcon,
  Loader2Icon,
} from "lucide-react";
import type { DashboardStats } from "@/types";

interface ContributionItem {
  id: number;
  guestName: string;
  amount: number;
  isConfirmed: boolean;
  createdAt: string;
  giftItem: { id: number; title: string };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, contribRes] = await Promise.all([
          fetch("/api/admin/dashboard", { credentials: "include" }),
          fetch("/api/admin/contributions", { credentials: "include" }),
        ]);

        const statsData = await statsRes.json();
        const contribData = await contribRes.json();

        if (statsData.success) setStats(statsData.data);
        if (contribData.success)
          setContributions(contribData.data.slice(0, 5));
      } catch {
        // silently fail — user will see empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = stats
    ? [
        {
          label: "Total Gifts",
          value: stats.totalGifts,
          icon: GiftIcon,
          format: false,
        },
        {
          label: "Reserved",
          value: stats.reservedGifts,
          icon: BookmarkCheckIcon,
          format: false,
        },
        {
          label: "Funded",
          value: stats.fundedGifts,
          icon: CircleCheckIcon,
          format: false,
        },
        {
          label: "Total Contributions",
          value: stats.totalContributions,
          icon: HandCoinsIcon,
          format: false,
        },
        {
          label: "Confirmed Amount",
          value: stats.confirmedAmount,
          icon: BadgeCheckIcon,
          format: true,
        },
        {
          label: "Pending Amount",
          value: stats.pendingAmount,
          icon: ClockIcon,
          format: true,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your wedding gift list.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.format
                  ? formatCurrency(card.value)
                  : card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent contributions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          {contributions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No contributions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {contributions.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4 rounded-md border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {c.guestName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.giftItem.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={c.isConfirmed ? "default" : "secondary"}
                    >
                      {c.isConfirmed ? "Confirmed" : "Pending"}
                    </Badge>
                    <span className="whitespace-nowrap text-sm font-medium">
                      {formatCurrency(c.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
