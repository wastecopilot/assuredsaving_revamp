import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { cssVariables } from "@/lib/tokens";
import "./globals.css";

const heading = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-heading", weight: ["600", "700", "800"], display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const title = "Assured Saving | Let's get the right deal";
const description =
  "Pick your services, enter your address and compare internet, TV, mobile, security and home phone plans with every required fee included. Design preview with sample data.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Assured Saving", locale: "en_US" },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = { themeColor: "#FFFCF7", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVariables() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
