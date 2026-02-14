import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import confetti from "canvas-confetti";
import useSfx from "@/hooks/useSfx";

const rewards = [
  "Chúc bạn may mắn lần sau",
  "Một món quà bí mật đang chờ em 🎁",
  "Phiếu trúng thưởng 50k 💆‍♀️",
  "1 Ly matcha siu cutecute! 🧋",
  "Chỉ định làm đồ handmade 🫂",
  "Gửi 1 voice note hát một đoạn bài hát bất kỳ",
  "Quyền đổi biệt danh cho anh ✨",
];

const captions = [
  "Đang lắc... 🌀",
  "Hộp gì đây ta... 🤔",
  "Sắp ra rồi... 💓",
  "Úm ba la... ✨",
  "Woa... 😲",
];

interface Props {
  onNext: () => void;
}

const PhaseGacha = ({ onNext }: Props) => {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<string | null>(null);
  const [captionIndex, setCaptionIndex] = useState(0);
  const { play } = useSfx();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (spinning) {
      interval = setInterval(() => {
        setCaptionIndex((prev) => (prev + 1) % captions.length);
      }, 500);
    } else {
      setCaptionIndex(0);
    }
    return () => clearInterval(interval);
  }, [spinning]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    play("spin");

    setTimeout(() => {
      const r = rewards[Math.floor(Math.random() * rewards.length)];
      setReward(r);
      setSpinning(false);
      play("reward");

      // Confetti!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF69B4", "#00FFFF", "#FFFFFF"],
      });
    }, 2500); // Increased duration for more suspense
  };

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-8 px-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Vòng Quay May Mắn 🎰</h2>
        <p className="text-sm text-muted-foreground">
          {reward ? "Chúc mừng em yêu! 🎉" : "Thử vận may xem hôm nay nhận được gì nào?"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!reward ? (
          <motion.div
            key="gacha-machine"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Gacha Capsule Visualization */}
            <div className="relative">
              <motion.div
                className={`relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-pink-400 to-purple-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] ${spinning ? "cursor-wait" : "cursor-pointer"}`}
                animate={
                  spinning
                    ? {
                        rotate: [0, -20, 20, -20, 20, 0],
                        scale: [1, 1.05, 0.95, 1.05, 1],
                        y: [0, -10, 0, -10, 0],
                      }
                    : {
                        y: [0, -5, 0],
                      }
                }
                transition={
                  spinning
                    ? { duration: 0.5, repeat: Infinity }
                    : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }
                onClick={spin}
              >
                {/* Capsule Line */}
                <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-white/30" />
                <div className="absolute inset-0 rounded-full border-b-4 border-black/10" />
                
                {/* Shine effect */}
                <div className="absolute right-8 top-8 h-8 w-8 rounded-full bg-white/40 blur-sm" />

                <Star className="h-16 w-16 text-white drop-shadow-md" fill="white" />
              </motion.div>

              {/* Interaction Hint */}
              {!spinning && (
                <motion.div
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-background/80 px-4 py-1 text-xs text-muted-foreground backdrop-blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Chạm vào để quay
                </motion.div>
              )}
            </div>

            {/* Captions during spin */}
            <div className="h-8 text-center">
              {spinning && (
                <motion.p
                  key={captionIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-lg font-medium text-primary"
                >
                  {captions[captionIndex]}
                </motion.p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={spin}
              disabled={spinning}
              className={`mt-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-pink-500/25 disabled:opacity-70 ${
                spinning ? "animate-pulse" : "hover:-translate-y-1"
              }`}
            >
              {spinning ? "Đang quay..." : "Quay Ngay ✨"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="reward-card"
            className="flex flex-col items-center gap-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <motion.div
              className="relative flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/10 p-8 text-center backdrop-blur-md border border-white/20 shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Sparkles className="h-16 w-16 text-yellow-400" />
              </motion.div>
              
              <div>
                <p className="text-sm font-medium text-white/60 mb-2">Phần thưởng của em là</p>
                <h3 className="text-2xl font-bold text-white leading-relaxed max-w-[280px]">
                  {reward}
                </h3>
              </div>
              
              <div className="mt-2 rounded-full bg-white/20 px-4 py-1 text-xs text-white/80">
                Chụp màn hình lại để đổi quà nha! 📸
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.93 }}
              onClick={onNext}
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-purple-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Tiếp tục hành trình
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(PhaseGacha);
