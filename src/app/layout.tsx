import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/app/_components/ui/sonner";
import Header from "@/app/_components/header/header";
import QueryProvider from "@/providers/react-query-provider";
import NextTopLoader from "nextjs-toploader";

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
  title: "تکنوشاپ | فروشگاه آنلاین محصولات دیجیتال",
  description:
    "تکنوشاپ، فروشگاه آنلاین برای خرید موبایل، لپ‌تاپ، لوازم جانبی و محصولات دیجیتال با بهترین قیمت.",
  keywords: [
    "تکنوشاپ",
    "فروشگاه آنلاین",
    "خرید موبایل",
    "لوازم دیجیتال",
    "قیمت لپ‌تاپ",
  ],
  authors: [{ name: "Emad Mohagheghi", url: "https://emadmo.ir" }],
  creator: "Emad Mohagheghi",
  openGraph: {
    title: "تکنوشاپ | فروشگاه آنلاین محصولات دیجیتال",
    description:
      "تکنوشاپ، خرید مطمئن محصولات دیجیتال با ارسال سریع و پشتیبانی ۲۴ ساعته.",
    url: "https://technoshop.emadmo.ir/",
    siteName: "تکنوشاپ",
    images: [
      {
        url: "https://technoshop.emadmo.ir/images/logo.svg",
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
    title: "تکنوشاپ | فروشگاه آنلاین محصولات دیجیتال",
    description: "خرید آسان و امن محصولات دیجیتال در تکنوشاپ.",
    images: ["https://technoshop.emadmo.ir/images/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/favicon.ico",
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
