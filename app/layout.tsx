import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Moderustic, Poiret_One } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { outfit } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as ToastUiToaster } from "@/components/ui/toast"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { GoogleAnalytics } from "@next/third-parties/google"
import { PushNotificationManager } from "@/components/push-notification-manager"


const moderustic = Moderustic({ subsets: ['latin'], variable: '--font-moderustic', preload: false });
const poiretOne = Poiret_One({ weight: "400", subsets: ['latin'], variable: '--font-poiret-one', preload: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Sbagiamu Cafe",
  description: "Sistem manajemen Sbagiamu Cafe",
  icons: {
    icon: [{ url: "/pwa-icon.png", type: "image/png" }],
    shortcut: "/pwa-icon.png",
    apple: "/pwa-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sbagiamu Cafe",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", outfit.variable, moderustic.variable, poiretOne.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ToastUiToaster />
          <PWAInstallPrompt />
          <PushNotificationManager />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
