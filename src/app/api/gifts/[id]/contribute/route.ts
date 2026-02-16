import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ContributionSchema } from "@/lib/validation";
import { errorResponse, ApiError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const giftId = parseInt(id, 10);
    if (isNaN(giftId)) throw new ApiError(400, "Invalid gift ID");

    const gift = await prisma.giftItem.findUnique({
      where: { id: giftId },
      include: { contributions: true },
    });

    if (!gift) throw new ApiError(404, "Gift not found");

    const body = await request.json();
    const input = ContributionSchema.parse(body);

    // For non-group gifts, check if already reserved
    if (!gift.isGroupGift) {
      if (gift.status === "reserved" || gift.status === "purchased") {
        throw new ApiError(409, "This gift has already been reserved");
      }

      // Reserve the gift
      await prisma.giftItem.update({
        where: { id: giftId },
        data: { status: "reserved" },
      });
    } else {
      // For group gifts, check if target is already reached
      const totalContributed = gift.contributions.reduce(
        (sum, c) => sum + c.amount,
        0
      );
      const target = gift.targetAmount || gift.price;

      if (totalContributed + input.amount > target) {
        throw new ApiError(
          400,
          `Contribution would exceed the target. Remaining: €${(target - totalContributed).toFixed(2)}`
        );
      }

      // Update status based on total
      const newTotal = totalContributed + input.amount;
      const newStatus = newTotal >= target ? "funded" : "partially_funded";
      await prisma.giftItem.update({
        where: { id: giftId },
        data: { status: newStatus },
      });
    }

    const contribution = await prisma.contribution.create({
      data: {
        giftItemId: giftId,
        guestName: input.guestName,
        guestEmail: input.guestEmail || null,
        amount: input.amount,
        message: input.message,
        paymentMethod: input.paymentMethod,
      },
    });

    return NextResponse.json(
      { success: true, data: contribution },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
