import { createHmac, timingSafeEqual } from "node:crypto";
import type { cookies as cookiesFn } from "next/headers";

export const REVIEW_AUTH_COOKIE_NAME = "eeo_review_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;
const ONE_DAY_MS = ONE_DAY_SECONDS * 1000;
const SESSION_VERSION = "v1";

type CookieStore = Awaited<ReturnType<typeof cookiesFn>>;

function getRequiredReviewPassword(): string | null {
  const value = process.env.REVIEW_WORKSPACE_PASSWORD?.trim();
  return value ? value : null;
}

function constantTimeMatches(candidate: string, expected: string): boolean {
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function sessionSignature(payload: string, password: string): string {
  return createHmac("sha256", password).update(payload).digest("hex");
}

export function isReviewAuthEnabled(): boolean {
  return getRequiredReviewPassword() !== null;
}

/** The password is used only to authenticate sign-in; it is never used as a cookie. */
export function isReviewPasswordValid(candidate: string | null | undefined): boolean {
  const required = getRequiredReviewPassword();
  return required !== null && typeof candidate === "string" && constantTimeMatches(candidate, required);
}

/** Return a signed, expiring reviewer session; return null when authentication is unconfigured. */
export function createReviewSessionCookieValue(): string | null {
  const password = getRequiredReviewPassword();
  if (!password) return null;
  const payload = SESSION_VERSION + "." + Date.now().toString(36);
  return payload + "." + sessionSignature(payload, password);
}

/** Fail closed when unconfigured, missing, malformed, tampered with, or expired. */
export function isReviewAuthorizedCookieValue(cookieValue: string | null | undefined): boolean {
  const password = getRequiredReviewPassword();
  if (!password || typeof cookieValue !== "string") return false;

  const parts = cookieValue.split(".");
  if (parts.length !== 3 || parts[0] !== SESSION_VERSION) return false;
  const [, issuedAtText, signature] = parts;
  if (!/^[0-9a-z]+$/.test(issuedAtText) || !/^[0-9a-f]{64}$/.test(signature)) return false;
  const issuedAt = Number.parseInt(issuedAtText, 36);
  const now = Date.now();
  if (!Number.isSafeInteger(issuedAt) || issuedAt > now || now - issuedAt >= ONE_DAY_MS) return false;

  const expected = sessionSignature(SESSION_VERSION + "." + issuedAtText, password);
  return constantTimeMatches(signature, expected);
}

export function isReviewAuthorizedFromCookies(cookieStore: CookieStore): boolean {
  return isReviewAuthorizedCookieValue(cookieStore.get(REVIEW_AUTH_COOKIE_NAME)?.value);
}

export function getReviewAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY_SECONDS,
  };
}

/**
 * Lightweight reviewer identity for audit attribution.
 * Uses optional env overrides to avoid exposing secret cookie values.
 */
export function getReviewerIdentity() {
  return {
    reviewerId: process.env.REVIEW_WORKSPACE_REVIEWER_ID?.trim() || "reviewer_session",
    reviewerLabel:
      process.env.REVIEW_WORKSPACE_REVIEWER_LABEL?.trim() || "Authenticated reviewer",
  };
}
