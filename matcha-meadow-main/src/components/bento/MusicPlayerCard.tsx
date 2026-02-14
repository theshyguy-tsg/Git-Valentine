import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const tracks = [
  { title: "Emerald Night", artist: "Neon Beats" },
  { title: "Crystal Dreams", artist: "Magic Waves" },
  { title: "Midnight Glow", artist: "Ambient Pulse" },
];

const SoundWave = ({ playing }: { playing: boolean }) => (
  <div className="flex items-end gap-[3px] h-5">
    {[0, 0.2, 0.4, 0.1, 0.3].map((delay, i) => (
      <div
        key={i}
        className="w-[3px] rounded-full bg-neon transition-all"
        style={{
          height: playing ? undefined : "4px",
          animation: playing ? `sound-wave 0.8s ease-in-out ${delay}s infinite` : "none",
          minHeight: "4px",
          maxHeight: "16px",
        }}
      />
    ))}
  </div>
);

const MusicPlayerCard = () => {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState([35]);

  const track = tracks[trackIdx];

  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/20">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{track.title}</p>
            <p className="text-xs text-muted-foreground">{track.artist}</p>
          </div>
        </div>
        <SoundWave playing={playing} />
      </div>

      <div className="space-y-3">
        <Slider
          value={progress}
          onValueChange={setProgress}
          max={100}
          step={1}
          className="cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>1:{String(Math.floor(progress[0] * 2.4)).padStart(2, "0")}</span>
          <span>4:00</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setTrackIdx((trackIdx - 1 + tracks.length) % tracks.length)}>
            <SkipBack className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_12px_hsl(160_100%_50%/0.3)] hover:shadow-[0_0_20px_hsl(160_100%_50%/0.5)] transition-all"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button onClick={() => setTrackIdx((trackIdx + 1) % tracks.length)}>
            <SkipForward className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerCard;
