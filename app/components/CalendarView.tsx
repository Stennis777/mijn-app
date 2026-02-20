"use client";

import { useState } from "react";
import Link from "next/link";
import { Event } from "@/lib/events";
import { useFavorites } from "@/app/hooks/useFavorites";

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const CATEGORY_COLORS: Record<string, string> = {
  "Conferentie": "bg-blue-500",
  "Congres & Vakbeurs": "bg-purple-500",
  "Hackathon": "bg-green-500",
};

function getColor(category: string) {
  return CATEGORY_COLORS[category] ?? "bg-gray-500";
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0 = Sunday ... convert to Monday-based (0 = Monday)
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function CalendarView({ events }: { events: Event[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { toggle, isFavorite } = useFavorites();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthName = new Date(year, month, 1).toLocaleDateString("nl-NL", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    setSelectedDay(null);
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    setSelectedDay(null);
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function getEventsForDay(day: number) {
    return events.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  // Build calendar grid: empty cells + day cells
  const totalCells = firstDay + daysInMonth;
  const rows = Math.ceil(totalCells / 7);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-bold text-gray-900 capitalize">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: rows * 7 }).map((_, i) => {
            const day = i - firstDay + 1;
            const isValidDay = day >= 1 && day <= daysInMonth;
            const dayEvents = isValidDay ? getEventsForDay(day) : [];
            const isToday =
              isValidDay &&
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const isSelected = isValidDay && day === selectedDay;

            return (
              <div
                key={i}
                onClick={() => isValidDay && dayEvents.length > 0 && setSelectedDay(day === selectedDay ? null : day)}
                className={`min-h-[80px] p-1.5 border-b border-r border-gray-50 transition-colors ${
                  isValidDay && dayEvents.length > 0 ? "cursor-pointer hover:bg-blue-50/50" : ""
                } ${isSelected ? "bg-blue-50" : ""} ${!isValidDay ? "bg-gray-50/50" : ""}`}
              >
                {isValidDay && (
                  <>
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${
                      isToday ? "bg-blue-600 text-white" : "text-gray-700"
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((e) => (
                        <div
                          key={e.slug}
                          className={`text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${getColor(e.category)}`}
                          title={e.title}
                        >
                          <span className="truncate">{e.title}</span>
                          {isFavorite(e.slug) && (
                            <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-400 pl-1">+{dayEvents.length - 2} meer</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(CATEGORY_COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-6">
          <h4 className="text-base font-bold text-gray-900 mb-3">
            Events op {selectedDay} {new Date(year, month, 1).toLocaleDateString("nl-NL", { month: "long" })}
          </h4>
          <div className="space-y-3">
            {selectedEvents.map((event) => (
              <div key={event.slug} className="flex items-center gap-2 group">
                <Link
                  href={`/events/${event.slug}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-4 flex-1 min-w-0"
                >
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${getColor(event.category)}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-gray-400">{event.category}</span>
                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <button
                  onClick={() => toggle(event.slug)}
                  className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                    isFavorite(event.slug)
                      ? "text-red-500 bg-red-50 border-red-200 hover:bg-red-100"
                      : "text-gray-300 bg-white border-gray-100 shadow-sm hover:text-red-400 hover:bg-red-50 hover:border-red-200"
                  }`}
                  title={isFavorite(event.slug) ? "Verwijder van wishlist" : "Voeg toe aan wishlist"}
                >
                  <svg className="w-5 h-5" fill={isFavorite(event.slug) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
