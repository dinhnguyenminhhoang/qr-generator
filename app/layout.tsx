import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tạo Mã QR - QR Code Generator",
  description: "Công cụ tạo mã QR chuyên nghiệp - Miễn phí và dễ sử dụng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
