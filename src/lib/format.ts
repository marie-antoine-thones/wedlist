export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getContributionProgress(
  contributions: { amount: number; isConfirmed: boolean }[],
  targetAmount: number
): number {
  const total = contributions.reduce((sum, c) => sum + c.amount, 0);
  return Math.min((total / targetAmount) * 100, 100);
}

export function getTotalContributed(
  contributions: { amount: number }[]
): number {
  return contributions.reduce((sum, c) => sum + c.amount, 0);
}
