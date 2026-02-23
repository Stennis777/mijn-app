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
    venue_address,
    venue_transport,
    description,
    category,
    ticket_url,
    image_url,
    contact_name,
    contact_email,
    speakers,
    schedule,
    companies,
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
      venue_address: venue_address || null,
      venue_transport: venue_transport || null,
      description,
      category,
      ticket_url: ticket_url || null,
      image_url: image_url || null,
      contact_name,
      contact_email,
      speakers: speakers?.length ? speakers : null,
      schedule: schedule?.length ? schedule : null,
      companies: companies?.length ? companies : null,
      status: "pending",
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
