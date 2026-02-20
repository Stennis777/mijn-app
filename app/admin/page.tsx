import { supabase } from "@/lib/supabase";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: submissions } = await supabase
    .from("event_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboard submissions={submissions ?? []} />;
}
