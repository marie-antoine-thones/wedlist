"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { PlusIcon, PencilIcon, TrashIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

interface GiftItem {
  id: number;
  title: string;
  price: number;
  status: string;
  isGroupGift: boolean;
  targetAmount: number | null;
  sortOrder: number;
  category: { id: number; name: string };
  contributions: { id: number; amount: number; isConfirmed: boolean }[];
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  available: { label: "Available", variant: "outline" },
  reserved: { label: "Reserved", variant: "secondary" },
  partially_funded: { label: "Partial", variant: "secondary" },
  funded: { label: "Funded", variant: "default" },
  purchased: { label: "Purchased", variant: "default" },
};

export default function GiftsPage() {
  const router = useRouter();
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadGifts() {
    try {
      const res = await fetch("/api/admin/gifts", { credentials: "include" });
      const data = await res.json();
      if (data.success) setGifts(data.data);
    } catch {
      toast.error("Failed to load gifts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGifts();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gifts/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setGifts((prev) => prev.filter((g) => g.id !== deleteId));
        toast.success("Gift deleted");
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete gift");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gifts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your wedding gift list.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/gifts/new">
            <PlusIcon />
            Add Gift
          </Link>
        </Button>
      </div>

      {gifts.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            No gifts yet. Add your first gift to get started.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Contributions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gifts.map((gift) => {
                const sc = statusConfig[gift.status] || {
                  label: gift.status,
                  variant: "outline" as const,
                };
                return (
                  <TableRow key={gift.id}>
                    <TableCell className="font-medium">
                      {gift.title}
                      {gift.isGroupGift && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (group)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{gift.category.name}</TableCell>
                    <TableCell>{formatCurrency(gift.price)}</TableCell>
                    <TableCell>
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {gift.contributions.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            router.push(`/admin/gifts/${gift.id}`)
                          }
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteId(gift.id)}
                        >
                          <TrashIcon className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gift</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this gift? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2Icon className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
