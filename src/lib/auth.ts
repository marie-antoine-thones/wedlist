import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE = "wedlist_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(): Promise<void> {
  const token = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return !!session?.value;
}

export async function getSettings() {
  return prisma.settings.findFirst();
}

export async function verifyAdmin(password: string): Promise<boolean> {
  const settings = await getSettings();
  if (!settings) return false;
  return verifyPassword(password, settings.adminPasswordHash);
}
