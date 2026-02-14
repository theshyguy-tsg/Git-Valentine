import { useState } from "react";
import { Heart, ArrowRight, Sparkles, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const QUIZ_DATA = [
  {
    id: 'q1_meet',
    question: 'Gặp nhau thì em muốn làm gì đầu tiên?',
    options: ['Ôm anh thật chặt', 'Đấm cho bõ ghét', 'Đi ăn sập phố'],
    feedback: 'Duyệt! Anh nguyện chịu trận hết.',
  },
  {
    id: 'q2_hate',
    question: 'Điều gì ở yêu xa làm em ghét nhất?',
    options: ['Mạng lag khi call', 'Không được ôm', 'Thấy mà không chạm được'],
    feedback: 'Anh cũng thế... Cố lên nhé, sắp được gặp rồi!',
  },
  {
    id: 'q3_gift',
    question: 'Món quà Valentine em muốn nhất lúc này?',
    options: ['Ting ting', 'Một chuyến đi chơi', 'Anh Khiêm ship bản thân đến'],
    feedback: 'Phương án C đang được xử lý... Vui lòng chờ!',
  },
  {
    id: 'q4_trust',
    question: 'Độ tin tưởng của em dành cho anh Khiêm?',
    options: ['100%', 'Vô cực', 'Tạm chấp nhận'],
    feedback: 'Yên tâm, anh uy tín hơn server Google!',
  },
  {
    id: 'q5_promise',
    question: 'Hứa với anh một câu đi?',
    options: ['Chờ anh về', 'Yêu anh mãi', 'Ngoan không dỗi'],
    feedback: 'Anh đã chụp màn hình làm bằng chứng! Hihi.',
  },
  {
    id: 'q6_miss',
    question: 'Lúc nhớ anh nhất em thường làm gì?',
    options: ['Lướt ảnh cũ', 'Nhắn tin than thở', 'Nằm im rồi khóc thầm'],
    feedback: 'Lần sau nhớ thì gọi anh liền nha, đừng chịu một mình!',
  },
  {
    id: 'q7_future',
    question: 'Nếu anh bay về bất ngờ, em sẽ?',
    options: ['Khóc tại chỗ', 'Giả vờ bình thường rồi ôm chặt', 'Chạy ra sân bay đón'],
    feedback: 'Câu nào cũng đáng yêu hết á! Anh muốn thử lắm rồi.',
  },
  {
    id: 'q8_song',
    question: 'Bài hát nào khiến em nghĩ đến tụi mình?',
    options: ['Có chàng trai viết lên cây', 'Nơi này có anh', 'Everything I Need'],
    feedback: 'Anh sẽ hát cho em nghe khi gặp nhau nha!',
  },
];

interface Props {
  onComplete?: () => void;
  completed?: boolean;
}

const QuizGameCard = ({ onComplete, completed = false }: Props) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const [useCustomAnswer, setUseCustomAnswer] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Array<{ question: string; answer: string; isCustom: boolean }>>([]);

  const current = QUIZ_DATA[qIdx];
  const answered = isAnswered || selected !== null || (useCustomAnswer && customAnswer.trim() !== "");
  const allDone = answeredCount >= QUIZ_DATA.length;

  const selectAnswer = (i: number) => {
    if (answered || allDone) return;
    setSelected(i);
    setIsAnswered(true);
    setUseCustomAnswer(false);
    setCustomAnswer("");
    const newCount = answeredCount + 1;
    setAnsweredCount(newCount);
    
    // Lưu câu trả lời
    const answer = {
      question: current.question,
      answer: current.options[i],
      isCustom: false
    };
    setUserAnswers([...userAnswers, answer]);
    
    if (newCount >= QUIZ_DATA.length) {
      onComplete?.();
    }
  };

  const submitCustomAnswer = () => {
    if (customAnswer.trim() === "" || allDone || answered) return;
    setIsAnswered(true);
    const newCount = answeredCount + 1;
    setAnsweredCount(newCount);
    
    // Lưu câu trả lời tùy chỉnh
    const answer = {
      question: current.question,
      answer: customAnswer.trim(),
      isCustom: true
    };
    setUserAnswers([...userAnswers, answer]);
    
    if (newCount >= QUIZ_DATA.length) {
      onComplete?.();
    }
  };

  const toggleCustomAnswer = () => {
    setUseCustomAnswer(!useCustomAnswer);
    setSelected(null);
    if (!useCustomAnswer) {
      setCustomAnswer("");
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setCustomAnswer("");
    setUseCustomAnswer(false);
    setIsAnswered(false);
    setQIdx((qIdx + 1) % QUIZ_DATA.length);
  };

  if (allDone && completed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center">
        <Sparkles className="h-8 w-8 text-neon" />
        <p className="text-sm font-semibold text-foreground">Cảm ơn bạn đã chia sẻ! 💎</p>
        <p className="text-xs text-muted-foreground">Nhiệm vụ hoàn thành</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Heart className="h-4 w-4 text-primary" />
          <span>Câu {qIdx + 1}/{QUIZ_DATA.length}</span>
        </div>
        <span className="text-xs text-muted-foreground">{answeredCount}/{QUIZ_DATA.length} đã trả lời</span>
      </div>

      <p className="text-sm font-semibold text-foreground leading-snug">{current.question}</p>

      {/* Toggle giữa chọn đáp án và tự nhập */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <button
          onClick={toggleCustomAnswer}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            useCustomAnswer
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-secondary/50 text-muted-foreground border border-border hover:bg-secondary"
          }`}
        >
          <PenTool className="h-3 w-3" />
          {useCustomAnswer ? "Chọn đáp án có sẵn" : "Tự nhập câu trả lời"}
        </button>
      </div>

      {!useCustomAnswer ? (
        <div className="grid grid-cols-2 gap-2">
          {current.options.map((opt, i) => {
            let style = "border-border bg-card hover:bg-secondary hover:border-primary/30";
            if (answered && i === selected) style = "border-primary bg-primary/10 text-primary";

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => selectAnswer(i)}
                className={`rounded-xl border p-2 text-xs font-medium transition-all ${style} ${!answered ? "active:scale-95" : ""}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Textarea
            value={customAnswer}
            onChange={(e) => setCustomAnswer(e.target.value)}
            placeholder="Nhập câu trả lời của bạn..."
            disabled={answered}
            className="min-h-[80px] text-xs resize-none border-primary/30 focus-visible:border-primary/60"
          />
          {!answered && customAnswer.trim() !== "" && (
            <Button
              onClick={submitCustomAnswer}
              size="sm"
              className="w-full text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            >
              Xác nhận câu trả lời
            </Button>
          )}
          {answered && useCustomAnswer && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-2 text-xs text-primary">
              <span className="font-medium">Câu trả lời của bạn:</span>
              <p className="mt-1">{customAnswer}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        {answered && (
          <p className="text-xs text-primary italic">{current.feedback}</p>
        )}
        {answered && qIdx < QUIZ_DATA.length - 1 && (
          <Button variant="ghost" size="sm" onClick={nextQuestion} className="text-xs gap-1 ml-auto">
            Tiếp <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizGameCard;
