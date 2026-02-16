"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [coupleName1, setCoupleName1] = useState("");
  const [coupleName2, setCoupleName2] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [bankIBAN, setBankIBAN] = useState("");
  const [bankBIC, setBankBIC] = useState("");
  const [bankName, setBankName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          const s = data.data;
          setCoupleName1(s.coupleName1 || "");
          setCoupleName2(s.coupleName2 || "");
          // Convert ISO datetime to date input format
          setWeddingDate(
            s.weddingDate ? s.weddingDate.split("T")[0] : ""
          );
          setPersonalMessage(s.personalMessage || "");
          setHeroImageUrl(s.heroImageUrl || "");
          setBankAccountHolder(s.bankAccountHolder || "");
          setBankIBAN(s.bankIBAN || "");
          setBankBIC(s.bankBIC || "");
          setBankName(s.bankName || "");
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const body = {
        coupleName1: coupleName1.trim(),
        coupleName2: coupleName2.trim(),
        weddingDate: new Date(weddingDate).toISOString(),
        personalMessage: personalMessage.trim(),
        heroImageUrl: heroImageUrl.trim() || "",
        bankAccountHolder: bankAccountHolder.trim(),
        bankIBAN: bankIBAN.trim(),
        bankBIC: bankBIC.trim(),
        bankName: bankName.trim(),
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to save settings");
        return;
      }

      toast.success("Settings saved");
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your wedding gift list.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Couple info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Couple Information</CardTitle>
            <CardDescription>
              Names and wedding date displayed on the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coupleName1">Name 1 *</Label>
                <Input
                  id="coupleName1"
                  value={coupleName1}
                  onChange={(e) => setCoupleName1(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupleName2">Name 2 *</Label>
                <Input
                  id="coupleName2"
                  value={coupleName2}
                  onChange={(e) => setCoupleName2(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weddingDate">Wedding Date *</Label>
              <Input
                id="weddingDate"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Personalization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personalization</CardTitle>
            <CardDescription>
              Custom message and hero image for guests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="personalMessage">Personal Message</Label>
              <Textarea
                id="personalMessage"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="A message to your guests..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroImageUrl">Hero Image URL</Label>
              <Input
                id="heroImageUrl"
                type="url"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Bank details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bank Details</CardTitle>
            <CardDescription>
              Shown to guests who want to contribute via wire transfer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankAccountHolder">Account Holder *</Label>
              <Input
                id="bankAccountHolder"
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankIBAN">IBAN *</Label>
                <Input
                  id="bankIBAN"
                  value={bankIBAN}
                  onChange={(e) => setBankIBAN(e.target.value)}
                  placeholder="FR76 ..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankBIC">BIC *</Label>
                <Input
                  id="bankBIC"
                  value={bankBIC}
                  onChange={(e) => setBankBIC(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2Icon className="animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
