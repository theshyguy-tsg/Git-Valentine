import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import useSfx from "@/hooks/useSfx";

interface Props {
  onConnect: (name: string) => void;
}

const PhaseInput = ({ onConnect }: Props) => {
  const [name, setName] = useState("");
  const { play } = useSfx();

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-8 px-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-16 w-16 text-primary fill-primary/20" />
        </motion.div>
        <h1 className="neon-text text-4xl font-black tracking-wider text-primary text-center">
          Đại Tiệc<br/>Trái Tim
        </h1>
        <p className="text-sm text-muted-foreground">✦ Cho xin quý danh nè ✦</p>
      </div>

      {/* Input */}
      <div className="flex w-full max-w-xs flex-col gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onConnect(name.trim())}
          placeholder="Nhập tên của bé iuuu..."
          className="glass w-full rounded-xl border border-primary/20 bg-transparent px-4 py-3 text-center text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => { if (name.trim()) { play("chime"); onConnect(name.trim()); } }}
          disabled={!name.trim()}
          className="animate-pulse-glow w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-40 disabled:shadow-none"
        >
          Vô thuiiii ✨
        </motion.button>
      </div>
    </motion.div>
  );
};

export default memo(PhaseInput);
