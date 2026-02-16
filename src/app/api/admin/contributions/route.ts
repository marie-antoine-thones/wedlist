import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { errorResponse, ApiError } from "@/lib/errors";

export async function GET() {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const contributions = await prisma.contribution.findMany({
      include: {
        giftItem: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: contributions });
  } catch (error) {
    return errorResponse(error);
  }
}
