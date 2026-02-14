import { memo } from "react";

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  dur: 6 + Math.random() * 8,
  size: 2 + Math.random() * 4,
  type: i < 10 ? "sparkle" : i < 20 ? "heart" : "leaf",
}));

const BackgroundParticles = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    {particles.map((p) => (
      <div
        key={p.id}
        className="absolute"
        style={{
          left: `${p.left}%`,
          bottom: "-10%",
          willChange: "transform, opacity",
          animation: `particle-rise ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }}
      >
        {p.type === "sparkle" && (
          <div
            className="rounded-full bg-primary/40"
            style={{ width: p.size, height: p.size }}
          />
        )}
        {p.type === "heart" && (
          <span
            className="text-accent/30"
            style={{ fontSize: p.size * 3 }}
          >
            💚
          </span>
        )}
        {p.type === "leaf" && (
          <span
            className="text-primary/25"
            style={{
              fontSize: p.size * 2.5,
              animation: `leaf-sway ${2 + Math.random() * 2}s ease-in-out infinite`,
            }}
          >
            🍃
          </span>
        )}
      </div>
    ))}

    {/* Ambient glow orbs */}
    <div className="absolute -left-20 top-1/4 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
    <div className="absolute -right-20 top-2/3 h-32 w-32 rounded-full bg-accent/5 blur-3xl" />
    <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
  </div>
);

export default memo(BackgroundParticles);
