import artTherapy from "@/assets/sections/art_therapy.jpeg";
import magicFoam from "@/assets/sections/magic_foam.jpeg";
import steam from "@/assets/sections/steam.jpeg";
import singAndDance from "@/assets/sections/sing_and_dance.jpeg";
import aviaTour from "@/assets/sections/avia_tour.jpeg";
import pottery from "@/assets/sections/pottery.jpeg";
import book from "@/assets/sections/book.jpeg";
import sandTherapy from "@/assets/sections/sand_therapy.jpeg";
import type { Section } from "./types";

// EDIT HERE: change names and slot counts. Sum of slots should equal 16 (TOTAL_STARS).
export const DEFAULT_SECTIONS: Section[] = [
  { id: "s1", name: "Арт терапиясы", slots: 2, image: artTherapy },
  { id: "s2", name: "Magic foam", slots: 1, image: magicFoam },
  { id: "s3", name: "STEAM", slots: 5, image: steam },
  { id: "s4", name: "Мен әншімін, мен бишімін", slots: 2, image: singAndDance },
  { id: "s5", name: "Авиатур", slots: 1, image: aviaTour },
  { id: "s6", name: "Қыш өнері", slots: 2, image: pottery },
  { id: "s7", name: "Кітап", slots: 1, image: book },
  { id: "s8", name: "Құм терапиясы", slots: 2, image: sandTherapy },
];

export const TOTAL_STARS = 16;
