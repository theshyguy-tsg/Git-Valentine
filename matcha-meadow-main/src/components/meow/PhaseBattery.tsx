import { useState, useRef, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Battery, BatteryLow, BatteryFull, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import useSfx from "@/hooks/useSfx";

interface Props {
  onComplete: () => void;
}

const PhaseBattery = ({ onComplete }: Props) => {
  const [charge, setCharge] = useState(15);
  const [isCharging, setIsCharging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const chargeIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const { play } = useSfx();


  useEffect(() => {
    if (charge >= 100 && !isCompleted) {
      setIsCompleted(true);
      setIsCharging(false);
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
      
      play("success");
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#00FF41", "#FF4081", "#FFFFFF"],
      });
      setTimeout(onComplete, 2000);
    }
  }, [charge, isCompleted, onComplete, play]);

  const startCharging = () => {
    if (isCharging || charge >= 100 || isCompleted) return;
    
    setIsCharging(true);
    play("pop");

    chargeIntervalRef.current = setInterval(() => {
      setCharge((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);
  };

  const stopCharging = () => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      setIsCharging(false);
    }
  };

  const getBatteryColor = () => {
    if (charge < 30) return "text-red-500";
    if (charge < 70) return "text-yellow-500";
    return "text-primary";
  };

  const BatteryIcon = () => {
    if (charge < 30) return <BatteryLow className="h-16 w-16" />;
    if (charge >= 100) return <BatteryFull className="h-16 w-16" />;
    return <Battery className="h-16 w-16" />;
  };

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-6 px-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Sạc Pin Cho Anh Iu 🔋</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Năng lượng của anh sau 1 ngày fix bug sấp mặt...
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: isCharging ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isCharging ? Infinity : 0 }}
        >
          <BatteryIcon />
        </motion.div>

        <div className="w-64">
          <div className="h-8 overflow-hidden rounded-full border-2 border-primary/30 bg-secondary">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                charge < 30 ? "bg-red-500" : charge < 70 ? "bg-yellow-500" : "bg-primary"
              }`}
              initial={{ width: "15%" }}
              animate={{ width: `${charge}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className={`text-center mt-2 text-2xl font-bold ${getBatteryColor()}`}>
            {charge}%
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={startCharging}
          onMouseUp={stopCharging}
          onMouseLeave={stopCharging}
          onTouchStart={startCharging}
          onTouchEnd={stopCharging}
          disabled={charge >= 100}
          className={`flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-lg transition-all ${
            charge >= 100
              ? "bg-primary/30 text-primary cursor-default"
              : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
          }`}
        >
          {charge >= 100 ? (
            <>
              <Heart className="h-5 w-5 fill-primary" />
              Full 100% rùi! Iu cục sạc của anh nhìu! 💚
            </>
          ) : (
            <>
              {isCharging ? "Đang sạc nà..." : "Chạm & giữ để sạc nha"}
            </>
          )}
        </motion.button>

        {charge >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -50],
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="text-2xl"
              >
                💚
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(PhaseBattery);
