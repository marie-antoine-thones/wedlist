import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { errorResponse, ApiError } from "@/lib/errors";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) throw new ApiError(401, "Unauthorized");

    const { id } = await params;
    const contribId = parseInt(id, 10);
    if (isNaN(contribId)) throw new ApiError(400, "Invalid contribution ID");

    const body = await request.json();
    const { isConfirmed } = body;

    if (typeof isConfirmed !== "boolean") {
      throw new ApiError(400, "isConfirmed must be a boolean");
    }

    const contribution = await prisma.contribution.update({
      where: { id: contribId },
      data: { isConfirmed },
    });

    return NextResponse.json({ success: true, data: contribution });
  } catch (error) {
    return errorResponse(error);
  }
}
