"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2Icon, ArrowLeftIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface GiftData {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  categoryId: number;
  price: number;
  isGroupGift: boolean;
  targetAmount: number | null;
  status: string;
  sortOrder: number;
}

export default function EditGiftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [isGroupGift, setIsGroupGift] = useState(false);
  const [targetAmount, setTargetAmount] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  useEffect(() => {
    async function load() {
      try {
        const [giftsRes, catRes] = await Promise.all([
          fetch("/api/admin/gifts", { credentials: "include" }),
          fetch("/api/categories", { credentials: "include" }),
        ]);

        const giftsData = await giftsRes.json();
        const catData = await catRes.json();

        if (catData.success) setCategories(catData.data);

        if (giftsData.success) {
          const gift = giftsData.data.find(
            (g: GiftData) => g.id === Number(id)
          );
          if (gift) {
            setTitle(gift.title);
            setDescription(gift.description || "");
            setImageUrl(gift.imageUrl || "");
            setCategoryId(String(gift.categoryId));
            setPrice(String(gift.price));
            setIsGroupGift(gift.isGroupGift);
            setTargetAmount(gift.targetAmount ? String(gift.targetAmount) : "");
            setSortOrder(String(gift.sortOrder));
          } else {
            toast.error("Gift not found");
            router.push("/admin/gifts");
          }
        }
      } catch {
        toast.error("Failed to load gift");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Price must be positive");
      return;
    }

    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        categoryId: Number(categoryId),
        price: Number(price),
        isGroupGift,
        targetAmount: isGroupGift && targetAmount ? Number(targetAmount) : null,
        sortOrder: Number(sortOrder) || 0,
      };

      const res = await fetch(`/api/admin/gifts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to update gift");
        return;
      }

      toast.success("Gift updated");
      router.push("/admin/gifts");
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gifts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Gift deleted");
        router.push("/admin/gifts");
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete gift");
    } finally {
      setDeleting(false);
      setShowDelete(false);
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/gifts">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Gift
            </h1>
            <p className="text-sm text-muted-foreground">
              Update gift details.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={() => setShowDelete(true)}
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Coffee Machine"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description of the gift..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (EUR) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  id="isGroupGift"
                  type="checkbox"
                  checked={isGroupGift}
                  onChange={(e) => setIsGroupGift(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="isGroupGift" className="cursor-pointer">
                  Group gift (multiple people can contribute)
                </Label>
              </div>

              {isGroupGift && (
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount (EUR)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="Target amount for group contributions"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2Icon className="animate-spin" />}
                Save Changes
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/gifts">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gift</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this gift? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
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
