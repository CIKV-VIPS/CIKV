import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

// Force dynamic rendering - no static caching
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "CIKV",
  description: "CIKV Website",
  icons: {
    icon: 'https://res.cloudinary.com/dx2ttgkba/image/upload/v1768559225/cikv_logo_ngjrst.jpg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dx2ttgkba/image/upload/v1768559225/cikv_logo_ngjrst.jpg" sizes="any" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-[#FFFBEB]`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}