export interface PublicSettings {
  coupleName1: string;
  coupleName2: string;
  weddingDate: string;
  personalMessage: string;
  heroImageUrl: string | null;
  bankAccountHolder: string;
  bankIBAN: string;
  bankBIC: string;
  bankName: string;
}

export interface GiftWithContributions {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  categoryId: number;
  category: { id: number; name: string; slug: string; icon: string | null };
  price: number;
  isGroupGift: boolean;
  targetAmount: number | null;
  status: string;
  sortOrder: number;
  contributions: ContributionSummary[];
  totalContributed: number;
  contributionCount: number;
  createdAt: string;
}

export interface ContributionSummary {
  id: number;
  guestName: string;
  amount: number;
  message: string;
  isConfirmed: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalGifts: number;
  reservedGifts: number;
  fundedGifts: number;
  totalContributions: number;
  confirmedAmount: number;
  pendingAmount: number;
}

export type GiftStatus = "available" | "reserved" | "partially_funded" | "funded" | "purchased";
