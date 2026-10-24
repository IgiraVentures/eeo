"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createReviewSessionCookieValue,
  getReviewAuthCookieOptions,
  isReviewPasswordValid,
  REVIEW_AUTH_COOKIE_NAME,
} from "@/lib/reviewAuth";

export async function loginToReviewWorkspace(formData: FormData) {
  const password = formData.get("password");
  const candidate = typeof password === "string" ? password : null;
  if (!isReviewPasswordValid(candidate)) {
    redirect("/review/login?error=invalid");
  }

  const session = createReviewSessionCookieValue();
  if (!session) {
    redirect("/review/login?error=unavailable");
  }
  const cookieStore = await cookies();
  cookieStore.set(REVIEW_AUTH_COOKIE_NAME, session, getReviewAuthCookieOptions());
  redirect("/review");
}
