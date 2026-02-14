import { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Music, Volume2, VolumeX } from "lucide-react";

interface Props {
  audioUrl?: string;
  forcePause?: boolean;
}

const PersistentAudioPlayer = ({ 
  audioUrl = "https://archive.org/download/royalty-free-music/Chill%20Lo-Fi%20Hop%20%28Royalty%20Free%20Music%29.mp3",
  forcePause = false
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (forcePause && audioRef.current && !audioRef.current.paused) {
       audioRef.current.pause();
       setIsPlaying(false);
    }
  }, [forcePause]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    } else if (audioRef.current.src !== audioUrl) {
      // If URL changes
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      if (wasPlaying && !forcePause) {
        audioRef.current.play().catch(console.error);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || forcePause) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!isVisible || forcePause) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-primary/30 px-3 py-2 shadow-lg"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="flex items-center justify-center text-primary"
      >
        {isPlaying ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Music className="h-5 w-5" />
          </motion.div>
        ) : (
          <Music className="h-5 w-5" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="flex items-center justify-center text-muted-foreground"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </motion.button>

      {/* Visualizer */}
      {isPlaying && !isMuted && (
        <div className="flex items-end gap-[2px] h-4">
          {[0, 0.15, 0.3, 0.1, 0.25].map((delay, i) => (
            <motion.div
              key={i}
              className="w-[2px] rounded-full bg-primary"
              animate={{
                height: ["4px", "12px", "4px"],
              }}
              transition={{
                duration: 0.8,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default memo(PersistentAudioPlayer);
