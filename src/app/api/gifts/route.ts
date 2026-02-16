import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = category && category !== "all"
      ? { category: { slug: category } }
      : {};

    const gifts = await prisma.giftItem.findMany({
      where,
      include: {
        category: true,
        contributions: {
          select: {
            id: true,
            guestName: true,
            amount: true,
            message: true,
            isConfirmed: true,
            createdAt: true,
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    const giftsWithTotals = gifts.map((gift) => {
      const totalContributed = gift.contributions.reduce(
        (sum, c) => sum + c.amount,
        0
      );
      return {
        ...gift,
        totalContributed,
        contributionCount: gift.contributions.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: giftsWithTotals,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
