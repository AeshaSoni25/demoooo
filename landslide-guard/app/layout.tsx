import type { Metadata } from "next";
import "./globals.css";
import { DemoModeProvider } from "@/hooks/use-demo-mode";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "LandslideGuard AI — Early Warning System",
  description:
    "AI-powered landslide early warning and risk monitoring platform for disaster management authorities, field officers, and emergency responders.",
  keywords: [
    "landslide",
    "early warning",
    "AI prediction",
    "disaster management",
    "India",
    "NDRF",
    "risk monitoring",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme ? theme === 'dark' : systemDark;
                const html = document.documentElement;
                if (shouldBeDark) {
                  html.classList.add('dark');
                  html.style.colorScheme = 'dark';
                } else {
                  html.classList.add('light');
                  html.style.colorScheme = 'light';
                }
              })()
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <DemoModeProvider>{children}</DemoModeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
