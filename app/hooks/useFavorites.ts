"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "event-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  function toggle(slug: string) {
    setFavorites((prev) => {
      const updated = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function isFavorite(slug: string) {
    return favorites.includes(slug);
  }

  return { favorites, toggle, isFavorite };
}
