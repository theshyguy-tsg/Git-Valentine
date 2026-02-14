import { useState } from "react";
import { Lock, Gift, Unlock, PartyPopper } from "lucide-react";

interface Props {
  unlocked: boolean;
  progress: number; // 0, 1, or 2
}

const SecretGiftCard = ({ unlocked, progress }: Props) => {
  const [shaking, setShaking] = useState(false);
  const [opened, setOpened] = useState(false);

  const handleInteract = () => {
    if (unlocked && !opened) {
      setOpened(true);
      return;
    }
    if (!unlocked) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  if (opened) {
    return (
      <div className="relative flex h-full cursor-default select-none flex-col items-center justify-center gap-3 overflow-hidden p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-neon/5" />
        <div className="relative z-10 flex flex-col items-center gap-3 animate-fade-in">
          <PartyPopper className="h-10 w-10 text-neon" />
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">🎉 Chúc mừng!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Bạn thật tuyệt vời khi hoàn thành tất cả!
            </p>
            <p className="text-lg mt-2">💎✨🎩</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleInteract}
      onMouseEnter={() => !unlocked && handleInteract()}
      className={`relative flex h-full cursor-pointer select-none flex-col items-center justify-center gap-3 overflow-hidden p-5 transition-all ${
        unlocked ? "animate-neon-pulse" : ""
      }`}
    >
      {/* Blurred overlay when locked */}
      {!unlocked && <div className="absolute inset-0 bg-card/50 backdrop-blur-sm" />}

      <div className={`relative z-10 flex flex-col items-center gap-3 ${shaking ? "animate-shake" : ""}`}>
        <div className="relative">
          <Gift className={`h-12 w-12 ${unlocked ? "text-neon" : "text-muted-foreground/60"}`} strokeWidth={1.5} />
          {unlocked ? (
            <Unlock className="absolute -bottom-1 -right-1 h-5 w-5 text-primary" />
          ) : (
            <Lock className="absolute -bottom-1 -right-1 h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          {unlocked ? (
            <>
              <p className="text-sm font-semibold text-neon">Đã mở khóa! 🔓</p>
              <p className="text-xs text-muted-foreground">Nhấn để mở quà</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground/70">Hộp quà bí mật</p>
              <p className="text-xs text-muted-foreground">Hoàn thành {progress}/2 nhiệm vụ 🔒</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretGiftCard;
