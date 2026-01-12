import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/_utils/next-auth-options";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(nextAuthOptions);
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("name");

  if (!fileName) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(`files/${filePath}`, 60 * 60);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ url: data.signedUrl });
}
