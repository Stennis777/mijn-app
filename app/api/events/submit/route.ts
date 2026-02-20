import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    title,
    date,
    end_date,
    location,
    city,
    description,
    category,
    ticket_url,
    contact_name,
    contact_email,
  } = body;

  if (!title || !date || !location || !city || !description || !category || !contact_name || !contact_email) {
    return NextResponse.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
  }

  const { error } = await supabase.from("event_submissions").insert([
    {
      title,
      date,
      end_date: end_date || null,
      location,
      city,
      description,
      category,
      ticket_url: ticket_url || null,
      contact_name,
      contact_email,
      status: "pending",
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
