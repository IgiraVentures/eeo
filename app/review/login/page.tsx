import Link from "next/link";

import { isReviewAuthEnabled } from "@/lib/reviewAuth";
import { loginToReviewWorkspace } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReviewLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authEnabled = isReviewAuthEnabled();

  return (
    <main className="relative flex min-h-full flex-1 flex-col bg-transparent text-[color:var(--eeo-text)]">
      <div className="mx-auto max-w-xl space-y-5 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Review workspace sign-in</h1>
        {authEnabled ? (
          <>
            <p className="text-sm text-stone-700">
              This internal workspace requires reviewer authentication.
            </p>
            <form action={loginToReviewWorkspace} className="space-y-3 rounded-2xl border border-stone-200 bg-white/80 p-5">
              <label htmlFor="password" className="block text-sm font-semibold text-stone-700">
                Review workspace password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
                placeholder="Enter password"
              />
              {error === "invalid" ? (
                <p className="text-sm text-red-700">Sign-in failed. Verify your credentials.</p>
              ) : null}
              <button
                type="submit"
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Sign in
              </button>
            </form>
          </>
        ) : (
          <p className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Internal review access is unavailable until an administrator configures authentication.
          </p>
        )}
        <Link href="/" className="text-sm underline">
          Return to main app
        </Link>
      </div>
    </main>
  );
}
