import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import useSfx from "@/hooks/useSfx";

interface Props {
  name: string;
  onComplete: () => void;
}

// Same date as PhaseTimeline
const MEETING_DATE = new Date(2025, 11, 20);

const PhaseStarMap = ({ name, onComplete }: Props) => {
  const [starsVisible, setStarsVisible] = useState(false);
  const { play } = useSfx();

  useEffect(() => {
    setTimeout(() => {
      setStarsVisible(true);
      play("chime");
    }, 500);
  }, [play]);

  // Generate star positions for constellation (forming name initials or heart shape)
  const generateStars = () => {
    const stars = [];
    // Heart shape constellation
    const heartPoints = [
      { x: 50, y: 30 },
      { x: 45, y: 35 },
      { x: 55, y: 35 },
      { x: 40, y: 40 },
      { x: 60, y: 40 },
      { x: 50, y: 45 },
      { x: 45, y: 50 },
      { x: 55, y: 50 },
      { x: 50, y: 55 },
    ];
    
    heartPoints.forEach((point, i) => {
      stars.push({
        id: i,
        x: point.x + (Math.random() - 0.5) * 5,
        y: point.y + (Math.random() - 0.5) * 5,
        delay: i * 0.1,
      });
    });
    
    return stars;
  };

  const stars = generateStars();

  return (
    <motion.div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Starry background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <Sparkles className="h-10 w-10 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Bản Đồ Sao Của Tụi Mình 🌌</h2>
        
        {/* Constellation */}
        <div className="relative h-64 w-full max-w-sm">
          <svg className="absolute inset-0 h-full w-full">
            {starsVisible &&
              stars.map((star, i) => {
                if (i < stars.length - 1) {
                  const nextStar = stars[i + 1];
                  return (
                    <motion.line
                      key={`line-${i}`}
                      x1={`${star.x}%`}
                      y1={`${star.y}%`}
                      x2={`${nextStar.x}%`}
                      y2={`${nextStar.y}%`}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-primary/30"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: star.delay }}
                    />
                  );
                }
                return null;
              })}
          </svg>
          
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute h-3 w-3 rounded-full bg-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: star.delay, duration: 0.5 }}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 10px currentColor",
              }}
            />
          ))}
        </div>

        <div className="glass rounded-2xl p-6 max-w-md">
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">
            Vũ trụ đã sắp đặt để anh gặp em vào ngày{" "}
            <span className="font-bold text-primary">
              {MEETING_DATE.toLocaleDateString("vi-VN")}
            </span>
            .
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Chòm sao này được tạo nên từ những khoảnh khắc đẹp nhất của tụi mình. Mỗi ngôi sao là một kỷ niệm, mỗi đường nối là một câu chuyện. ✨
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onComplete}
          className="rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground"
        >
          Tiếp tục ✨
        </motion.button>
      </div>
    </motion.div>
  );
};

export default memo(PhaseStarMap);
