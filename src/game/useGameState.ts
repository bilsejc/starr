import { useCallback, useEffect, useState } from "react";
import type { Section, StarState } from "./types";
import { DEFAULT_SECTIONS, TOTAL_STARS } from "./defaultSections";

const LS_SECTIONS = "cosmos.sections.v2";
const LS_STARS = "cosmos.stars.v2";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateStars(sections: Section[]): StarState[] {
  // Build assignment pool from slots, fill remaining with first section if mismatch
  const pool: string[] = [];
  sections.forEach((s) => {
    for (let i = 0; i < s.slots; i++) pool.push(s.id);
  });
  while (pool.length < TOTAL_STARS) pool.push(sections[0]?.id ?? "s1");
  if (pool.length > TOTAL_STARS) pool.length = TOTAL_STARS;
  const shuffled = shuffle(pool);

  // Layout: 4x4 grid with jitter
  const stars: StarState[] = [];
  const cols = 4;
  const rows = 4;
  for (let i = 0; i < TOTAL_STARS; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = ((c + 0.5) / cols) * 100 + (Math.random() - 0.5) * 8;
    const y = ((r + 0.5) / rows) * 100 + (Math.random() - 0.5) * 8;
    stars.push({
      id: i,
      sectionId: shuffled[i],
      used: false,
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(12, Math.min(88, y)),
      size: 90 + Math.random() * 40,
      hue: Math.random() * 60 - 30,
    });
  }
  return stars;
}

export function useGameState() {
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const raw = localStorage.getItem(LS_SECTIONS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_SECTIONS;
  });

  const [stars, setStars] = useState<StarState[]>(() => {
    try {
      const raw = localStorage.getItem(LS_STARS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === TOTAL_STARS) return parsed;
      }
    } catch {}
    return generateStars(DEFAULT_SECTIONS);
  });

  useEffect(() => {
    localStorage.setItem(LS_SECTIONS, JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem(LS_STARS, JSON.stringify(stars));
  }, [stars]);

  const markUsed = useCallback((id: number) => {
    setStars((prev) => prev.map((s) => (s.id === id ? { ...s, used: true } : s)));
  }, []);

  const resetGame = useCallback(() => {
    setStars((prev) => prev.map((s) => ({ ...s, used: false })));
  }, []);

  const updateSections = useCallback((next: Section[]) => {
    setSections(next);
    setStars(generateStars(next));
  }, []);

  const sectionById = useCallback(
    (id: string | null) => sections.find((s) => s.id === id) ?? null,
    [sections]
  );

  const remaining = stars.filter((s) => !s.used).length;
  const allDone = remaining === 0;

  return {
    sections,
    stars,
    markUsed,
    resetGame,
    updateSections,
    sectionById,
    remaining,
    allDone,
  };
}
