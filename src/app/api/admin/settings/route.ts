import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { SettingsSchema } from "@/lib/validation";
import { errorResponse, ApiError } from "@/lib/errors";

export async function GET() {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const settings = await prisma.settings.findFirst();
    if (!settings) throw new ApiError(404, "Settings not found");

    return NextResponse.json({
      success: true,
      data: {
        coupleName1: settings.coupleName1,
        coupleName2: settings.coupleName2,
        weddingDate: settings.weddingDate.toISOString(),
        personalMessage: settings.personalMessage,
        heroImageUrl: settings.heroImageUrl,
        bankAccountHolder: settings.bankAccountHolder,
        bankIBAN: settings.bankIBAN,
        bankBIC: settings.bankBIC,
        bankName: settings.bankName,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const body = await request.json();
    const input = SettingsSchema.parse(body);

    const existing = await prisma.settings.findFirst();
    if (!existing) throw new ApiError(404, "Settings not found");

    const settings = await prisma.settings.update({
      where: { id: existing.id },
      data: {
        coupleName1: input.coupleName1,
        coupleName2: input.coupleName2,
        weddingDate: new Date(input.weddingDate),
        personalMessage: input.personalMessage,
        heroImageUrl: input.heroImageUrl || null,
        bankAccountHolder: input.bankAccountHolder,
        bankIBAN: input.bankIBAN,
        bankBIC: input.bankBIC,
        bankName: input.bankName,
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return errorResponse(error);
  }
}
