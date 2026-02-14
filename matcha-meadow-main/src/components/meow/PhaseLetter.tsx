import { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Heart, Skull, Send, Cat, Play, Pause, RotateCcw, FileText } from "lucide-react";
import confetti from "canvas-confetti";
import useSfx from "@/hooks/useSfx";

interface Props {
  name: string;
  onReplay: () => void;
}

const AUDIO_URL = "/nhacthutinh.mp3";

const LETTER_TEXT = `Gửi {name} iu dấu, ~ nhỏ đáng ghét ở sau màn hình. 😠💖

Khi em đọc được những dòng này thì có lẽ Valentine cũng đã trôi qua một chút rồi. 🕰️ Dạo này nếu như em đang cảm thấy anh hoạt động "bất thường", rep tin nhắn chậm hay thiếu sự quan tâm... thì anh thực sự rất xin lỗi {name} ạ. 😔🙏

Chắc cái đầu nhỏ của em đã kịp vẽ ra đủ thứ kịch bản rồi đúng không? 🤯 Rằng anh chán nói chuyện rồi, hay anh là đồ tồi vô tâm... 💔

Nhưng sự thật là mấy hôm nay, những ngày anh "biến mất" hay kiệm lời, không phải vì tình cảm nhạt đi, mà ngược lại. Anh đã dành toàn bộ thời gian đó để loay hoay. 🛠️ Anh loay hoay tìm cách gói ghém nhiều tình cảm và tâm huyết vào một điều gì đó đặc biệt hơn những lời chúc sáo rỗng. 🎁✨

Người ta bảo im lặng là vàng, nhưng với anh, sự im lặng vừa qua là để lấy đà. 🏃‍♂️💨 Anh muốn Valentine này của em phải là một cái gì đó khiến em bất ngờ, phải cười, và để em tin rằng: 🥰

"Dù anh có vụng về hay ít nói, hay đôi lúc không thể hiện sự hưng phấn nhiều như lúc đầu, thì trong lòng anh, em luôn là ưu tiên số 1." 🥇❤️

Giờ thì món quà đã đến tay em rồi. Mọi bí mật đã được bật mí. Đừng giận anh nữa nhé? 🥺 Đổi lại, anh hứa từ giờ sẽ chỉ có "full-time" dành cho {name} thôi! ⏰💑

Làm Valentine của anh nha? 💍💘

Người tình tương lailai, Khiêm của em ạ!! ✍️💚`;

const HANDWRITTEN_TEXT = `Gửi {name}, ~ nhỏ đáng ghét ở sau màn hình. 😠💖

Khi em đọc được những dòng này thì có lẽ Valentine cũng đã trôi qua một chút rồi. 🕰️ Dạo này nếu như em đang cảm thấy anh hoạt động "bất thường", rep tin nhắn chậm hay thiếu sự quan tâm... thì anh thực sự rất xin lỗi {name} ạ. 😔🙏

Chắc cái đầu nhỏ của em đã kịp vẽ ra đủ thứ kịch bản rồi đúng không? 🤯 Rằng anh chán nói chuyện rồi, hay anh là đồ tồi vô tâm... 💔

Nhưng sự thật là mấy hôm nay, những ngày anh "biến mất" hay kiệm lời, không phải vì tình cảm nhạt đi, mà ngược lại. Anh đã dành toàn bộ thời gian đó để loay hoay. 🛠️ Anh loay hoay tìm cách gói ghém nhiều tình cảm và tâm huyết vào một điều gì đó đặc biệt hơn những lời chúc sáo rỗng. 🎁✨

Người ta bảo im lặng là vàng, nhưng với anh, sự im lặng vừa qua là để lấy đà. 🏃‍♂️💨 Anh muốn Valentine này của em phải là một cái gì đó khiến em bất ngờ, phải cười, và để em tin rằng: 🥰

"Dù anh có vụng về hay ít nói, hay đôi lúc không thể hiện sự hưng phấn nhiều như lúc đầu, thì trong lòng anh, em luôn là ưu tiên số 1." 🥇❤️

Giờ thì món quà đã đến tay em rồi. Mọi bí mật đã được bật mí. Đừng giận anh nữa nhé? 🥺 Đổi lại, anh hứa từ giờ sẽ chỉ có "full-time" dành cho {name} thôi! ⏰💑

Làm Valentine của anh nha? 💍💘

Thân thương, Khiêm của em ạ!! ✍️💚`;

const PhaseLetter = ({ name, onReplay }: Props) => {
  const [wish, setWish] = useState("");
  const [chosen, setChosen] = useState<"love" | "punish" | null>(null);
  const [wishSent, setWishSent] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showHandwritten, setShowHandwritten] = useState(false);
  const [runawayButtonPos, setRunawayButtonPos] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { play } = useSfx();

  // Auto-play music on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!audioRef.current) {
        audioRef.current = new Audio(AUDIO_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
        audioRef.current.onended = () => setPlaying(false);
      }
      audioRef.current.play().then(() => setPlaying(true)).catch((e) => {
        console.log("Auto-play blocked:", e);
        // User interaction will be required, button is already there
      });
    }, 500); // Slight delay to ensure transition

    return () => clearTimeout(timer);
  }, []);

  // Typing effect
  useEffect(() => {
    const fullText = LETTER_TEXT.replace("{name}", name);
    let currentIndex = 0;
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 10); // Typing speed: 10ms per character

    return () => clearInterval(typingInterval);
  }, [name]);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(AUDIO_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const chooseLove = () => {
    setChosen("love");
    play("chime");
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.7 },
      colors: ["#FF4081", "#FF80AB", "#FFFFFF", "#00FF41"],
    });
  };

  const choosePunish = () => { play("click"); setChosen("punish"); };
  const sendWish = () => { if (wish.trim()) { play("whoosh"); setWishSent(true); } };

  const handleRunawayMouseEnter = () => {
    const newX = Math.random() * 200 - 100;
    const newY = Math.random() * 200 - 100;
    setRunawayButtonPos({ x: newX, y: newY });
    play("pop");
  };

  return (
    <motion.div
      className="flex h-full flex-col px-5 py-4"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Audio player */}
      <div className="mb-3 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleAudio}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 text-primary"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </motion.button>
        {/* Equalizer */}
        <div className="flex items-end gap-[2px] h-5">
          {[0, 0.15, 0.3, 0.1, 0.25].map((delay, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-primary/60"
              style={{
                height: playing ? undefined : "3px",
                animation: playing ? `eq-bar 0.8s ${delay}s ease-in-out infinite` : "none",
              }}
            />
          ))}
        </div>
        <span className="text-[0.65rem] text-muted-foreground">
          {playing ? "Đang phát nhạc thư tình..." : "Bấm để nghe nhạc thư tình 🎶"}
        </span>
      </div>

      {/* Toggle between typed and handwritten */}
      <div className="mb-2 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHandwritten(false)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            !showHandwritten
              ? "bg-primary/20 text-primary"
              : "bg-card/40 text-muted-foreground"
          }`}
        >
          <Cat className="inline h-3 w-3 mr-1" />
          Thư Code
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHandwritten(true)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            showHandwritten
              ? "bg-primary/20 text-primary"
              : "bg-card/40 text-muted-foreground"
          }`}
        >
          <FileText className="inline h-3 w-3 mr-1" />
          Thư Viết Tay
        </motion.button>
      </div>

      {/* Letter */}
      <div className="glass flex-1 overflow-y-auto rounded-2xl p-4">
        {showHandwritten ? (
          <div className="relative">
            {/* Handwritten style background */}
            <div
              className="handwritten-letter text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap"
              style={{
                fontFamily: "'Kalam', 'Comic Sans MS', cursive",
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)",
              }}
            >
              {HANDWRITTEN_TEXT.replace(/{name}/g, name)}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <Cat className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">From Meow-bot</span>
            </div>

            <div className="space-y-2.5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse">|</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Choice buttons */}
      {!chosen && (
        <div className="mt-3 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={chooseLove}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-bold text-accent-foreground"
          >
            <Heart className="h-4 w-4" /> Iu Anh 3000 💖
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={choosePunish}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/20 py-2.5 text-sm font-medium text-foreground"
          >
            <Skull className="h-4 w-4" /> Phạt Anh Đi 😈
          </motion.button>
        </div>
      )}

      {chosen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-2.5"
        >
          <p className="text-center text-sm">
            {chosen === "love" ? (
              <span className="neon-text-pink text-accent">💖 Meow-bot đã nhận được tình iu to bự! 😻</span>
            ) : (
              <span className="text-muted-foreground">😿 Meow-bot chấp nhận... nhưng vẫn iu bé nhìu!</span>
            )}
          </p>

          {/* Wish input */}
          {!wishSent ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground ml-1">Hồi âm cho anh đi:</label>
              <div className="flex gap-2">
                <input
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendWish()}
                  placeholder="Viết gì đó ngọt ngào nha..."
                  className="glass flex-1 rounded-xl border border-primary/20 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendWish}
                  disabled={!wish.trim()}
                  className="flex items-center justify-center rounded-xl bg-primary px-3 text-primary-foreground disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-center text-sm text-primary">
                ✨ Tín hiệu đã bay vèo vào vũ trụ rùi! ✨
              </p>
              <motion.a
                href="https://m.me/tran.buianhnam"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-xl bg-[#0084FF] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/30"
              >
                <Send className="h-4 w-4" />
                Nhắn cho anh qua Mess lun 💬
              </motion.a>
            </motion.div>
          )}

          {/* Valentine question with runaway button */}
          {chosen === "love" && !wishSent && (
            <div className="relative mt-4">
              <p className="text-center text-sm text-foreground mb-3">
                Làm Valentine của anh nha nha nha? 🥺
              </p>
              <div className="flex gap-3 relative">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    play("success");
                    confetti({
                      particleCount: 200,
                      spread: 120,
                      origin: { y: 0.5 },
                      colors: ["#FF4081", "#FF80AB", "#FFFFFF", "#00FF41"],
                    });
                    setTimeout(() => setWishSent(true), 500);
                  }}
                  className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-bold text-accent-foreground"
                >
                  Chốt đơn lun 💖
                </motion.button>
                <motion.button
                  onMouseEnter={handleRunawayMouseEnter}
                  whileTap={{ scale: 0.93 }}
                  animate={{
                    x: runawayButtonPos.x,
                    y: runawayButtonPos.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute right-0 rounded-xl border border-primary/20 bg-card/60 py-2.5 px-4 text-sm font-medium text-foreground"
                  style={{ zIndex: 10 }}
                >
                  Hông thèm đâu 😝
                </motion.button>
              </div>
            </div>
          )}

          {/* Replay button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onReplay}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/30 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10 mt-2"
          >
            <RotateCcw className="h-4 w-4" /> Nhớ anh quá hả? Chơi lại đi nà! 🔄
          </motion.button>
        </motion.div>
      )}

      <div className="pb-safe" />
    </motion.div>
  );
};

export default memo(PhaseLetter);
