import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { GiftItemSchema } from "@/lib/validation";
import { errorResponse, ApiError } from "@/lib/errors";

export async function GET() {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const gifts = await prisma.giftItem.findMany({
      include: {
        category: true,
        contributions: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: gifts });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const body = await request.json();
    const input = GiftItemSchema.parse(body);

    const gift = await prisma.giftItem.create({
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

    return NextResponse.json({ success: true, data: gift }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
