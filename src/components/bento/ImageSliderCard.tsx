import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { bg: "from-primary/40 to-emerald-deep/60", emoji: "💎", label: "Lục bảo" },
  { bg: "from-neon/30 to-primary/40", emoji: "🌌", label: "Vũ trụ" },
  { bg: "from-emerald-deep/50 to-neon/20", emoji: "🔮", label: "Pha lê" },
  { bg: "from-primary/30 to-emerald-deep/40", emoji: "✨", label: "Ma thuật" },
];

const ImageSliderCard = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((idx: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(idx);
      setFade(true);
    }, 200);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className={`flex flex-1 items-center justify-center bg-gradient-to-br ${slides[current].bg} transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        <span className="text-6xl md:text-7xl">{slides[current].emoji}</span>
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full transition-all ${i === current ? "w-5 bg-primary" : "bg-primary/30"}`}
          />
        ))}
      </div>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/70 p-1 backdrop-blur-sm hover:bg-card">
        <ChevronLeft className="h-4 w-4 text-foreground" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/70 p-1 backdrop-blur-sm hover:bg-card">
        <ChevronRight className="h-4 w-4 text-foreground" />
      </button>
      <div className="absolute left-3 top-3 rounded-full bg-card/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
        {slides[current].label}
      </div>
    </div>
  );
};

export default ImageSliderCard;
