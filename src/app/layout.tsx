import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/app/_components/ui/sonner";
import Header from "@/app/_components/header/header";
import QueryProvider from "@/providers/react-query-provider";
import NextTopLoader from 'nextjs-toploader';


const iranyekan = localFont({
  src: [
    {
      path: "./../../public/fonts/iranyekan/IRANYekanXFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./../../public/fonts/iranyekan/IRANYekanXFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../../public/fonts/iranyekan/IRANYekanXFaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../../public/fonts/iranyekan/IRANYekanXFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
});

export const metadata: Metadata = {
  title: "TechnoShop",
  description: "Your one-stop shop for all tech needs.",
  keywords: ["ecommerce", "online shop", "buy", "sell", "products"],
  authors: [{ name: "Emad Mohagheghi", url: "https://emadmo.ir" }],
  creator: "Emad Mohagheghi",
  openGraph: {
    title: "TechnoShop",
    description: "Your one-stop shop for all tech needs.",
    url: "https://technoshop.com",
    siteName: "TechnoShop",
    images: [
      {
        url: "https://technoshop.com/images/logo.svg",
        width: 1200,
        height: 630,
        alt: "TechnoShop logo",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechnoShop",
    description: "Your one-stop shop for all tech needs.",
    creator: "@yourhandle",
    images: ["https://technoshop.com/images/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#5e0a8e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranyekan.variable} antialiased`}>
        <NextTopLoader showSpinner={false} color="var(--color-primary)" />
        <QueryProvider>
          <Header />
          <main className="pt-[62px] lg:pt-[175px]">{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
