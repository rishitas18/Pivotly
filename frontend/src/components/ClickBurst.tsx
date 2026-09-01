import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ACCENT_PALETTE } from "./primitives";

interface Particle {
  id: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  delay: number;
  shape: "dot" | "squiggle";
}

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, label, [role="button"], [data-no-burst]';

let burstCounter = 0;
let particleCounter = 0;

function makeParticles(): Particle[] {
  const count = 7 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 34 + Math.random() * 48;
    const color = ACCENT_PALETTE[Math.floor(Math.random() * ACCENT_PALETTE.length)].bg;
    return {
      id: particleCounter++,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: 5 + Math.random() * 6,
      color,
      delay: Math.random() * 60,
      shape: Math.random() < 0.25 ? "squiggle" : "dot",
    };
  });
}

function Squiggle({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size * 2.4} height={size * 1.4} viewBox="0 0 24 14" fill="none">
      <path
        d="M1 7c2-6 4-6 6 0s4 6 6 0 4-6 6 0 4 6 4 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClickBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) return;

      const id = burstCounter++;
      setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY, particles: makeParticles() }]);

      const t = window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 850);
      timeouts.current.push(t);
    }

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {bursts.map((burst) => (
        <div key={burst.id} style={{ position: "absolute", left: burst.x, top: burst.y }}>
          {burst.particles.map((p) => (
            <span
              key={p.id}
              className="burst-particle"
              style={
                {
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  animationDelay: `${p.delay}ms`,
                } as CSSProperties
              }
            >
              {p.shape === "dot" ? (
                <span
                  style={{
                    display: "block",
                    width: p.size,
                    height: p.size,
                    borderRadius: "9999px",
                    backgroundColor: p.color,
                  }}
                />
              ) : (
                <Squiggle color={p.color} size={p.size} />
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
