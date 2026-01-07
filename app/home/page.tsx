"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function home() {
  return (
    <div className="flex font-bold text-4xl items-center justify-center min-h-screen">
      <h2 className="">ようこそAgtiSparkCyclone</h2>
      <Link href="/agriform">
        <Button className="inline-flex items-center justify-center rounded-md bg-gradient-to-r  from-emerald-600 to-green-500 px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:to-green-700">
          申請書を作成
          </Button>
      </Link>
    </div>
  )
}
