import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GiftCard } from "@/components/gift-card";
import type { GiftWithContributions } from "@/types";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock formatCurrency to return predictable output
vi.mock("@/lib/format", () => ({
  formatCurrency: (amount: number) => `${amount.toFixed(2)} €`,
}));

function createGift(
  overrides: Partial<GiftWithContributions> = {}
): GiftWithContributions {
  return {
    id: 1,
    title: "Cafetière italienne",
    description: "Une belle cafetière Bialetti",
    imageUrl: "https://example.com/cafetiere.jpg",
    categoryId: 1,
    category: { id: 1, name: "Cuisine", slug: "cuisine", icon: "🍳" },
    price: 49.99,
    isGroupGift: false,
    targetAmount: null,
    status: "available",
    sortOrder: 0,
    contributions: [],
    totalContributed: 0,
    contributionCount: 0,
    createdAt: "2025-06-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("GiftCard", () => {
  it("renders the gift title", () => {
    render(<GiftCard gift={createGift()} />);
    expect(screen.getByText("Cafetière italienne")).toBeInTheDocument();
  });

  it("renders the gift price", () => {
    render(<GiftCard gift={createGift()} />);
    expect(screen.getByText("49.99 €")).toBeInTheDocument();
  });

  it("renders the category name with icon", () => {
    render(<GiftCard gift={createGift()} />);
    expect(screen.getByText("Cuisine")).toBeInTheDocument();
    expect(screen.getByText("🍳")).toBeInTheDocument();
  });

  it("links to the correct detail page", () => {
    render(<GiftCard gift={createGift({ id: 42 })} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/gifts/42");
  });

  it("renders the image when imageUrl is provided", () => {
    render(<GiftCard gift={createGift()} />);
    const img = screen.getByAltText("Cafetière italienne");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/cafetiere.jpg");
  });

  it("does not render an img element when imageUrl is null", () => {
    render(<GiftCard gift={createGift({ imageUrl: null })} />);
    expect(
      screen.queryByAltText("Cafetière italienne")
    ).not.toBeInTheDocument();
  });

  it("shows 'Disponible' indicator for available non-group gifts", () => {
    render(<GiftCard gift={createGift({ status: "available" })} />);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it("shows 'Réservé' badge for reserved gifts", () => {
    render(<GiftCard gift={createGift({ status: "reserved" })} />);
    expect(screen.getByText("Réservé")).toBeInTheDocument();
  });

  it("shows 'Financé' badge for funded gifts", () => {
    render(<GiftCard gift={createGift({ status: "funded" })} />);
    expect(screen.getByText("Financé")).toBeInTheDocument();
  });

  it("shows 'Acheté' badge for purchased gifts", () => {
    render(<GiftCard gift={createGift({ status: "purchased" })} />);
    expect(screen.getByText("Acheté")).toBeInTheDocument();
  });

  it("shows 'En cours' badge for partially funded gifts", () => {
    render(
      <GiftCard gift={createGift({ status: "partially_funded" })} />
    );
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });

  it("does not show a status badge for available gifts", () => {
    render(<GiftCard gift={createGift({ status: "available" })} />);
    // "Disponible" appears as the availability indicator, not as a status badge
    // There should be no badge in the top-right overlay position
    expect(screen.queryByText("Réservé")).not.toBeInTheDocument();
    expect(screen.queryByText("Financé")).not.toBeInTheDocument();
    expect(screen.queryByText("Acheté")).not.toBeInTheDocument();
    expect(screen.queryByText("En cours")).not.toBeInTheDocument();
  });

  describe("group gifts", () => {
    it("shows progress bar for group gifts", () => {
      render(
        <GiftCard
          gift={createGift({
            isGroupGift: true,
            targetAmount: 200,
            totalContributed: 100,
            contributionCount: 3,
          })}
        />
      );
      // Progress bar should be rendered
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("shows contribution count (plural)", () => {
      render(
        <GiftCard
          gift={createGift({
            isGroupGift: true,
            targetAmount: 200,
            totalContributed: 100,
            contributionCount: 3,
          })}
        />
      );
      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText(/participations/)).toBeInTheDocument();
    });

    it("shows contribution count (singular)", () => {
      render(
        <GiftCard
          gift={createGift({
            isGroupGift: true,
            targetAmount: 200,
            totalContributed: 50,
            contributionCount: 1,
          })}
        />
      );
      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/participation$/)).toBeInTheDocument();
    });

    it("shows contributed vs target amounts", () => {
      render(
        <GiftCard
          gift={createGift({
            isGroupGift: true,
            targetAmount: 200,
            totalContributed: 75,
            contributionCount: 2,
            price: 200,
          })}
        />
      );
      expect(screen.getByText(/75\.00 €/)).toBeInTheDocument();
      // 200.00 € appears both in the price and in the progress target
      const amounts = screen.getAllByText(/200\.00 €/);
      expect(amounts.length).toBeGreaterThanOrEqual(2);
    });

    it("uses price as target when targetAmount is null", () => {
      render(
        <GiftCard
          gift={createGift({
            isGroupGift: true,
            targetAmount: null,
            price: 300,
            totalContributed: 50,
            contributionCount: 1,
          })}
        />
      );
      // 300.00 € appears in both the price display and the progress target
      const targetAmounts = screen.getAllByText(/300\.00 €/);
      expect(targetAmounts.length).toBeGreaterThanOrEqual(2);
      // The contributed amount appears in the progress section
      expect(screen.getByText(/50\.00 €/)).toBeInTheDocument();
    });

    it("does not show 'Disponible' indicator for group gifts", () => {
      render(
        <GiftCard
          gift={createGift({
            isGroupGift: true,
            status: "available",
            targetAmount: 200,
            totalContributed: 0,
            contributionCount: 0,
          })}
        />
      );
      expect(screen.queryByText("Disponible")).not.toBeInTheDocument();
    });
  });

  it("does not show progress bar for non-group gifts", () => {
    render(<GiftCard gift={createGift({ isGroupGift: false })} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("handles category without icon", () => {
    render(
      <GiftCard
        gift={createGift({
          category: { id: 2, name: "Voyage", slug: "voyage", icon: null },
        })}
      />
    );
    expect(screen.getByText("Voyage")).toBeInTheDocument();
  });
});
