import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  getContributionProgress,
  getTotalContributed,
} from "@/lib/format";

describe("formatCurrency", () => {
  it("formats a standard amount in EUR", () => {
    const result = formatCurrency(42.5);
    // fr-FR EUR: "42,50 €" (with possible non-breaking space)
    expect(result).toMatch(/42,50/);
    expect(result).toMatch(/€/);
  });

  it("formats zero", () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/0,00/);
    expect(result).toMatch(/€/);
  });

  it("formats negative amounts", () => {
    const result = formatCurrency(-15.99);
    expect(result).toMatch(/15,99/);
    expect(result).toMatch(/€/);
  });

  it("formats very large numbers", () => {
    const result = formatCurrency(1_000_000);
    expect(result).toMatch(/1[\s\u00a0\u202f.]000[\s\u00a0\u202f.]000/);
    expect(result).toMatch(/€/);
  });

  it("formats integers without decimals as .00", () => {
    const result = formatCurrency(100);
    expect(result).toMatch(/100,00/);
  });

  it("rounds to two decimal places", () => {
    const result = formatCurrency(9.999);
    expect(result).toMatch(/10,00/);
  });
});

describe("formatDate", () => {
  it("formats a Date object in French", () => {
    const result = formatDate(new Date(2025, 5, 15)); // June 15, 2025
    expect(result).toBe("15 juin 2025");
  });

  it("formats an ISO date string", () => {
    const result = formatDate("2025-12-25T00:00:00.000Z");
    expect(result).toMatch(/25 décembre 2025/);
  });

  it("formats a simple date string", () => {
    const result = formatDate("2024-01-01");
    expect(result).toMatch(/1 janvier 2024|janvier 2024/);
  });

  it("handles Date object for New Year", () => {
    const result = formatDate(new Date(2026, 0, 1)); // Jan 1, 2026
    expect(result).toBe("1 janvier 2026");
  });
});

describe("getContributionProgress", () => {
  it("returns 0 when no contributions", () => {
    const result = getContributionProgress([], 100);
    expect(result).toBe(0);
  });

  it("calculates correct percentage", () => {
    const contributions = [
      { amount: 25, isConfirmed: true },
      { amount: 25, isConfirmed: false },
    ];
    const result = getContributionProgress(contributions, 100);
    expect(result).toBe(50);
  });

  it("caps at 100% when over-funded", () => {
    const contributions = [
      { amount: 80, isConfirmed: true },
      { amount: 80, isConfirmed: true },
    ];
    const result = getContributionProgress(contributions, 100);
    expect(result).toBe(100);
  });

  it("returns 100 when exactly funded", () => {
    const contributions = [{ amount: 100, isConfirmed: true }];
    const result = getContributionProgress(contributions, 100);
    expect(result).toBe(100);
  });

  it("includes unconfirmed contributions in total", () => {
    const contributions = [
      { amount: 30, isConfirmed: false },
      { amount: 20, isConfirmed: true },
    ];
    const result = getContributionProgress(contributions, 100);
    expect(result).toBe(50);
  });

  it("handles single small contribution", () => {
    const contributions = [{ amount: 1, isConfirmed: true }];
    const result = getContributionProgress(contributions, 1000);
    expect(result).toBeCloseTo(0.1);
  });

  it("handles very large target amount", () => {
    const contributions = [{ amount: 500, isConfirmed: true }];
    const result = getContributionProgress(contributions, 100000);
    expect(result).toBeCloseTo(0.5);
  });
});

describe("getTotalContributed", () => {
  it("returns 0 for empty array", () => {
    expect(getTotalContributed([])).toBe(0);
  });

  it("sums a single contribution", () => {
    expect(getTotalContributed([{ amount: 42 }])).toBe(42);
  });

  it("sums multiple contributions", () => {
    const contributions = [
      { amount: 10 },
      { amount: 20.5 },
      { amount: 30 },
    ];
    expect(getTotalContributed(contributions)).toBeCloseTo(60.5);
  });

  it("handles contributions with zero amounts", () => {
    const contributions = [
      { amount: 0 },
      { amount: 50 },
      { amount: 0 },
    ];
    expect(getTotalContributed(contributions)).toBe(50);
  });

  it("handles very large amounts", () => {
    const contributions = [
      { amount: 99999 },
      { amount: 1 },
    ];
    expect(getTotalContributed(contributions)).toBe(100000);
  });
});
