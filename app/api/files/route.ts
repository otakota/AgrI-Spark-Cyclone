import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const name = form.get("name");

  if (!(file instanceof File) || typeof name !== "string" || !name) {
    return NextResponse.json({ error: "file or name is missing" }, { status: 400 });
  }

  const userId = session.user.id;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // まずは分かりやすく files/ を外してもOK（どちらでも動く）
  const objectPath = `files/${userId}/${name}`;

  const { data, error } = await supabase.storage
    .from("documents")
    .upload(objectPath, buffer, {
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ path: data.path });
}
