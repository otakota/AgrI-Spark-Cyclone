"use client";

import Image from "next/image";
import Link from "next/link";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = ({ session }: { session: Session | null }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* ハンバーガー */}
          <button
            className="p-2"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">
              A
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              AgriSparkCyclone
            </span>
          </Link>

          {/* 右側（PC のみ） */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <Image
                  src={session.user?.image ?? ""}
                  alt={session.user?.name ?? ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <Button
                  onClick={() => signOut()}
                  className="rounded-lg bg-gray-200 px-4 py-[7px] text-black hover:bg-gray-300"
                >
                  ログアウト
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="rounded-lg bg-green-500 px-4 py-[7px] text-white hover:bg-green-700">
                  ログイン
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ===== サイドバー背景（黒い半透明） ===== */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* ===== サイドバー本体 ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-[60] p-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">メニュー</h2>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ===== メニュー項目 ===== */}
        <nav className="space-y-4">

          <Link
            href="/home"
            className="block px-4 py-2 text-lg font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            ホーム
          </Link>
          
          <Link
            href="/agriform"
            className="block px-4 py-2 text-lg font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            申請書作成
          </Link>

          {/* 他に追加したい項目があればここに書く */}
        </nav>
      </aside>
    </>
  );
};

export default Header;
