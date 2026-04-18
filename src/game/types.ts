export interface Section {
  id: string;
  name: string;
  slots: number;
  image: string; // url or data uri
}

export interface StarState {
  id: number;
  sectionId: string | null; // assigned section
  used: boolean;
  // visual position 0-100 (%)
  x: number;
  y: number;
  size: number; // px base
  hue: number; // tint hint
}
