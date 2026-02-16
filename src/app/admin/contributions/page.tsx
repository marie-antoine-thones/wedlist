"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";
import { Loader2Icon, CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

interface Contribution {
  id: number;
  guestName: string;
  guestEmail: string | null;
  amount: number;
  message: string;
  paymentMethod: string;
  isConfirmed: boolean;
  createdAt: string;
  giftItem: { id: number; title: string };
}

type FilterStatus = "all" | "pending" | "confirmed";

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/contributions", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setContributions(data.data);
      } catch {
        toast.error("Failed to load contributions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function toggleConfirm(id: number, currentStatus: boolean) {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/contributions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isConfirmed: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setContributions((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, isConfirmed: !currentStatus } : c
          )
        );
        toast.success(
          !currentStatus ? "Contribution confirmed" : "Contribution unconfirmed"
        );
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update contribution");
    } finally {
      setTogglingId(null);
    }
  }

  const filtered = contributions.filter((c) => {
    if (filter === "pending") return !c.isConfirmed;
    if (filter === "confirmed") return c.isConfirmed;
    return true;
  });

  const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
  const confirmedAmount = contributions
    .filter((c) => c.isConfirmed)
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = contributions
    .filter((c) => !c.isConfirmed)
    .reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Contributions
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage guest contributions and payments.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(confirmedAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(pendingAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filter:
        </span>
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as FilterStatus)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filtered.length} contribution{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            No contributions found.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Gift</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.guestName}</TableCell>
                  <TableCell className="max-w-[160px] truncate">
                    {c.giftItem.title}
                  </TableCell>
                  <TableCell>{formatCurrency(c.amount)}</TableCell>
                  <TableCell className="capitalize">
                    {c.paymentMethod.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={c.isConfirmed ? "default" : "secondary"}
                    >
                      {c.isConfirmed ? "Confirmed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={c.isConfirmed ? "outline" : "default"}
                      size="sm"
                      disabled={togglingId === c.id}
                      onClick={() => toggleConfirm(c.id, c.isConfirmed)}
                    >
                      {togglingId === c.id ? (
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                      ) : c.isConfirmed ? (
                        <XIcon className="h-4 w-4" />
                      ) : (
                        <CheckIcon className="h-4 w-4" />
                      )}
                      {c.isConfirmed ? "Unconfirm" : "Confirm"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
