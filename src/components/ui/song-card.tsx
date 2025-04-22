import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { Button } from "./button";
import { Play, Pause, Heart } from "lucide-react";

interface SongCardProps extends React.HTMLAttributes<HTMLDivElement> {
  songTitle: string;
  artist: string;
  coverArt: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onFavoriteToggle?: () => void;
  variant?: "default" | "compact" | "list";
}

const SongCard = React.forwardRef<HTMLDivElement, SongCardProps>(
  (
    {
      className,
      songTitle = "Unknown Song",
      artist = "Unknown Artist",
      coverArt = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
      isPlaying = false,
      isFavorite = false,
      onPlay,
      onPause,
      onFavoriteToggle,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const handlePlayPause = () => {
      if (isPlaying) {
        onPause?.();
      } else {
        onPlay?.();
      }
    };

    if (variant === "compact") {
      return (
        <Card
          ref={ref}
          variant="dark"
          className={cn("overflow-hidden w-40", className)}
          {...props}
        >
          <div className="relative">
            <img
              src={coverArt}
              alt={`${songTitle} by ${artist}`}
              className="h-40 w-full object-cover"
            />
            <Button
              variant="neon-gradient"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={14} />
              ) : (
                <Play size={14} className="ml-0.5" />
              )}
            </Button>
          </div>
          <div className="p-3">
            <h4 className="text-sm font-medium text-white truncate">
              {songTitle}
            </h4>
            <p className="text-xs text-gray-400 truncate">{artist}</p>
          </div>
        </Card>
      );
    }

    if (variant === "list") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center p-3 rounded-lg hover:bg-gray-800/50 transition-colors",
            className,
          )}
          {...props}
        >
          <img
            src={coverArt}
            alt={`${songTitle} by ${artist}`}
            className="h-12 w-12 rounded-md object-cover mr-3"
          />
          <div className="flex-1 min-w-0 mr-3">
            <h4 className="text-sm font-medium text-white truncate">
              {songTitle}
            </h4>
            <p className="text-xs text-gray-400 truncate">{artist}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isFavorite ? "text-accent" : "text-gray-400 hover:text-white",
              )}
              onClick={onFavoriteToggle}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button
              variant={isPlaying ? "secondary" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} className="ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      );
    }

    // Default card
    return (
      <Card
        ref={ref}
        variant="dark"
        className={cn("overflow-hidden", className)}
        {...props}
      >
        <div className="relative">
          <img
            src={coverArt}
            alt={`${songTitle} by ${artist}`}
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 text-white",
                isFavorite ? "text-accent" : "text-white",
              )}
              onClick={onFavoriteToggle}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="neon-gradient"
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="ml-0.5" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-medium text-white truncate">
            {songTitle}
          </h3>
          <p className="text-sm text-gray-400 truncate">{artist}</p>
        </div>
      </Card>
    );
  },
);

SongCard.displayName = "SongCard";

export { SongCard };
