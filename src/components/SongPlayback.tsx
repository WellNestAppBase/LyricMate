import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { SongResult } from "../services/songRecognitionService";
import {
  Play,
  Pause,
  SkipBack,
  Volume2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { findTrack, getYouTubeEmbedUrl } from "../services/streamingService";

interface SongPlaybackProps {
  song: SongResult;
  lyricsTimestamp?: number; // Timestamp in seconds where the lyrics match
  chorusTimestamp?: number; // Timestamp in seconds where the chorus starts
}

export default function SongPlayback({
  song,
  lyricsTimestamp = 30, // Default values for demo purposes
  chorusTimestamp = 60, // Default values for demo purposes
}: SongPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackInfo, setTrackInfo] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Load track information when the component mounts
  useEffect(() => {
    const loadTrackInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const track = await findTrack(song.title, song.artist);
        if (track) {
          setTrackInfo(track);
          // If we have a preview URL, set it up for the audio element
          if (track.previewUrl) {
            const audio = new Audio(track.previewUrl);
            audioRef.current = audio;

            // Set up event listeners
            audio.addEventListener("timeupdate", updateProgress);
            audio.addEventListener("loadedmetadata", () => {
              setDuration(audio.duration);
            });
            audio.addEventListener("ended", () => {
              setIsPlaying(false);
              setCurrentTime(0);
            });

            // Set the volume
            audio.volume = volume / 100;
          }
        } else {
          setError("Could not find this track on streaming services");
        }
      } catch (err) {
        console.error("Error loading track:", err);
        setError("Error loading track information");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrackInfo();

    // Clean up event listeners
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("loadedmetadata", () => {});
        audioRef.current.removeEventListener("ended", () => {});
        audioRef.current.pause();
      }
    };
  }, [song.title, song.artist]);

  // Update progress bar as audio plays
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (trackInfo?.previewUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError("Could not play audio. Try again later.");
        });
      }
      setIsPlaying(!isPlaying);
    } else if (trackInfo?.id && !trackInfo.previewUrl) {
      // Open YouTube in a new tab if we don't have a preview URL
      window.open(trackInfo.url, "_blank");
    }
  };

  // Play from beginning
  const playFromBeginning = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        togglePlay();
      }
    }
  };

  // Play from lyrics match point
  const playFromLyrics = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = lyricsTimestamp;
      if (!isPlaying) {
        togglePlay();
      }
    }
  };

  // Play from chorus
  const playFromChorus = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = chorusTimestamp;
      if (!isPlaying) {
        togglePlay();
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Open the track in the streaming service
  const openInStreamingService = () => {
    if (trackInfo?.url) {
      window.open(trackInfo.url, "_blank");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <img
          src={
            song.coverArt ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${song.title}-${song.artist}`
          }
          alt={`${song.title} by ${song.artist}`}
          className="w-32 h-32 rounded-lg shadow-lg"
        />
      </div>

      <div className="text-center mb-4">
        <h3 className="text-xl font-bold truncate">{song.title}</h3>
        <p className="text-gray-400 truncate">{song.artist}</p>
        {song.album && (
          <p className="text-gray-500 text-sm truncate">{song.album}</p>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <p>Loading track information...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-400">
          <AlertCircle className="h-6 w-6 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : trackInfo ? (
        <>
          {trackInfo.previewUrl ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  className="w-full"
                  onValueChange={(value) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = value[0];
                      setCurrentTime(value[0]);
                    }
                  }}
                />
              </div>

              <div className="flex justify-center items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playFromBeginning}
                  className="text-white hover:text-primary hover:bg-gray-800"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="default"
                  size="icon"
                  onClick={togglePlay}
                  className="bg-primary hover:bg-primary/90 h-12 w-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <Button
                  variant="outline"
                  onClick={playFromBeginning}
                  className="text-xs h-auto py-2"
                >
                  Play from Start
                </Button>
                <Button
                  variant="outline"
                  onClick={playFromLyrics}
                  className="text-xs h-auto py-2"
                >
                  Play from Lyrics
                </Button>
                <Button
                  variant="outline"
                  onClick={playFromChorus}
                  className="text-xs h-auto py-2"
                >
                  Play from Chorus
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-400" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center mb-6">
              <p className="mb-4">
                Preview not available. Open in YouTube to listen.
              </p>
              <Button
                variant="default"
                onClick={openInStreamingService}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in YouTube
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p>No track information available</p>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>
          {trackInfo?.previewUrl
            ? "Playing preview. Full song available on streaming services."
            : "Full playback requires YouTube API key or premium streaming service integration"}
        </p>
      </div>
    </div>
  );
}
