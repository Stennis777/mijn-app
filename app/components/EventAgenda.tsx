"use client";

import { useState } from "react";
import Link from "next/link";
import { Event } from "@/lib/events";

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

  const filtered = query.trim()
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.city.toLowerCase().includes(query.toLowerCase()) ||
          e.location.toLowerCase().includes(query.toLowerCase()) ||
          e.description.toLowerCase().includes(query.toLowerCase()) ||
          e.category.toLowerCase().includes(query.toLowerCase())
      )
    : events;

  return (
    <div>
      {/* Search bar */}
      <div className="mb-10">
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
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
        {query && (
          <p className="mt-2 text-sm text-gray-500">
            {filtered.length} resultaat{filtered.length !== 1 ? "en" : ""} voor &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Agenda list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Geen evenementen gevonden</p>
          <p className="text-sm mt-1">Probeer een andere zoekterm</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden"
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
              <div className="flex flex-col justify-center py-4 pr-6 sm:py-6 pl-2 sm:pl-0 flex-1">
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

              {/* Arrow */}
              <div className="hidden sm:flex items-center pr-6 text-gray-300 group-hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
