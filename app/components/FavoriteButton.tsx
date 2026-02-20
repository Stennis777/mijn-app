"use client";

import { useFavorites } from "@/app/hooks/useFavorites";

export default function FavoriteButton({ slug }: { slug: string }) {
  const { toggle, isFavorite } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      onClick={() => toggle(slug)}
      className={`flex items-center gap-2 w-full justify-center py-3 px-4 rounded-xl border font-semibold transition-all duration-200 ${
        active
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {active ? "Op je wishlist" : "Voeg toe aan wishlist"}
    </button>
  );
}
