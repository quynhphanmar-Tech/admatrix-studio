import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "AdMatrix — Clone 12 Kịch Bản Video Ads Từ Viral Gốc",
  description:
    "Nền tảng tự động bóc tách video viral, clone 12 kịch bản khác cấu trúc, ghép footage sản phẩm, xuất MP4 và A/B test chuyển đổi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        className={`${inter.className} bg-[#0a0c14] text-white antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
