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
  Heart,
  Settings,
  Grid,
  Home,
  User,
  Search,
} from "lucide-react";
import { findTrack, StreamingTrack } from "@/services/streamingService";

interface MusicPlayerModernProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onVolumeChange"> {
  songTitle: string;
  artist: string;
  coverArt: string;
  currentTime?: number; // in seconds
  duration?: number; // in seconds
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (value: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onVolumeChange?: (value: number) => void;
  volume?: number; // 0 to 1
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  currentLyrics?: string[];
  onNavigateHome?: () => void;
  onNavigateProfile?: () => void;
  onNavigateSearch?: () => void;
  onNavigateFavorites?: () => void;
  audioUrl?: string; // URL for audio playback
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const MusicPlayerModern = React.forwardRef<
  HTMLDivElement,
  MusicPlayerModernProps
>(
  (
    {
      className,
      songTitle = "Without me",
      artist = "Halsey",
      coverArt = "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&q=80",
      currentTime = 120,
      duration = 240,
      isPlaying = false,
      onPlay,
      onPause,
      onSeek,
      onPrevious,
      onNext,
      onVolumeChange,
      volume = 0.8,
      isFavorite = false,
      onToggleFavorite,
      currentLyrics = [
        "Tell me how's it feel sittin' up there?",
        "Feeling so high but too far away to hold me",
        "You know I'm the one who put you up there",
      ],
      onNavigateHome,
      onNavigateProfile,
      onNavigateSearch,
      onNavigateFavorites,
      audioUrl,
      ...props
    },
    ref,
  ) => {
    const [track, setTrack] = React.useState<StreamingTrack | null>(null);
    const [localIsPlaying, setLocalIsPlaying] = React.useState(isPlaying);
    const [localCurrentTime, setLocalCurrentTime] = React.useState(currentTime);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    // Create audio element when component mounts
    React.useEffect(() => {
      const audio = new Audio();
      audioRef.current = audio;

      // Set up event listeners
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("canplay", () => {
        if (localIsPlaying) {
          audio
            .play()
            .catch((err) => console.error("Error playing audio:", err));
        }
      });

      // Clean up event listeners when component unmounts
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
        audioRef.current = null;
      };
    }, []);

    // Load track when songTitle or artist changes
    React.useEffect(() => {
      const loadTrack = async () => {
        try {
          const foundTrack = await findTrack(songTitle, artist);
          setTrack(foundTrack);

          if (foundTrack && audioRef.current) {
            // Use provided audioUrl, track's previewUrl, or fallback
            const url = audioUrl || foundTrack.previewUrl || foundTrack.url;
            audioRef.current.src = url;
            audioRef.current.load();
          }
        } catch (error) {
          console.error("Error loading track:", error);
        }
      };

      loadTrack();
    }, [songTitle, artist, audioUrl]);

    // Handle play/pause changes
    React.useEffect(() => {
      setLocalIsPlaying(isPlaying);

      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current
            .play()
            .catch((err) => console.error("Error playing audio:", err));
        } else {
          audioRef.current.pause();
        }
      }
    }, [isPlaying]);

    // Handle volume changes
    React.useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, [volume]);

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setLocalCurrentTime(audioRef.current.currentTime);
        if (onSeek && !isDragging) {
          onSeek(audioRef.current.currentTime);
        }
      }
    };

    const handleEnded = () => {
      setLocalIsPlaying(false);
      if (onPause) {
        onPause();
      }
    };

    const [isDragging, setIsDragging] = React.useState(false);
    const handlePlayPause = () => {
      if (localIsPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setLocalIsPlaying(false);
        onPause?.();
      } else {
        if (audioRef.current) {
          audioRef.current
            .play()
            .catch((err) => console.error("Error playing audio:", err));
        }
        setLocalIsPlaying(true);
        onPlay?.();
      }
    };

    const handleSeek = (value: number[]) => {
      const newTime = value[0];
      setLocalCurrentTime(newTime);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
      if (onSeek) {
        onSeek(newTime);
      }
    };

    const handleSeekStart = () => {
      setIsDragging(true);
    };

    const handleSeekEnd = () => {
      setIsDragging(false);
    };

    const progressPercentage = (localCurrentTime / duration) * 100;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-md mx-auto h-screen flex flex-col text-white relative overflow-hidden",
          localIsPlaying
            ? "bg-gradient-to-b from-pink-900 via-purple-900 to-black animate-gradient-shift"
            : "bg-gradient-to-b from-purple-950 to-black",
          className,
        )}
        {...props}
      >
        {/* Top bar with grid and settings */}
        <div className="flex justify-between items-center p-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Grid size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Settings size={24} />
          </Button>
        </div>

        {/* Song info */}
        <div className="text-center mt-8 mb-4 px-6">
          <h2 className="text-2xl font-bold">{songTitle}</h2>
          <p className="text-xl text-gray-400">{artist}</p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center px-8 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-pink-400"
            onClick={onToggleFavorite}
          >
            <Heart
              size={24}
              className={isFavorite ? "fill-pink-500 text-pink-500" : ""}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={
              onVolumeChange
                ? () => onVolumeChange(volume > 0 ? 0 : 0.8)
                : undefined
            }
          >
            <Volume2 size={24} />
          </Button>
        </div>

        {/* Circular player */}
        <div className="relative flex justify-center items-center mt-4">
          {/* Outer circle */}
          <div className="w-[316px] h-[316px] rounded-full border-2 border-purple-300/50 flex items-center justify-center">
            {/* Album art circle */}
            <div className="w-[282px] h-[282px] rounded-full overflow-hidden relative">
              <img
                src={coverArt}
                alt={`${songTitle} by ${artist}`}
                className="w-full h-full object-cover"
              />

              {/* Progress circle */}
              <svg
                className="absolute inset-0 w-full h-full rotate-[-90deg]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#7429a8"
                  strokeWidth="2"
                  strokeDasharray="301.59"
                  strokeDashoffset={
                    301.59 - (301.59 * progressPercentage) / 100
                  }
                  className="transition-all duration-300"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#c924a5"
                  strokeWidth="4"
                  strokeDasharray="4"
                  className="opacity-50"
                />
              </svg>

              {/* Progress indicator */}
              <div
                className="absolute w-3.5 h-3.5 bg-pink-500 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${progressPercentage * 3.6}deg) translate(141px, -50%)`,
                  transformOrigin: "0 50%",
                }}
              />
            </div>
          </div>

          {/* Play button overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-pink-500 flex items-center justify-center"
              onClick={handlePlayPause}
            >
              {localIsPlaying ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex justify-center items-center gap-8 mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onPrevious}
          >
            <SkipBack size={28} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={handlePlayPause}
          >
            {localIsPlaying ? (
              <Pause size={36} className="text-white" />
            ) : (
              <Play size={36} className="text-white ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onNext}
          >
            <SkipForward size={28} />
          </Button>
        </div>

        {/* Progress slider */}
        <div className="px-6 mt-4">
          <Slider
            defaultValue={[localCurrentTime]}
            value={[localCurrentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            onValueCommit={handleSeekEnd}
            onPointerDown={handleSeekStart}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(localCurrentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Lyrics section */}
        <div className="mt-auto mb-20 px-6 text-center space-y-2">
          {currentLyrics.map((line, index) => (
            <p
              key={index}
              className={cn(
                "text-xl transition-all",
                index === 1 ? "text-white font-medium" : "text-gray-500",
              )}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Using the shared Navigation component */}
      </div>
    );
  },
);

MusicPlayerModern.displayName = "MusicPlayerModern";

export { MusicPlayerModern };
