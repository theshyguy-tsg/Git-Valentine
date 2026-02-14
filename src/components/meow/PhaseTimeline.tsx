import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Clock, Heart } from "lucide-react";

interface Props {
  onNext: () => void;
}

// Configurable start date - Ngày đầu tiên hai bạn nói chuyện/gặp gỡ
// Format: Year, Month - 1, Day (Tháng trong JS tính từ 0)
// Ví dụ: 20/12/2025 -> new Date(2025, 11, 20)
const START_DATE = new Date(2026, 0, 16); // Thay đổi ngày này theo ngày thực tế

const calcDiff = () => {
  const now = new Date();
  let diff = now.getTime() - START_DATE.getTime();
  if (diff < 0) diff = 0;
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const totalDays = Math.floor(diff / 86400000);
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  return { years, months, days, hours, minutes, seconds };
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <motion.span
      key={value}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="neon-text text-2xl font-black tabular-nums text-primary"
    >
      {String(value).padStart(2, "0")}
    </motion.span>
    <span className="text-[0.6rem] text-muted-foreground">{label}</span>
  </div>
);

const PhaseTimeline = ({ onNext }: Props) => {
  const [time, setTime] = useState(calcDiff);

  useEffect(() => {
    const id = setInterval(() => setTime(calcDiff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-6 px-5"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Heart className="h-8 w-8 fill-accent text-accent" />

      <p className="text-center text-sm text-foreground/80">
        Hành Trình Iu Thương Của Tụi Mình 🌿
      </p>
      <p className="text-xs text-muted-foreground">
        Từ cái ngày định mệnh ấy:
      </p>
      <p className="text-xs text-primary/60 mt-1">
        {START_DATE.toLocaleDateString("vi-VN")}
      </p>

      {/* Live counter */}
      <div className="glass rounded-2xl px-5 py-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 justify-center">
          <Clock className="h-3 w-3" />
          <span>Đã dính nhau được</span>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <TimeUnit value={time.years} label="Năm" />
          <TimeUnit value={time.months} label="Tháng" />
          <TimeUnit value={time.days} label="Ngày" />
          <TimeUnit value={time.hours} label="Giờ" />
          <TimeUnit value={time.minutes} label="Phút" />
          <TimeUnit value={time.seconds} label="Giây" />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onNext}
        className="rounded-xl border border-primary/30 px-8 py-3 font-medium text-primary transition-colors hover:bg-primary/10"
      >
        Đọc thư tình nà →
      </motion.button>
    </motion.div>
  );
};

export default memo(PhaseTimeline);
