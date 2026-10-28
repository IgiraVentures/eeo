import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Internal review pages must not inherit the public site's indexable metadata. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ReviewLayout({ children }: { children: ReactNode }) {
  return children;
}
