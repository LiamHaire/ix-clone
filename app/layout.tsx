import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IX Clone",
  description: "IX — AI-driven workflow platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen bg-background">
        <TooltipProvider>
          <div className="relative flex h-full overflow-hidden">
            {children}
          </div>
        </TooltipProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 4px 12px -2px oklch(0.25 0.03 255 / 0.08), 0 2px 6px -2px oklch(0.25 0.03 255 / 0.06)',
            },
          }}
        />
      </body>
    </html>
  );
}
