import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSfx from "@/hooks/useSfx";

const STORAGE_KEYS = ["meowmagic_phase", "meowmagic_name", "meowmagic_is_replay"];

const InteractiveFooter = () => {
  const [now, setNow] = useState(new Date());
  const [hearts, setHearts] = useState<number[]>([]);
  const { play } = useSfx();

  const resetToStart = useCallback(() => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const burst = useCallback(() => {
    const ids = Array.from({ length: 5 }, () => Date.now() + Math.random());
    setHearts(ids);
    play("heartbeat");
    setTimeout(() => setHearts([]), 1200);
  }, [play]);

  const time = now.toLocaleTimeString("vi-VN");

  return (
    <div className="relative pb-safe">
      {/* Heart burst */}
      <AnimatePresence>
        {hearts.map((id, i) => (
          <motion.span
            key={id}
            className="pointer-events-none absolute bottom-6 text-accent"
            style={{ left: `${20 + i * 15}%` }}
            initial={{ scale: 0, y: 0, opacity: 1 }}
            animate={{ scale: 1.2, y: -50, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            💖
          </motion.span>
        ))}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 py-2">
        <button
          onClick={burst}
          className="text-center text-[0.6rem] text-muted-foreground/60 transition-colors hover:text-muted-foreground active:text-accent"
        >
          Đang iu bé: {time} 💚
        </button>
        <button
          type="button"
          onClick={resetToStart}
          className="text-[0.6rem] text-muted-foreground/50 underline hover:text-primary/70"
        >
          Chơi lại từ đầu nà
        </button>
      </div>
    </div>
  );
};

export default memo(InteractiveFooter);
