import { z } from "zod";

export const ContributionSchema = z.object({
  guestName: z.string().min(1, "Name is required").max(100),
  guestEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  amount: z.number().positive("Amount must be positive").max(100000),
  message: z.string().max(500).default(""),
  paymentMethod: z
    .enum(["wire_transfer", "cash", "other"])
    .default("wire_transfer"),
});

export const GiftItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).default(""),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryId: z.number().int().positive(),
  price: z.number().positive("Price must be positive"),
  isGroupGift: z.boolean().default(false),
  targetAmount: z.number().positive().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const SettingsSchema = z.object({
  coupleName1: z.string().min(1).max(100),
  coupleName2: z.string().min(1).max(100),
  weddingDate: z.string().datetime(),
  personalMessage: z.string().max(2000).default(""),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  bankAccountHolder: z.string().min(1).max(200),
  bankIBAN: z.string().min(5).max(50),
  bankBIC: z.string().min(4).max(20),
  bankName: z.string().min(1).max(200),
});

export const CategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  icon: z.string().max(10).optional(),
  sortOrder: z.number().int().default(0),
});

export const LoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type ContributionInput = z.infer<typeof ContributionSchema>;
export type GiftItemInput = z.infer<typeof GiftItemSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
