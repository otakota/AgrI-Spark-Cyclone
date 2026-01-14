"use client";

import { useEffect, useMemo, useState } from "react";

type ListedFile = {
  name: string;
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
  size: number | null;
  mimeType: string | null;
  path: string;
};

function isPdf(f: ListedFile) {
  return (
    f.mimeType === "application/pdf" ||
    f.name.toLowerCase().endsWith(".pdf")
  );
}
function isExcel(f: ListedFile) {
  const n = f.name.toLowerCase();
  return (
    f.mimeType?.includes("spreadsheet") ||
    n.endsWith(".xlsx") ||
    n.endsWith(".xls")
  );
}
function fmtDate(s: string | null) {
  if (!s) return "-";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "-" : d.toLocaleString();
}
function fmtSize(size: number | null) {
  if (typeof size !== "number") return "-";
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export default function FilesGalleryPage() {
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [selected, setSelected] = useState<ListedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<"created_desc" | "created_asc" | "name_asc" | "name_desc" | "size_desc" | "size_asc">("created_desc");

  

  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/files/list", { cache: "no-store" });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body?.error ?? `Failed: ${res.status}`);
        setFiles([]);
        setSelected(null);
        return;
      }

      const list: ListedFile[] = body.files ?? [];
      setFiles(list);

      // 何も選ばれていなければ先頭を選択
      if (!selected && list.length > 0) setSelected(list[0]);
      // 選択中が消えてたら先頭に寄せる
      if (selected && !list.find((f) => f.path === selected.path)) {
        setSelected(list[0] ?? null);
      }
    } catch (e: any) {
      setError(e?.message ?? "Fetch failed");
      setFiles([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
  const s = q.trim().toLowerCase();
  const list = !s ? files : files.filter((f) => f.name.toLowerCase().includes(s));

  const byName = (a: ListedFile, b: ListedFile) =>
    a.name.localeCompare(b.name, "ja");

  const byCreated = (a: ListedFile, b: ListedFile) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
    return ta - tb;
  };

  const bySize = (a: ListedFile, b: ListedFile) => {
    const sa = typeof a.size === "number" ? a.size : -1;
    const sb = typeof b.size === "number" ? b.size : -1;
    return sa - sb;
  };

  const sorted = [...list];

  switch (sortKey) {
    case "created_asc":
      sorted.sort(byCreated);
      break;
    case "created_desc":
      sorted.sort((a, b) => byCreated(b, a));
      break;
    case "name_asc":
      sorted.sort(byName);
      break;
    case "name_desc":
      sorted.sort((a, b) => byName(b, a));
      break;
    case "size_asc":
      sorted.sort(bySize);
      break;
    case "size_desc":
      sorted.sort((a, b) => bySize(b, a));
      break;
  }

  return sorted;
}, [files, q, sortKey]);


  return (
    <div className="h-[calc(100vh-0px)] p-6">
      <div className="max-w-6xl mx-auto h-full flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">作成した申請書</h1>

          <div className="flex items-center gap-2">
  <select
    className="border rounded px-3 py-2 text-sm"
    value={sortKey}
    onChange={(e) => setSortKey(e.target.value as any)}
  >
    <option value="created_desc">新しい順</option>
    <option value="created_asc">古い順</option>
    <option value="name_asc">名前（A→Z）</option>
    <option value="name_desc">名前（Z→A）</option>
    <option value="size_desc">サイズ（大→小）</option>
    <option value="size_asc">サイズ（小→大）</option>
  </select>

  <input
    className="border rounded px-3 py-2 text-sm w-64"
    placeholder="Search files…"
    value={q}
    onChange={(e) => setQ(e.target.value)}
  />

  <button
    onClick={fetchFiles}
    disabled={loading}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    {loading ? "Loading…" : "Reload"}
  </button>
</div>

        </div>

        {error && (
          <div className="border border-red-300 bg-red-50 text-red-800 p-3 rounded">
            {error}
          </div>
        )}

        {/* Drive風：左ギャラリー + 右プレビュー */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
          {/* 左：ギャラリー */}
          <div className="col-span-5 lg:col-span-4 border rounded min-h-0 flex flex-col">
            <div className="px-3 py-2 border-b text-sm font-semibold bg-gray-50">
              Gallery
              <span className="ml-2 text-gray-500 font-normal">
                ({filtered.length})
              </span>
            </div>

            <div className="p-3 overflow-auto flex-1 min-h-0">
              {filtered.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {loading ? "Loading…" : "No files."}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filtered.map((f) => {
                    const active = selected?.path === f.path;
                    return (
                      <button
                        key={f.path}
                        onClick={() => setSelected(f)}
                        className={[
                          "text-left border rounded p-3 hover:bg-gray-50",
                          active ? "ring-2 ring-blue-500" : "",
                        ].join(" ")}
                      >
                        {/* サムネ（簡易：アイコン） */}
                        <div className="h-24 rounded bg-gray-100 flex items-center justify-center text-gray-600 text-sm">
                          {isPdf(f) ? "PDF" : isExcel(f) ? "XLSX" : "FILE"}
                        </div>

                        <div className="mt-2">
                          <div className="text-sm font-semibold line-clamp-2 break-all">
                            {f.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {fmtDate(f.created_at)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 右：プレビュー */}
          <div className="col-span-7 lg:col-span-8 border rounded min-h-0 flex flex-col">
            <div className="px-3 py-2 border-b flex items-center justify-between gap-2 bg-gray-50">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  {selected?.name ?? "No selection"}
                </div>
                {selected && (
                  <div className="text-xs text-gray-500">
                    {fmtSize(selected.size)} ・ {selected.mimeType ?? "unknown"}
                  </div>
                )}
              </div>

              {selected && (
                <div className="flex items-center gap-2">
                  {/* PDFはプレビュー前提、Excelなどは基本ダウンロード */}
                  <a
                    className="text-sm px-3 py-1 border rounded hover:bg-white"
                    href={`/api/files/preview?path=${encodeURIComponent(
                      selected.path
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-0 bg-white">
              {!selected ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a file to preview
                </div>
              ) : isPdf(selected) ? (
                <iframe
                  title="preview"
                  src={`/api/files/preview?path=${encodeURIComponent(
                    selected.path
                  )}`}
                  className="w-full h-full"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-600 p-6 text-center">
                  <div className="text-sm">
                    このファイル形式はブラウザ内プレビューに未対応です。
                  </div>
                  <a
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    href={`/api/files/preview?path=${encodeURIComponent(
                      selected.path
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    署名付きURLで開く
                  </a>
                  <div className="text-xs text-gray-500">
                    ※ Excel は多くの環境でプレビューできないため、ダウンロード/外部アプリで開くのが一般的です。
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          ※ サムネは簡易表示です（DriveみたいなPDFの1ページ目サムネは、別途サーバー側で画像生成が必要）。
        </p>
      </div>
    </div>
  );
}
