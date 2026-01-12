"use client";

import { useState } from "react";

export default function MockPdfStoragePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // PDFを生成してアップロード
  const generateAndUploadPdf = async () => {
    setLoading(true);
    try {
      // ① ダミーPDF生成（本番では既存のPDF生成ロジックに置き換え）
      const pdfContent = `Mock PDF\nGenerated at: ${new Date().toISOString()}`;
      const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });

      // ② FormData に詰める
      const formData = new FormData();
      formData.append("file", pdfBlob, "mock.pdf");
      formData.append("name", `mock-${Date.now()}.pdf`);

      // ③ APIに送信（userIdはサーバー側で自動付与）
      await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      // ④ 保存後に一覧を再取得
      await fetchFiles();
    } finally {
      setLoading(false);
    }
  };

  // ファイル一覧取得
  const fetchFiles = async () => {
    const res = await fetch("/api/files/list");
    const data = await res.json();
    setFiles(data);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Mock PDF Storage Test</h1>

      <div className="flex gap-4">
        <button
          onClick={generateAndUploadPdf}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          PDFを生成して保存
        </button>

        <button
          onClick={fetchFiles}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          保存済みファイル一覧取得
        </button>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">保存済みファイル</h2>
        {files.length === 0 ? (
          <p className="text-gray-500">ファイルはまだありません</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file, i) => (
              <li
                key={i}
                className="border rounded px-3 py-2 text-sm"
              >
                <div>name: {file.name}</div>
                {file.created_at && <div>created_at: {file.created_at}</div>}
                {file.id && <div>id: {file.id}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
