import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Internal workspace pages are never public search-discovery surfaces. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return children;
}
