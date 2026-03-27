import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { AUTH_COOKIE, BASE_PATH } from "./constants";

type SessionPayload = {
  sub: string;
  email: string;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return secret;
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return null;

  const isValid = await compare(password, admin.passwordHash);
  if (!isValid) return null;

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name
  };
}

export function signAdminToken(payload: SessionPayload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: "7d"
  });
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, getSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: BASE_PATH,
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: BASE_PATH,
    maxAge: 0
  });
}
