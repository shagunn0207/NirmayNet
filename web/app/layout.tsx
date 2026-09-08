import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "NiramayNet | Rural Healthcare Continuity Platform",
  description:
    "Integrated clinical operations platform for PHC Doctors, District Hospital Staff, and District Health Officers (DHO) - Government of Maharashtra",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
