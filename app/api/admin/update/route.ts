import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  const { id, status } = await req.json();

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const { error } = await supabase
    .from("event_submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
