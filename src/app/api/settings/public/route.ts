import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse } from "@/lib/errors";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Settings not configured" },
        { status: 404 }
      );
    }

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
