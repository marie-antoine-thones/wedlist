import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BankDetailsCard } from "@/components/bank-details-card";

// Mock the useCopyToClipboard hook
const mockCopyToClipboard = vi.fn();
vi.mock("@/hooks/use-copy-to-clipboard", () => ({
  useCopyToClipboard: () => ({
    copied: false,
    copyToClipboard: mockCopyToClipboard,
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const defaultProps = {
  bankAccountHolder: "Marie & Pierre Martin",
  bankIBAN: "FR7630006000011234567890189",
  bankBIC: "BNPAFRPP",
  bankName: "BNP Paribas",
};

describe("BankDetailsCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the bank name", () => {
    render(<BankDetailsCard {...defaultProps} />);
    expect(screen.getByText("BNP Paribas")).toBeInTheDocument();
  });

  it("renders the account holder name", () => {
    render(<BankDetailsCard {...defaultProps} />);
    expect(screen.getByText("Marie & Pierre Martin")).toBeInTheDocument();
  });

  it("renders the IBAN formatted with spaces", () => {
    render(<BankDetailsCard {...defaultProps} />);
    // The IBAN is formatted with spaces every 4 characters
    const formattedIBAN = "FR76 3000 6000 0112 3456 7890 189";
    expect(screen.getByText(formattedIBAN)).toBeInTheDocument();
  });

  it("renders the BIC code", () => {
    render(<BankDetailsCard {...defaultProps} />);
    expect(screen.getByText("BNPAFRPP")).toBeInTheDocument();
  });

  it("renders the card title", () => {
    render(<BankDetailsCard {...defaultProps} />);
    expect(screen.getByText("Coordonnées bancaires")).toBeInTheDocument();
  });

  it("renders the copy button with correct aria-label", () => {
    render(<BankDetailsCard {...defaultProps} />);
    const copyButton = screen.getByRole("button", {
      name: "Copier l'IBAN",
    });
    expect(copyButton).toBeInTheDocument();
  });

  it("calls copyToClipboard with IBAN when copy button is clicked", async () => {
    const user = userEvent.setup();
    render(<BankDetailsCard {...defaultProps} />);

    const copyButton = screen.getByRole("button", {
      name: "Copier l'IBAN",
    });
    await user.click(copyButton);

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      "FR7630006000011234567890189"
    );
  });

  it("does not render reference section when reference is not provided", () => {
    render(<BankDetailsCard {...defaultProps} />);
    expect(
      screen.queryByText("Référence suggérée pour le virement")
    ).not.toBeInTheDocument();
  });

  it("renders reference when provided", () => {
    render(
      <BankDetailsCard {...defaultProps} reference="MARIAGE-MARTIN-2025" />
    );
    expect(
      screen.getByText("Référence suggérée pour le virement")
    ).toBeInTheDocument();
    expect(screen.getByText("MARIAGE-MARTIN-2025")).toBeInTheDocument();
  });

  it("renders section labels", () => {
    render(<BankDetailsCard {...defaultProps} />);
    expect(screen.getByText("Banque")).toBeInTheDocument();
    expect(screen.getByText("Titulaire du compte")).toBeInTheDocument();
    expect(screen.getByText("IBAN")).toBeInTheDocument();
    expect(screen.getByText("BIC / SWIFT")).toBeInTheDocument();
  });
});
