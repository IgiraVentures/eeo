import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createReviewSessionCookieValue,
  isReviewAuthEnabled,
  isReviewAuthorizedCookieValue,
  isReviewPasswordValid,
  getReviewAuthCookieOptions,
} from "@/lib/reviewAuth";

const PASSWORD = "this-is-a-test-only-review-password-never-use-in-production";

describe("review workspace authentication", () => {
  const original = process.env.REVIEW_WORKSPACE_PASSWORD;

  beforeEach(() => {
    vi.useRealTimers();
    delete process.env.REVIEW_WORKSPACE_PASSWORD;
  });

  afterEach(() => {
    vi.useRealTimers();
    if (original === undefined) delete process.env.REVIEW_WORKSPACE_PASSWORD;
    else process.env.REVIEW_WORKSPACE_PASSWORD = original;
  });

  it("fails closed when no password is configured", () => {
    expect(isReviewAuthEnabled()).toBe(false);
    expect(isReviewPasswordValid(null)).toBe(false);
    expect(isReviewPasswordValid("anything")).toBe(false);
    expect(createReviewSessionCookieValue()).toBeNull();
    expect(isReviewAuthorizedCookieValue(undefined)).toBe(false);
    expect(isReviewAuthorizedCookieValue("anything")).toBe(false);
  });

  it("validates login but never stores the password as a cookie", () => {
    process.env.REVIEW_WORKSPACE_PASSWORD = PASSWORD;
    expect(isReviewAuthEnabled()).toBe(true);
    expect(isReviewPasswordValid(PASSWORD)).toBe(true);
    expect(isReviewPasswordValid("incorrect")).toBe(false);
    const cookie = createReviewSessionCookieValue();
    expect(cookie).toBeTruthy();
    expect(cookie).not.toContain(PASSWORD);
    expect(isReviewAuthorizedCookieValue(cookie)).toBe(true);
    expect(isReviewAuthorizedCookieValue(PASSWORD)).toBe(false);
  });

  it("rejects a tampered or malformed cookie", () => {
    process.env.REVIEW_WORKSPACE_PASSWORD = PASSWORD;
    const cookie = createReviewSessionCookieValue()!;
    expect(isReviewAuthorizedCookieValue(cookie + "a")).toBe(false);
    expect(isReviewAuthorizedCookieValue("v1.invalid")).toBe(false);
    expect(isReviewAuthorizedCookieValue("v1." + Date.now().toString(36) + ".x")).toBe(false);
  });

  it("expires in 24 hours and rejects future issue timestamps", () => {
    process.env.REVIEW_WORKSPACE_PASSWORD = PASSWORD;
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-23T18:00:00.000Z"));
    const cookie = createReviewSessionCookieValue()!;
    vi.setSystemTime(new Date("2026-10-23T17:59:59.000Z"));
    expect(isReviewAuthorizedCookieValue(cookie)).toBe(false);
    vi.setSystemTime(new Date("2026-10-24T18:00:00.000Z"));
    expect(isReviewAuthorizedCookieValue(cookie)).toBe(false);
  });

  it("invalidates signed cookies when reviewer password changes", () => {
    process.env.REVIEW_WORKSPACE_PASSWORD = PASSWORD;
    const cookie = createReviewSessionCookieValue()!;
    process.env.REVIEW_WORKSPACE_PASSWORD = PASSWORD + "-rotated";
    expect(isReviewAuthorizedCookieValue(cookie)).toBe(false);
  });

  it("sets production browser cookie protections", () => {
    expect(getReviewAuthCookieOptions()).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });
  });
});
