import type { Metadata, Viewport } from "next";
// import { ThemeProvider } from "next-themes";
import "./globals.css";
import Metrics from "../metrics";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
// import SessionProvider from "../components/SessionProvider"; // Removed NextAuth SessionProvider since app uses Supabase Auth
import ConditionalLayout from "../components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "LearnConnect",
  description: "A modern platform to access academic notes with embedded YouTube videos and PDFs for better learning",
  applicationName: "LearnConnect",
  keywords: [
    "notes",
    "learn connect",
    "learnconnect app",
    "learnconnect website",
    "learnconnect web app",
    "learnconnect webapp",
    "learnconnect notes",
    "learnconnect academic notes",
    "academic notes",
    "academic notes app",
    "academic notes website",
    "academic notes web app",
    "academic notes webapp",
    "learn-connect",
    "learn-connect app",
    "learn-connect website",
    "learn-connect web app",
    "learn-connect webapp",
    "learn-connect notes",
    "learn-connect academic notes",
    "minavkaria",
    "vedanshsavla",
    "aarushsaboo",
    "minav"
  ],
  openGraph: {
    type: "website",
    title: "LearnConnect",
    description: "A modern platform to access academic notes with embedded YouTube videos and PDFs for better learning",
    siteName: "LearnConnect",
    url: "https://learnconnect.minavkaria.tech",
    images: [
      {
        url: "https://learnconnect.minavkaria.tech/icons/apple-touch-icon.png",
        width: 1200,
        height: 630,
        alt: "Icon",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    other: [
      {
        rel: "shortcut icon",
        url: "/favicon.ico",
      },
    ],
  },
  authors: [
    {
      url: "minavkaria.xyz",
      name: "Minav Karia",
    },
    {
      url: "vedanshsavla.xyz",
      name: "Vedansh Savla",
    },
    {
      url: "aarushsaboo.xyz",
      name: "Aarush Saboo",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      <body className="animate-fade-in bg-black text-white">
        {/* <SessionProvider> Removed NextAuth SessionProvider since app uses Supabase Auth */}
          {/* <ThemeProvider attribute="class"> */}
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Metrics />
          {/* </ThemeProvider> */}
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
