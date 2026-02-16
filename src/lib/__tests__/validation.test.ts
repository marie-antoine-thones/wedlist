import { describe, it, expect } from "vitest";
import {
  ContributionSchema,
  GiftItemSchema,
  LoginSchema,
} from "@/lib/validation";

describe("ContributionSchema", () => {
  const validContribution = {
    guestName: "Jean Dupont",
    amount: 50,
    paymentMethod: "wire_transfer" as const,
  };

  it("accepts a valid contribution with all fields", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      guestEmail: "jean@example.com",
      message: "Félicitations !",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid contribution with minimal fields", () => {
    const result = ContributionSchema.safeParse(validContribution);
    expect(result.success).toBe(true);
  });

  it("rejects missing guestName", () => {
    const result = ContributionSchema.safeParse({
      amount: 50,
      paymentMethod: "wire_transfer",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty guestName", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      guestName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects guestName longer than 100 characters", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      guestName: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("accepts guestName of exactly 100 characters", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      guestName: "a".repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string email (optional)", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      guestEmail: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      guestEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid email", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      guestEmail: "test@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero amount", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      amount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      amount: -10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects amount over 100000", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      amount: 100001,
    });
    expect(result.success).toBe(false);
  });

  it("accepts amount of exactly 100000", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      amount: 100000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects message longer than 500 characters", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      message: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts message of exactly 500 characters", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      message: "a".repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it("defaults paymentMethod to wire_transfer", () => {
    const result = ContributionSchema.safeParse({
      guestName: "Test",
      amount: 50,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paymentMethod).toBe("wire_transfer");
    }
  });

  it("accepts all valid payment methods", () => {
    for (const method of ["wire_transfer", "cash", "other"] as const) {
      const result = ContributionSchema.safeParse({
        ...validContribution,
        paymentMethod: method,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid payment method", () => {
    const result = ContributionSchema.safeParse({
      ...validContribution,
      paymentMethod: "bitcoin",
    });
    expect(result.success).toBe(false);
  });

  it("defaults message to empty string", () => {
    const result = ContributionSchema.safeParse(validContribution);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("");
    }
  });
});

describe("GiftItemSchema", () => {
  const validGift = {
    title: "Cafetière italienne",
    categoryId: 1,
    price: 49.99,
  };

  it("accepts a valid gift with minimal fields", () => {
    const result = GiftItemSchema.safeParse(validGift);
    expect(result.success).toBe(true);
  });

  it("accepts a valid gift with all fields", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      description: "Une belle cafetière",
      imageUrl: "https://example.com/image.jpg",
      isGroupGift: true,
      targetAmount: 200,
      sortOrder: 5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = GiftItemSchema.safeParse({
      categoryId: 1,
      price: 49.99,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 200 characters", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      title: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("accepts title of exactly 200 characters", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      title: "a".repeat(200),
    });
    expect(result.success).toBe(true);
  });

  it("rejects description longer than 2000 characters", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid imageUrl", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      imageUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty string imageUrl", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      imageUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-integer categoryId", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      categoryId: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative categoryId", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      categoryId: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero categoryId", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      categoryId: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero price", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      price: -10,
    });
    expect(result.success).toBe(false);
  });

  it("defaults isGroupGift to false", () => {
    const result = GiftItemSchema.safeParse(validGift);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isGroupGift).toBe(false);
    }
  });

  it("defaults sortOrder to 0", () => {
    const result = GiftItemSchema.safeParse(validGift);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(0);
    }
  });

  it("defaults description to empty string", () => {
    const result = GiftItemSchema.safeParse(validGift);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe("");
    }
  });

  it("accepts nullable targetAmount", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      targetAmount: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive targetAmount", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      targetAmount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer sortOrder", () => {
    const result = GiftItemSchema.safeParse({
      ...validGift,
      sortOrder: 1.5,
    });
    expect(result.success).toBe(false);
  });
});

describe("LoginSchema", () => {
  it("accepts a valid password", () => {
    const result = LoginSchema.safeParse({ password: "mysecretpassword" });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = LoginSchema.safeParse({ password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = LoginSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts a single character password", () => {
    const result = LoginSchema.safeParse({ password: "x" });
    expect(result.success).toBe(true);
  });

  it("accepts a very long password", () => {
    const result = LoginSchema.safeParse({ password: "a".repeat(1000) });
    expect(result.success).toBe(true);
  });
});
