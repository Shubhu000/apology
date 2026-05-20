import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For You ❤️",
  description: "A little something from my heart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
