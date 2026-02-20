"use client";

import { useState } from "react";
import Link from "next/link";
import { Event } from "@/lib/events";
import { useFavorites } from "@/app/hooks/useFavorites";
import CalendarView from "@/app/components/CalendarView";

function formatDate(dateStr: string, endDateStr?: string) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formatted = date.toLocaleDateString("nl-NL", options);
  if (endDateStr && endDateStr !== dateStr) {
    const endDate = new Date(endDateStr);
    const endFormatted = endDate.toLocaleDateString("nl-NL", options);
    return `${formatted} – ${endFormatted}`;
  }
  return formatted;
}

export default function EventAgenda({ events }: { events: Event[] }) {
  const [query, setQuery] = useState("");
  const [showWishlist, setShowWishlist] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const { toggle, isFavorite, favorites } = useFavorites();

  const searched = query.trim()
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.city.toLowerCase().includes(query.toLowerCase()) ||
          e.location.toLowerCase().includes(query.toLowerCase()) ||
          e.description.toLowerCase().includes(query.toLowerCase()) ||
          e.category.toLowerCase().includes(query.toLowerCase())
      )
    : events;

  const filtered = showWishlist
    ? searched.filter((e) => isFavorite(e.slug))
    : searched;

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Zoek op evenement, stad of categorie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* View toggle + Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Tabs */}
        <div className="flex gap-2">
        <button
          onClick={() => setShowWishlist(false)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !showWishlist
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          Alle events
        </button>
        <button
          onClick={() => setShowWishlist(true)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showWishlist
              ? "bg-red-500 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={showWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Mijn wishlist
          {favorites.length > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${showWishlist ? "bg-white/20" : "bg-red-100 text-red-600"}`}>
              {favorites.length}
            </span>
          )}
        </button>
      </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Lijst
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === "calendar" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Kalender
          </button>
        </div>
      </div>

      {/* Result count */}
      {query && view === "list" && (
        <p className="mb-4 text-sm text-gray-500">
          {filtered.length} resultaat{filtered.length !== 1 ? "en" : ""} voor &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Calendar view */}
      {view === "calendar" && (
        <CalendarView events={showWishlist ? events.filter((e) => isFavorite(e.slug)) : events} />
      )}

      {/* Agenda list */}
      {view === "list" && (filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={showWishlist ? "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" : "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} />
          </svg>
          <p className="text-lg font-medium">
            {showWishlist ? "Nog geen events op je wishlist" : "Geen evenementen gevonden"}
          </p>
          <p className="text-sm mt-1">
            {showWishlist ? "Geef een event een hartje om het hier te bewaren" : "Probeer een andere zoekterm"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((event) => (
            <div key={event.slug} className="relative group">
              <Link
                href={`/events/${event.slug}`}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden"
              >
                {/* Date block */}
                <div className="flex sm:flex-col items-center sm:items-center justify-start sm:justify-center bg-blue-50 px-6 py-4 sm:py-6 sm:min-w-[100px] gap-3 sm:gap-0">
                  <span className="text-3xl sm:text-4xl font-bold text-blue-600 leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <div className="flex flex-col sm:items-center">
                    <span className="text-sm font-semibold text-blue-500 uppercase tracking-wide">
                      {new Date(event.date).toLocaleDateString("nl-NL", { month: "short" })}
                    </span>
                    <span className="text-sm text-blue-400">
                      {new Date(event.date).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center py-4 pr-12 sm:py-6 pl-2 sm:pl-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.date, event.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </div>
              </Link>

              {/* Heart button */}
              <button
                onClick={() => toggle(event.slug)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                  isFavorite(event.slug)
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "text-gray-300 bg-white hover:text-red-400 hover:bg-red-50 shadow-sm border border-gray-100"
                }`}
                title={isFavorite(event.slug) ? "Verwijder van wishlist" : "Voeg toe aan wishlist"}
              >
                <svg
                  className="w-5 h-5"
                  fill={isFavorite(event.slug) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
