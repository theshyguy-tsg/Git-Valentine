import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOTTIE_URL = "https://lottie.host/36610bfa-c412-4991-9ee7-ed1e1df72837/JvGGQKGBbV.json";

interface Props {
  onComplete?: () => void;
  completed?: boolean;
}

const RobotCatCard = ({ onComplete, completed = false }: Props) => {
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [showMagic, setShowMagic] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    fetch(LOTTIE_URL)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  const performMagic = () => {
    if (completed) return;
    setShowMagic(true);
    // Generate confetti particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      color: ["hsl(160,100%,50%)", "hsl(280,100%,70%)", "hsl(45,100%,60%)", "hsl(200,100%,60%)"][Math.floor(Math.random() * 4)],
      delay: Math.random() * 0.5,
    }));
    setConfetti(particles);
    setTimeout(() => {
      setConfetti([]);
      onComplete?.();
    }, 2000);
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden p-8 text-center">
      {/* Stage curtain edges */}
      <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-emerald-deep/40 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-emerald-deep/40 to-transparent" />
      <div className="absolute left-0 top-0 h-4 w-full bg-gradient-to-b from-emerald-deep/50 to-transparent" />

      {/* Spotlight effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 h-full w-32 bg-gradient-to-r from-transparent via-neon/10 to-transparent"
          style={{ animation: "spotlight 6s linear infinite" }}
        />
      </div>

      {/* Confetti */}
      {confetti.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: `${p.left}%`,
            top: "30%",
            backgroundColor: p.color,
            animation: `confetti-fall 1.5s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}

      {/* Lottie character */}
      <div className="relative">
        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-emerald-deep/30 border border-neon/20 md:h-48 md:w-48">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="h-28 w-28 md:h-40 md:w-40"
            />
          ) : (
            <div className="h-20 w-20 animate-pulse rounded-full bg-primary/20 md:h-28 md:w-28" />
          )}
        </div>
        <Sparkles className="absolute -right-2 top-2 h-6 w-6 text-neon/80 animate-pulse" />
        <Sparkles className="absolute -left-3 bottom-6 h-4 w-4 text-neon/50 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          ✨ Chào mừng đến sân khấu! 🎩
        </h2>
        <p className="text-sm text-muted-foreground">
          Nhấn nút bên dưới để xem màn ảo thuật
        </p>
      </div>

      <Button
        onClick={performMagic}
        disabled={completed}
        className={`gap-2 transition-all ${
          completed
            ? "bg-primary/30 text-primary"
            : "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(160_100%_50%/0.3)] hover:shadow-[0_0_25px_hsl(160_100%_50%/0.5)]"
        }`}
      >
        <Wand2 className="h-4 w-4" />
        {completed ? "Đã biểu diễn ✅" : "Biểu diễn ✨"}
      </Button>
    </div>
  );
};

export default RobotCatCard;
