import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import confetti from "canvas-confetti";
import useSfx from "@/hooks/useSfx";

interface Props {
  onComplete: () => void;
}

const TAROT_CARDS = [
  {
    name: "The Lovers",
    emoji: "💑",
    meaning: "Tình iu đắm đuối & kết nối sâu sắc nà 💖",
    message: "Lá bài bảo là hôm nay bé sẽ được anh Coder đẹp trai mời đi măm măm đó. Vũ trụ đang sắp xếp 1 buổi hẹn hò siu lãng mạn lun! ✨",
  },
  {
    name: "The Star",
    emoji: "⭐",
    meaning: "Hi vọng & điều ước thành sự thật lun nè ✨",
    message: "Ngôi sao sáng nhất đang chiếu vô bé đó. Mọi điều ước tình iu sẽ thành sự thật sớm thui! 🌟",
  },
  {
    name: "The Sun",
    emoji: "☀️",
    meaning: "Hạnh phúc & niềm vui ngập tràn lun ☀️",
    message: "Ánh mặt trời rực rỡ báo hiệu những ngày siêu vui vẻ sắp tới. Bé sẽ nhận được bao la niềm vui từ người ấy nha! 💛",
  },
];

const PhaseTarot = ({ onComplete }: Props) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const { play } = useSfx();

  const selectCard = (index: number) => {
    if (selectedCard !== null) return;
    play("chime");
    setSelectedCard(index);
    
    setTimeout(() => {
      setIsFlipped(true);
      play("whoosh");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
      });
    }, 500);
  };

  const card = selectedCard !== null ? TAROT_CARDS[selectedCard] : null;

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-6 px-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {!isFlipped ? (
        <>
          <div className="text-center">
            <Wand2 className="mx-auto h-10 w-10 text-primary mb-2" />
            <h2 className="text-xl font-bold text-foreground mb-1">Bói Bài Tarot Hum Nay Nè 🔮</h2>
            <p className="text-xs text-muted-foreground">Chọn 1 lá để xem vận mệnh của bé iuuu nha</p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {TAROT_CARDS.map((card, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectCard(index)}
                disabled={selectedCard !== null}
                className={`relative h-32 w-24 rounded-xl border-2 transition-all ${
                  selectedCard === index
                    ? "border-primary bg-primary/20 scale-110"
                    : selectedCard !== null
                    ? "border-primary/20 bg-card/40 opacity-50"
                    : "border-primary/30 bg-card/60 hover:border-primary/60 hover:bg-primary/10"
                }`}
              >
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <span className="text-4xl">{card.emoji}</span>
                  <span className="text-[0.65rem] font-medium text-foreground px-2 text-center">
                    {card.name}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          className="glass flex flex-col items-center gap-4 rounded-2xl p-6 max-w-sm"
        >
          <Sparkles className="h-12 w-12 text-accent" />
          <h3 className="text-2xl font-bold text-foreground">{card?.name}</h3>
          <div className="text-6xl mb-2">{card?.emoji}</div>
          <p className="text-xs text-muted-foreground text-center mb-2">{card?.meaning}</p>
          <div className="border-t border-primary/20 pt-4 w-full">
            <p className="text-sm text-foreground/90 text-center leading-relaxed">
              {card?.message}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onComplete}
            className="mt-4 rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground"
          >
            Tiếp tục thuiii ✨
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(PhaseTarot);
