import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path"); // 例: files/<userId>/xxx.pdf

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  // ★超重要：自分のフォルダ配下しか見せない
  const allowedPrefix = `files/${userId}/`;
  if (!path.startsWith(allowedPrefix)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 期限付きURL（例：60秒）
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(path, 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error ?? "Failed to sign url" }, { status: 400 });
  }

  // 署名付きURLへ移動（ブラウザがPDFならプレビューしてくれる）
  return NextResponse.redirect(data.signedUrl);
}