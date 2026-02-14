import { useState, useCallback, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSfx from "@/hooks/useSfx";

interface Props {
  onComplete: () => void;
}

interface Ingredient {
  id: number;
  emoji: string;
  name: string;
  x: number;
  y: number;
  collected: boolean;
}

const INGREDIENTS = [
  { emoji: "🍵", name: "Matcha" },
  { emoji: "🍓", name: "Dâu tây" },
  { emoji: "🍫", name: "Chocolate" },
  { emoji: "💎", name: "Kim cương" },
  { emoji: "✨", name: "Sao" },
  { emoji: "🌙", name: "Trăng" },
  { emoji: "💚", name: "Trái tim xanh" },
  { emoji: "🎁", name: "Quà" },
];

const PhaseMiniGame = ({ onComplete }: Props) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const ingredientIdRef = useRef(0);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval>>();
  const gameTimerRef = useRef<ReturnType<typeof setInterval>>();
  const { play } = useSfx();

  const TARGET_COUNT = 15;
  const GAME_DURATION = 30; // seconds

  // Spawn ingredients randomly
  useEffect(() => {
    if (!isPlaying) return;

    const spawnIngredient = () => {
      const randomIngredient = INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)];
      const newIngredient: Ingredient = {
        id: ingredientIdRef.current++,
        emoji: randomIngredient.emoji,
        name: randomIngredient.name,
        x: Math.random() * 80 + 10, // 10-90%
        y: Math.random() * 60 + 20, // 20-80%
        collected: false,
      };
      setIngredients((prev) => [...prev, newIngredient]);

      // Remove after 3 seconds if not collected
      setTimeout(() => {
        setIngredients((prev) => prev.filter((ing) => ing.id !== newIngredient.id));
      }, 3000);
    };

    spawnIngredient(); // Spawn immediately
    spawnTimerRef.current = setInterval(spawnIngredient, 1500); // Spawn every 1.5s

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying]);

  // Game timer
  useEffect(() => {
    if (!isPlaying) return;

    gameTimerRef.current = setInterval(() => {
      setGameTime((prev) => {
        if (prev >= GAME_DURATION) {
          setIsPlaying(false);
          return GAME_DURATION;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPlaying]);

  // Check win condition
  useEffect(() => {
    if (collectedCount >= TARGET_COUNT) {
      setIsPlaying(false);
      play("success");
      setTimeout(() => onComplete(), 1000);
    }
  }, [collectedCount, onComplete, play]);

  // Check lose condition
  useEffect(() => {
    if (!isPlaying && collectedCount < TARGET_COUNT && gameTime >= GAME_DURATION) {
      // Game over - still complete to continue
      setTimeout(() => onComplete(), 2000);
    }
  }, [isPlaying, collectedCount, gameTime, onComplete]);

  const collectIngredient = useCallback(
    (id: number) => {
      if (!isPlaying) return;

      setIngredients((prev) =>
        prev.map((ing) => {
          if (ing.id === id && !ing.collected) {
            play("pop");
            setCollectedCount((c) => c + 1);
            return { ...ing, collected: true };
          }
          return ing;
        })
      );

      // Remove collected ingredient after animation
      setTimeout(() => {
        setIngredients((prev) => prev.filter((ing) => ing.id !== id || !ing.collected));
      }, 300);
    },
    [isPlaying, play]
  );

  const progress = Math.min(100, (collectedCount / TARGET_COUNT) * 100);
  const timeLeft = Math.max(0, GAME_DURATION - gameTime);

  return (
    <motion.div
      className="relative flex h-full flex-col overflow-hidden px-4 py-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold text-foreground">Gom đồ nghề thuiiii! 🎯</h2>
        <p className="text-xs text-muted-foreground">Chọt chọt zô mấy cái hình để lụm nha</p>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-card/40 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Đã gom đc</p>
            <p className="text-lg font-bold text-primary">
              {collectedCount}/{TARGET_COUNT}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Time còn lại</p>
            <p className="text-lg font-bold text-primary">{timeLeft}s</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="progress-glow h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Game area */}
      <div className="relative flex-1 overflow-hidden rounded-xl border border-primary/20 bg-card/20">
        <AnimatePresence>
          {ingredients.map((ingredient) => (
            <motion.button
              key={ingredient.id}
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={
                ingredient.collected
                  ? { scale: 0, opacity: 0, rotate: 180, y: ingredient.y - 50 }
                  : { scale: 1, opacity: 1, rotate: 0 }
              }
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 1.2 }}
              onClick={() => collectIngredient(ingredient.id)}
              disabled={ingredient.collected || !isPlaying}
              className="absolute z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-card/80 text-2xl backdrop-blur-sm transition-all hover:border-primary/60 hover:bg-primary/20 active:scale-110 disabled:pointer-events-none"
              style={{
                left: `${ingredient.x}%`,
                top: `${ingredient.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {ingredient.emoji}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Background hint */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-6xl opacity-5">🍵</p>
        </div>
      </div>

      {/* Game over / Win message */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            {collectedCount >= TARGET_COUNT ? (
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="neon-text text-lg font-bold text-primary"
              >
                Xong rùi nè! 🎉 Gom đủ đồ nghề ùi á!
              </motion.p>
            ) : (
              <motion.p className="text-sm text-muted-foreground">
                Hết giờ rùi! Gom đc {collectedCount}/{TARGET_COUNT} món à 😢
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(PhaseMiniGame);
