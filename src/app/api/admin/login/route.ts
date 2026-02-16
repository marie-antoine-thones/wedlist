import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, createSession } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";
import { errorResponse, ApiError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = LoginSchema.parse(body);

    const isValid = await verifyAdmin(password);
    if (!isValid) {
      throw new ApiError(401, "Invalid password");
    }

    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
