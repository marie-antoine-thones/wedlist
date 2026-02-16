import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse } from "@/lib/errors";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { gifts: true } } },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return errorResponse(error);
  }
}
