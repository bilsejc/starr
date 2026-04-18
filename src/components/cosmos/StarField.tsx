import { useMemo } from "react";

interface BgStar {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  hue: number;
}

export const StarField = ({ count = 60 }: { count?: number }) => {
  const stars = useMemo<BgStar[]>(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      delay: Math.random() * 4,
      duration: 2.5 + Math.random() * 3,
      hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 320 : 190) : 50,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* Static nebula glows — no animation, single big blurred layer */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, hsl(290 80% 50% / 0.4), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, hsl(190 90% 50% / 0.3), transparent 70%)" }}
      />

      {/* Twinkling background stars — no box-shadow, opacity-only animation */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full star-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: `hsl(${s.hue} 100% 90%)`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            willChange: "opacity",
          }}
        />
      ))}

      {/* Single shooting star */}
      <div
        className="absolute h-[2px] w-32 rounded-full"
        style={{
          top: "20%",
          background: "linear-gradient(to right, transparent, hsl(50 100% 90%), transparent)",
          animation: "shooting-star 10s linear infinite",
          animationDelay: "3s",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
};
