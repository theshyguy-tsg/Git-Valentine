import { useState, useCallback, memo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhaseInput from "@/components/meow/PhaseInput";
import PhaseLoading from "@/components/meow/PhaseLoading";
import PhaseIntro from "@/components/meow/PhaseIntro";
import PhaseQuiz from "@/components/meow/PhaseQuiz";
import PhaseGacha from "@/components/meow/PhaseGacha";
import PhaseTarot from "@/components/meow/PhaseTarot";
import PhaseFlipCard from "@/components/meow/PhaseFlipCard";
import PhaseBattery from "@/components/meow/PhaseBattery";
import PhaseMiniGame from "@/components/meow/PhaseMiniGame";
import PhaseTimeline from "@/components/meow/PhaseTimeline";
import PhaseLetter from "@/components/meow/PhaseLetter";
import InteractiveFooter from "@/components/meow/InteractiveFooter";
import BackgroundParticles from "@/components/meow/BackgroundParticles";
import PersistentAudioPlayer from "@/components/meow/PersistentAudioPlayer";

type Phase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

const STORAGE_KEYS = {
  PHASE: "meowmagic_phase",
  NAME: "meowmagic_name",
  IS_REPLAY: "meowmagic_is_replay",
};

const MeowMagicApp = () => {
  // Load from localStorage on mount
  const [phase, setPhase] = useState<Phase>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PHASE);
    return saved ? (Number(saved) as Phase) : 1;
  });
  const [name, setName] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.NAME) || "";
  });
  const [isReplay, setIsReplay] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_REPLAY) === "true";
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PHASE, phase.toString());
  }, [phase]);

  useEffect(() => {
    if (name) {
      localStorage.setItem(STORAGE_KEYS.NAME, name);
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_REPLAY, isReplay.toString());
  }, [isReplay]);

  const goPhase = useCallback((p: Phase) => setPhase(p), []);

  const handleReplay = useCallback(() => {
    setIsReplay(true);
    setPhase(3);
    // Clear saved progress to start fresh
    localStorage.removeItem(STORAGE_KEYS.PHASE);
  }, []);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-deep-forest via-background to-background">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[430px] md:mx-auto md:my-8 md:rounded-[40px] md:border-[6px] md:border-secondary md:shadow-2xl">
        {/* Notch (desktop only) */}
        <div className="hidden md:block">
          <div className="absolute left-1/2 top-0 z-20 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-secondary" />
        </div>

        {/* Content area */}
        <div className="relative h-[100dvh] overflow-hidden bg-gradient-to-b from-deep-forest to-background md:h-[85vh] md:min-h-[680px] md:rounded-[34px]">
          {/* Background particles */}
          <BackgroundParticles />

          {/* Phases */}
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {phase === 1 && (
                  <PhaseInput
                    key="input"
                    onConnect={(n) => {
                      setName(n);
                      goPhase(2);
                    }}
                  />
                )}
                {phase === 2 && (
                  <PhaseLoading key="loading" onDone={() => goPhase(3)} />
                )}
                {phase === 3 && (
                  <PhaseIntro key="intro" name={name} isReplay={isReplay} onGo={() => goPhase(4)} />
                )}
                {phase === 4 && (
                  <PhaseQuiz key="quiz" onComplete={() => goPhase(5)} />
                )}
                {phase === 5 && (
                  <PhaseTarot key="tarot" onComplete={() => goPhase(6)} />
                )}
                {phase === 6 && (
                  <PhaseFlipCard key="flipcard" onComplete={() => goPhase(7)} />
                )}
                {phase === 7 && (
                  <PhaseGacha key="gacha" onNext={() => goPhase(8)} />
                )}
                {phase === 8 && (
                  <PhaseBattery key="battery" onComplete={() => goPhase(9)} />
                )}
                {phase === 9 && (
                  <PhaseMiniGame key="minigame" onComplete={() => goPhase(11)} />
                )}
                {phase === 11 && (
                  <PhaseTimeline key="timeline" onNext={() => goPhase(12)} />
                )}
                {phase === 12 && (
                  <PhaseLetter key="letter" name={name} onReplay={handleReplay} />
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Footer */}
            {phase >= 3 && <InteractiveFooter />}
          </div>
        </div>
      </div>

      {/* Persistent Audio Player */}
      <PersistentAudioPlayer forcePause={phase === 12} />
    </div>
  );
};

export default memo(MeowMagicApp);
