import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import LoadingScreen from "@/components/Layout/LoadingScreen";
import FloatingCreator from "@/components/Layout/FloatingCreator";
import QuickSearch from "@/components/Layout/QuickSearch";
import ContinueReadingPopup from "@/components/Layout/ContinueReadingPopup";
import { SITE } from "@/lib/themes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  manifest: "/manifest.webmanifest",
  applicationName: SITE.name,
  authors: [{ name: SITE.creator.name, url: "https://azkafatkhunnuha.my.id" }],
  creator: SITE.creator.name,
  publisher: SITE.creator.name,
  keywords: [
    "manga",
    "manhwa",
    "manhua",
    "comic reader",
    "webtoon",
    "AFZN",
    "Comicverse",
    "Azka Fatkhunnuha",
    "Sanka Vollerei",
  ],
  openGraph: {
    type: "website",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#F5F0E6" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="neo-crimson"
      suppressHydrationWarning
      className={`${inter.variable} ${display.variable}`}
    >
      <body className="min-h-screen bg-bg text-text antialiased">
        <ThemeProvider>
          <LoadingScreen />
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
          <FloatingCreator />
          <QuickSearch />
          <ContinueReadingPopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
