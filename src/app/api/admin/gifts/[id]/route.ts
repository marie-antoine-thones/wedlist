import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { GiftItemSchema } from "@/lib/validation";
import { errorResponse, ApiError } from "@/lib/errors";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const { id } = await params;
    const giftId = parseInt(id, 10);
    if (isNaN(giftId)) throw new ApiError(400, "Invalid gift ID");

    const body = await request.json();
    const input = GiftItemSchema.parse(body);

    const gift = await prisma.giftItem.update({
      where: { id: giftId },
      data: {
        title: input.title,
        description: input.description,
        imageUrl: input.imageUrl || null,
        categoryId: input.categoryId,
        price: input.price,
        isGroupGift: input.isGroupGift,
        targetAmount: input.targetAmount ?? null,
        sortOrder: input.sortOrder,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: gift });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const { id } = await params;
    const giftId = parseInt(id, 10);
    if (isNaN(giftId)) throw new ApiError(400, "Invalid gift ID");

    await prisma.giftItem.delete({ where: { id: giftId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
