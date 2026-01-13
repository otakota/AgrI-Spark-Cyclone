"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="flex flex-col items-center gap-8 rounded-2xl bg-white p-12 shadow-xl">

        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
          ようこそ <span className="text-emerald-600">AgriSparkCyclone</span>
        </h2>

        <p className="text-lg text-gray-600">
          農業の申請と収支予測を、AIでスマートに
        </p>

        <div className="flex gap-4">
          <Link href="/agriform">
            <Button className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow hover:from-emerald-700 hover:to-green-600">
              申請書を作成
            </Button>
          </Link>

          <Link href="/simulation">
            <Button className="rounded-xl border border-emerald-600 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50">
              収支予測を試す
            </Button>
          </Link>
          <Link href="/files">
            <Button className="rounded-xl border border-emerald-600 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50">
              作成した申請書の確認
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
