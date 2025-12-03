"use client";

import { DemoResponse } from "../shared/api";
import { useEffect, useState } from "react";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  useEffect(() => {
    fetchDemo();
  }, []);

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      // non-blocking
    }
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--accent))_0%,transparent_60%)]" />
        <div className="container mx-auto grid min-h-[70vh] place-items-center px-4 py-16 md:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              新規就農者のための
              <span className="block bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">AgriSparkCyclone</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              「全国共通の申請書」を自動入力。さらにAIが作物別に耕地面積から収支予測を行い、就農計画を強力にサポートします。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/login" className="inline-flex items-center justify-center rounded-md bg-green-500 px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-green-700">
                ログイン
              </a>
              <a href="/finance/predict" className="inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold hover:bg-accent">
                収支予測を試す
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{exampleFromServer}</p>
          </div>
          <div className="relative w-full max-w-xl">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-emerald-100 p-6 shadow-lg dark:from-gray-800 dark:to-gray-900">
              <div className="grid h-full w-full place-items-center text-center">
                <div>
                  <div className="mx-auto mb-4 h-14 w-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3 text-white shadow">
                    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full"><path d="M4 20c4-8 12-8 16 0" stroke="currentColor" strokeWidth="1.5" /><path d="M8 14c2-4 6-4 8 0" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>
                  </div>
                  <h3 className="text-xl font-bold">AI収支予測 + 申請書自動入力</h3>
                  <p className="mt-2 text-sm text-muted-foreground">作物トップ10から選択し、耕地面積を入力するだけで収支の見通しを可視化。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto grid gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <Feature title="申請書を自動入力" desc="全国共通フォーマットに対応。プロフィールから自動入力し、ミスを削減。" />
          <Feature title="AIで収支予測" desc="作物トップ10(仮)から選択し、耕地の大きさに基づいて収支を予測。" />
          <Feature title="安全なデータ管理" desc="データは暗号化して保護。将来的な連携もスムーズ。" />
        </div>
      </section>
    </>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
