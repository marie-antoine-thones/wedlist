import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse, ApiError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const giftId = parseInt(id, 10);
    if (isNaN(giftId)) throw new ApiError(400, "Invalid gift ID");

    const gift = await prisma.giftItem.findUnique({
      where: { id: giftId },
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
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!gift) throw new ApiError(404, "Gift not found");

    const totalContributed = gift.contributions.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        ...gift,
        totalContributed,
        contributionCount: gift.contributions.length,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
