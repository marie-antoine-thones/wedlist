import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { errorResponse, ApiError } from "@/lib/errors";

export async function GET() {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const [totalGifts, contributions, giftsByStatus] = await Promise.all([
      prisma.giftItem.count(),
      prisma.contribution.findMany({
        select: { amount: true, isConfirmed: true },
      }),
      prisma.giftItem.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    const confirmedAmount = contributions
      .filter((c) => c.isConfirmed)
      .reduce((sum, c) => sum + c.amount, 0);

    const pendingAmount = contributions
      .filter((c) => !c.isConfirmed)
      .reduce((sum, c) => sum + c.amount, 0);

    const statusCounts = Object.fromEntries(
      giftsByStatus.map((g) => [g.status, g._count])
    );

    return NextResponse.json({
      success: true,
      data: {
        totalGifts,
        reservedGifts: (statusCounts["reserved"] || 0) + (statusCounts["funded"] || 0),
        fundedGifts: statusCounts["funded"] || 0,
        totalContributions: contributions.length,
        confirmedAmount,
        pendingAmount,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
