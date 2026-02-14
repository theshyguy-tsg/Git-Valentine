import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, FlaskConical } from "lucide-react";
import useSfx from "@/hooks/useSfx";

interface Props {
  onComplete: (answers?: number[]) => void;
}

const LDR_QUIZ_DATA = [
  {
    question: "Khi nhớ nhau quá thì mình làm gì nè? 🤔",
    options: [
      "Call video ngay và luôn 📞",
      "Nghe lại voice cũ của nhau 🎧",
      "Nhắn tin spam 'Nhớ anh/em' 💬",
      "Ôm gối tưởng tượng là người ấy 🧸",
    ],
    feedback: "Cách nào cũng đáng iu hết trơn á! 💖",
  },
  {
    question: "Điều quan trọng nhất khi yêu xa là gì ta? ✨",
    options: [
      "Sự tin tưởng tuyệt đối 🤝",
      "Luôn chia sẻ mọi chuyện 🗣️",
      "Những món quà bất ngờ 🎁",
      "Tất cả những điều trên lun ✅",
    ],
    feedback: "Chính xác! Yêu xa là dũng cảm lắm đó nha! 💪",
  },
  {
    question: "Nếu một ngày tụi mình không nhắn tin được? 🥺",
    options: [
      "Lo lắng nhưng vẫn tin tưởng 🌈",
      "Suy diễn lung tung 🤯",
      "Giận dỗi không thèm nói chuyện 😤",
      "Spam tin nhắn tới tấp 📱",
    ],
    feedback: "Tin tưởng nhau là chìa khóa đó nhen! 🗝️",
  },
  {
    question: "Món quà tinh thần lớn nhất là gì nà? 🎁",
    options: [
      "Lời động viên lúc mệt mỏi 💪",
      "Sự hiện diện (dù là online) 🌐",
      "Những tấm hình dìm hàng 🤪",
      "Tình yêu chân thành ❤️",
    ],
    feedback: "Có nhau trong đời là món quà lớn nhất rùi! 🥰",
  },
  {
    question: "Kế hoạch cho lần gặp tới là gì đây? ✈️",
    options: [
      "Ôm nhau thật chặt không buông 🫂",
      "Đi ăn sập thế giới 🍕",
      "Nói chuyện thâu đêm suốt sáng 🌙",
      "Chỉ cần ở bên nhau là đủ 💑",
    ],
    feedback: "Hóng tới ngày đó quá đi thuiiii! 🚀",
  },
];

const PhaseQuiz = ({ onComplete }: Props) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { play } = useSfx();

  const selectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks
    
    play("pop");
    setSelectedAnswer(idx);
    setShowFeedback(true);
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    // Show feedback for 2 seconds, then move to next question
    setTimeout(() => {
      if (current >= LDR_QUIZ_DATA.length - 1) {
        setTimeout(() => onComplete(newAnswers), 600);
      } else {
        setCurrent((c) => c + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 2000);
  };

  const q = LDR_QUIZ_DATA[current];

  return (
    <motion.div
      className="flex h-full flex-col px-5 py-6"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Progress dots */}
      <div className="mb-4 flex items-center justify-center gap-1.5">
        {LDR_QUIZ_DATA.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-primary" : i < current ? "w-1.5 bg-primary/50" : "w-1.5 bg-secondary"
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="glass w-full rounded-2xl p-5"
          >
            <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
              <FlaskConical className="h-4 w-4" />
              <span>{current + 1}/{LDR_QUIZ_DATA.length}</span>
              <Sparkles className="ml-auto h-3 w-3 text-primary/50" />
            </div>
            <p className="mb-5 text-base font-semibold text-foreground">{q.question}</p>

            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    selectedAnswer === i
                      ? "border-primary bg-primary/20 text-primary"
                      : selectedAnswer !== null
                      ? "border-primary/10 bg-card/20 text-muted-foreground opacity-50"
                      : "border-primary/15 bg-card/40 text-foreground hover:border-primary/40 hover:bg-primary/10"
                  }`}
                >
                  <span>{opt}</span>
                  {selectedAnswer === i ? (
                    <span className="text-primary">✓</span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3"
              >
                <p className="text-sm text-primary italic">{q.feedback}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default memo(PhaseQuiz);
