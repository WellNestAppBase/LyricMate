import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Slider } from "./slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

interface MusicPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onVolumeChange"> {
  songTitle: string;
  artist: string;
  coverArt: string;
  duration?: number; // in seconds
  currentTime?: number; // in seconds
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (value: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onVolumeChange?: (value: number) => void;
  volume?: number; // 0 to 1
  variant?: "default" | "mini" | "full";
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const MusicPlayer = React.forwardRef<HTMLDivElement, MusicPlayerProps>(
  (
    {
      className,
      songTitle = "Unknown Song",
      artist = "Unknown Artist",
      coverArt = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
      duration = 180,
      currentTime = 0,
      isPlaying = false,
      onPlay,
      onPause,
      onSeek,
      onPrevious,
      onNext,
      onVolumeChange,
      volume = 0.8,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const [isMuted, setIsMuted] = React.useState(false);
    const [localVolume, setLocalVolume] = React.useState(volume);
    const [prevVolume, setPrevVolume] = React.useState(volume);

    const handlePlayPause = () => {
      if (isPlaying) {
        onPause?.();
      } else {
        onPlay?.();
      }
    };

    const handleVolumeToggle = () => {
      if (isMuted) {
        setIsMuted(false);
        setLocalVolume(prevVolume);
        onVolumeChange?.(prevVolume);
      } else {
        setIsMuted(true);
        setPrevVolume(localVolume);
        setLocalVolume(0);
        onVolumeChange?.(0);
      }
    };

    const handleVolumeChange = (value: number[]) => {
      const newVolume = value[0];
      setLocalVolume(newVolume);
      setIsMuted(newVolume === 0);
      onVolumeChange?.(newVolume);
    };

    if (variant === "mini") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center p-2 rounded-xl bg-black/80 backdrop-blur-md border border-gray-800",
            className,
          )}
          {...props}
        >
          <img
            src={coverArt}
            alt={`${songTitle} by ${artist}`}
            className="h-10 w-10 rounded-md object-cover mr-3"
          />
          <div className="flex-1 min-w-0 mr-3">
            <h4 className="text-sm font-medium text-white truncate">
              {songTitle}
            </h4>
            <p className="text-xs text-gray-400 truncate">{artist}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white h-8 w-8"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
        </div>
      );
    }

    if (variant === "full") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col p-6 rounded-xl bg-black/80 backdrop-blur-md border border-gray-800 shadow-neon-glow",
            className,
          )}
          {...props}
        >
          <div className="flex justify-center mb-6">
            <img
              src={coverArt}
              alt={`${songTitle} by ${artist}`}
              className="h-64 w-64 rounded-xl object-cover shadow-lg"
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">{songTitle}</h2>
            <p className="text-gray-400">{artist}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Slider
                defaultValue={[currentTime]}
                max={duration}
                step={1}
                value={[currentTime]}
                onValueChange={(value) => onSeek?.(value[0])}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12"
                onClick={onPrevious}
              >
                <SkipBack size={24} />
              </Button>

              <Button
                variant="neon-gradient"
                size="icon"
                className="text-white h-16 w-16 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12"
                onClick={onNext}
              >
                <SkipForward size={24} />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-8 w-8"
                onClick={handleVolumeToggle}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>

              <Slider
                defaultValue={[localVolume]}
                max={1}
                step={0.01}
                value={[localVolume]}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      );
    }

    // Default player
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col p-4 rounded-xl bg-black/80 backdrop-blur-md border border-gray-800",
          className,
        )}
        {...props}
      >
        <div className="flex items-center mb-4">
          <img
            src={coverArt}
            alt={`${songTitle} by ${artist}`}
            className="h-16 w-16 rounded-lg object-cover mr-4"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-white truncate">
              {songTitle}
            </h3>
            <p className="text-sm text-gray-400 truncate">{artist}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            defaultValue={[currentTime]}
            max={duration}
            step={1}
            value={[currentTime]}
            onValueChange={(value) => onSeek?.(value[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onPrevious}
          >
            <SkipBack size={20} />
          </Button>

          <Button
            variant="neon-gradient"
            size="icon"
            className="text-white h-12 w-12 rounded-full"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onNext}
          >
            <SkipForward size={20} />
          </Button>
        </div>
      </div>
    );
  },
);

MusicPlayer.displayName = "MusicPlayer";

export { MusicPlayer };
