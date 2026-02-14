import { useState, memo } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import useSfx from "@/hooks/useSfx";

interface Props {
  onComplete: () => void;
}

const PhaseFlipCard = ({ onComplete }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { play } = useSfx();

  const flipCard = () => {
    play("pop");
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-6 px-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-foreground mb-1">Ấn Tượng Đầu vs. Bi Giờ Nè 💭</h2>
        <p className="text-xs text-muted-foreground">Chọt zô thẻ để lật xem nha</p>
      </div>

      <div className="perspective-1000 w-full max-w-sm">
        <motion.div
          className="relative h-64 w-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Card - First Impression */}
          <div
            className="glass absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl p-6 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Hồi mới gặp</p>
              <h3 className="text-lg font-bold text-foreground mb-3">Ấn Tượng Ban Đầu</h3>
              <div className="space-y-2 text-sm text-foreground/80">
                <p>• Nhìn lạnh lùng, khó gần xỉu</p>
                <p>• Tưởng chảnh chọe, hông dễ làm quen</p>
                <p>• Tưởng đâu hông hợp miếng nào</p>
              </div>
            </div>
          </div>

          {/* Back Card - Now */}
          <div
            className="glass absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl p-6 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Bi giờ nè</p>
              <h3 className="text-lg font-bold text-primary mb-3">Sự Thật Là</h3>
              <div className="space-y-2 text-sm text-foreground/80">
                <p>• Siu lầy lội, cười xinh xỉu</p>
                <p>• Cực kỳ quan tâm ngừi ta lun</p>
                <p>• Dễ thương & đáng iu vô cùng tận 💚</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={flipCard}
        className="flex items-center gap-2 rounded-xl border border-primary/30 px-6 py-2 text-sm text-primary"
      >
        <RefreshCw className="h-4 w-4" />
        {isFlipped ? "Xem lại hồi xưa" : "Lật qua nà"}
      </motion.button>

      {isFlipped && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.93 }}
          onClick={onComplete}
          className="rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground"
        >
          Tiếp tục thuiii ✨
        </motion.button>
      )}
    </motion.div>
  );
};

export default memo(PhaseFlipCard);
