// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider"; // AuthProviderをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriSparkCyclone",
  description: "地方創生のための青年等就農計画申請支援＆AI収支予測プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* AuthProviderでアプリケーション全体をラップし、認証コンテキストを有効にする */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
