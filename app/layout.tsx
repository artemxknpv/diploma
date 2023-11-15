import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import { siteConfig } from "@/config/site";

const font = Jost({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
