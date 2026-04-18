import { forwardRef, useId, memo } from "react";

interface StarShapeProps {
  size?: number;
  color?: string;
  glowColor?: string;
  className?: string;
}

// 5-point star SVG with gradient + light glow. Plain SVG (no framer-motion) for perf.
export const StarShape = memo(
  forwardRef<SVGSVGElement, StarShapeProps>(
    ({ size = 100, color = "hsl(45 100% 60%)", glowColor = "hsl(290 80% 60%)", className = "" }, ref) => {
      const rawId = useId();
      const gradId = `star-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
      return (
        <svg
          ref={ref}
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={className}
          style={{
            filter: `drop-shadow(0 0 ${size * 0.12}px ${color})`,
            willChange: "transform",
          }}
        >
          <defs>
            <radialGradient id={gradId} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="hsl(50 100% 96%)" />
              <stop offset="40%" stopColor={color} />
              <stop offset="100%" stopColor="hsl(30 100% 45%)" />
            </radialGradient>
          </defs>
          <path
            d="M50 5 L61 38 L96 38 L67 58 L78 92 L50 72 L22 92 L33 58 L4 38 L39 38 Z"
            fill={`url(#${gradId})`}
            stroke="hsl(50 100% 85%)"
            strokeWidth="1"
          />
        </svg>
      );
    }
  )
);
StarShape.displayName = "StarShape";
