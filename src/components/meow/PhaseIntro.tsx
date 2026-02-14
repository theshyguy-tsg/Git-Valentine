import { memo } from "react";
import { motion } from "framer-motion";
import { Cat, MessageCircle, Heart } from "lucide-react";

interface Props {
  name: string;
  isReplay?: boolean;
  onGo: () => void;
}

const PhaseIntro = ({ name, isReplay, onGo }: Props) => {
  return (
    <motion.div
      className="relative flex h-full flex-col items-center justify-center gap-6 px-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Distance Bridge Background */}
      <div className="pointer-events-none absolute inset-x-6 top-16">
        <div className="relative flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Anh</span>
          <div className="absolute inset-x-8 top-1/2 border-t border-dashed border-primary/30" />
          {/* Flying heart */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ willChange: "transform" }}
            animate={{ left: ["10%", "85%", "10%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-3 w-3 fill-accent text-accent" />
          </motion.div>
          <span className="text-xs text-muted-foreground">Em</span>
        </div>
        <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">
          Khoảng cách: 0km (trong tim) 💚
        </p>
      </div>

      {/* Cat avatar */}
      <motion.div
        className="neon-border flex h-24 w-24 items-center justify-center rounded-full bg-card/60"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      >
        <Cat className="h-12 w-12 text-primary" />
      </motion.div>

      {/* Chat bubble */}
      <motion.div
        className="glass relative max-w-xs rounded-2xl px-5 py-4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3, type: "spring" }}
      >
        <MessageCircle className="absolute -top-2 left-6 h-5 w-5 rotate-180 text-primary/20" />
        <p className="text-sm leading-relaxed text-foreground">
          {isReplay ? (
            <>Chào mừng bé <span className="font-bold text-primary">{name}</span> đã quay lại! 🐱✨<br />Nhớ anh quá hả? Chơi lại nào!</>
          ) : (
            <>Chào mừng bé <span className="font-bold text-primary">{name}</span>! 🐱✨<br />Sẵn sàng chưa nàooo?</>
          )}
        </p>
      </motion.div>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        onClick={onGo}
        className="animate-pulse-glow rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground"
      >
        {isReplay ? "Chơi lại! 🔄" : "BẮT ĐẦU HOI 🪄"}
      </motion.button>
    </motion.div>
  );
};

export default memo(PhaseIntro);
