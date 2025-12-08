"use client";

import Image from "next/image";
import Link from "next/link";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Header = ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-40 w-full md: px-15 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">A</span>
          <span className="text-lg font-extrabold tracking-tight">AgriSparkCyclone</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              <div>
                <Image
                  src={session.user?.image ?? ""}
                  alt={session.user?.name ?? ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <Button
                  onClick={() => signOut()}
                  className="rounded-lg bg-gray-200 px-4 py-[7px] text-black hover:bg-gray-300"
                >
                  ログアウト
                </Button>
              </div>
            </>
          ) : (
            <div>
              <Link href="/login">
                <Button className="rounded-lg bg-green-500 px-4 py-[7px] text-white hover:bg-green-700">
                  ログイン
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;