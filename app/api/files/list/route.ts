import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  // あなたの upload 側が `files/${userId}/${name}` に保存しているのでここも合わせる
  const prefix = `files/${userId}`;

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .list(prefix, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // 画面側で使いやすい形に整形（path も返す）
  const files = (data ?? []).map((f) => ({
    name: f.name,
    id: f.id ?? null,
    created_at: f.created_at ?? null,
    updated_at: f.updated_at ?? null,
    size: f.metadata?.size ?? null,
    mimeType: f.metadata?.mimetype ?? null,
    path: `${prefix}/${f.name}`, // 後でdownload用にも使える
  }));

  return NextResponse.json({ files });
}
