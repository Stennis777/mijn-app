"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Submission {
  id: string;
  title: string;
  date: string;
  end_date?: string;
  location: string;
  city: string;
  description: string;
  category: string;
  ticket_url?: string;
  contact_name: string;
  contact_email: string;
  status: string;
  created_at: string;
}

const STATUS_TABS = [
  { key: "pending", label: "Te beoordelen", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { key: "approved", label: "Goedgekeurd", color: "text-green-600 bg-green-50 border-green-200" },
  { key: "rejected", label: "Afgewezen", color: "text-red-600 bg-red-50 border-red-200" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export default function AdminDashboard({ submissions }: { submissions: Submission[] }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Submission | null>(null);
  const router = useRouter();

  const filtered = submissions.filter((s) => s.status === activeTab);
  const counts = {
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setLoadingId(id);
    await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLoadingId(null);
    setSelected(null);
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">Admin Panel</span>
            <span className="ml-2 text-sm text-gray-400">E-commerce Events NL</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Uitloggen
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Aanmeldingen</h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeTab === tab.key ? tab.color : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? "bg-white/60" : "bg-gray-100 text-gray-600"
              }`}>
                {counts[tab.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submission list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                <p className="font-medium">Geen aanmeldingen</p>
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`w-full text-left bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${
                    selected?.id === s.id ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-gray-400">{s.category}</span>
                      <p className="font-bold text-gray-900 truncate">{s.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{s.location}, {s.city}</p>
                      <p className="text-sm text-gray-400">{formatDate(s.date)}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 mt-1">
                      {new Date(s.created_at).toLocaleDateString("nl-NL")}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {s.contact_name} — {s.contact_email}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 lg:sticky lg:top-6 self-start">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-400">{selected.category}</span>
                  <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Datum</span>
                  <span className="text-gray-800 font-medium">
                    {formatDate(selected.date)}
                    {selected.end_date && ` – ${formatDate(selected.end_date)}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Locatie</span>
                  <span className="text-gray-800 font-medium">{selected.location}, {selected.city}</span>
                </div>
                {selected.ticket_url && (
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-24 shrink-0">Website</span>
                    <a href={selected.ticket_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      {selected.ticket_url}
                    </a>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Contact</span>
                  <div>
                    <p className="text-gray-800 font-medium">{selected.contact_name}</p>
                    <p className="text-gray-500">{selected.contact_email}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Beschrijving</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
              </div>

              {/* Actions */}
              {selected.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => updateStatus(selected.id, "approved")}
                    disabled={loadingId === selected.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Goedkeuren
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "rejected")}
                    disabled={loadingId === selected.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Afwijzen
                  </button>
                </div>
              )}

              {selected.status === "approved" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dit evenement is goedgekeurd
                </div>
              )}

              {selected.status === "rejected" && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Dit evenement is afgewezen
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex bg-white rounded-2xl border border-gray-100 p-10 items-center justify-center text-gray-300">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">Selecteer een aanmelding</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
