import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "BoardSmart Assessments",
  description:
    "Generate IB, IGCSE, GCSE, AP, CBSE, and ICSE aligned assessments with LaTeX-perfect PDFs and intelligent autosave workflows.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "bg-slate-50 min-h-full")}> 
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-brandBlue-700">
                BoardSmart
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <Link href="/create-test" className="hover:text-brandTeal-600">
                  Create Test
                </Link>
                <Link href="/workspace" className="hover:text-brandTeal-600">
                  Student Workspace
                </Link>
                <Link href="/teacher" className="hover:text-brandTeal-600">
                  Teacher Analytics
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 bg-slate-50">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} BoardSmart Assessments. Crafted for international classrooms.
          </footer>
        </div>
      </body>
    </html>
  );
}
