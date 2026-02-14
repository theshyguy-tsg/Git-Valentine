import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

interface Props {
  onDone: () => void;
}

const lines = [
  "> Đang pha chế tình yeeuu...",
  "> Thêm chút ngọt ngàooo...",
  "> XONG RÙI NÈ! ✨",
];

const PhaseLoading = ({ onDone }: Props) => {
  const [percent, setPercent] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (percent >= 33 && lineIdx < 1) setLineIdx(1);
    if (percent >= 66 && lineIdx < 2) setLineIdx(2);
    if (percent >= 100) setTimeout(onDone, 800);
  }, [percent, lineIdx, onDone]);

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-8 px-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Matcha Cup */}
      <div className="relative h-32 w-24">
        <div className="absolute bottom-0 h-28 w-full overflow-hidden rounded-b-3xl rounded-t-lg border-2 border-primary/30 bg-card/50">
          <motion.div
            className="absolute bottom-0 w-full rounded-b-2xl bg-gradient-to-t from-primary/80 to-primary/40"
            style={{ height: `${percent}%`, willChange: "height" }}
          />
          {percent > 20 && (
            <>
              <div className="absolute bottom-[30%] left-[30%] h-2 w-2 rounded-full bg-primary/40" style={{ animation: "float-up 1.5s ease-out infinite", willChange: "transform" }} />
              <div className="absolute bottom-[20%] left-[60%] h-1.5 w-1.5 rounded-full bg-primary/30" style={{ animation: "float-up 2s ease-out infinite 0.5s", willChange: "transform" }} />
            </>
          )}
        </div>
        <div className="absolute -right-3 top-8 h-10 w-5 rounded-r-full border-2 border-l-0 border-primary/30" />
        {percent > 60 && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Coffee className="h-6 w-6 animate-bounce text-primary/40" />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-48">
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div className="progress-glow h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">{percent}%</p>
      </div>

      {/* Terminal text */}
      <div className="space-y-1">
        {lines.slice(0, lineIdx + 1).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-xs text-primary/80"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

export default memo(PhaseLoading);
