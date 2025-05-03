import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Mic, Search, Music, Loader2, Play, Volume2 } from "lucide-react";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import SongResultCard from "../SongResultCard";
import { useAuth } from "../../contexts/AuthContext";
import { rewardForSongIdentification } from "../../services/lyricTokenService";
import { supabase } from "../../lib/supabase";

interface SongResult {
  title: string;
  artist: string;
  album?: string;
  releaseYear?: number;
  coverArt?: string;
  confidence?: number;
}

// Component for Lyrics Search tab
function LyricsSearch({
  lyrics,
  setLyrics,
  isSearching,
  onSearch,
}: {
  lyrics: string;
  setLyrics: (lyrics: string) => void;
  isSearching: boolean;
  onSearch: () => void;
}) {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Enter song lyrics here..."
        className="min-h-[120px] resize-none"
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        disabled={isSearching}
      />
      <Button
        className="w-full"
        onClick={onSearch}
        disabled={!lyrics.trim() || isSearching}
      >
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search by Lyrics
          </>
        )}
      </Button>
    </div>
  );
}

// Component for Audio Recording tab
function AudioRecording({
  isRecording,
  isSearching,
  onRecordToggle,
  audioLevel,
}: {
  isRecording: boolean;
  isSearching: boolean;
  onRecordToggle: () => void;
  audioLevel: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full ${isRecording ? "animate-ping bg-red-500/50" : "bg-muted"}`}
          style={{
            transform: isRecording
              ? `scale(${1 + audioLevel * 0.5})`
              : "scale(1)",
            opacity: isRecording ? 0.5 + audioLevel * 0.5 : 0.5,
          }}
        ></div>
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="relative z-10 rounded-full w-24 h-24"
          onClick={onRecordToggle}
          disabled={isSearching}
        >
          {isRecording ? (
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
              <span className="text-xs mt-1">Stop</span>
            </div>
          ) : (
            <>
              <Mic className="h-8 w-8" />
            </>
          )}
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {isRecording
          ? "Listening... Play your song"
          : isSearching
            ? "Processing audio..."
            : "Tap to start recording"}
      </p>
    </div>
  );
}

export default function SongRecognition() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SongResult | null>(null);
  const [alternativeResults, setAlternativeResults] = useState<SongResult[]>(
    [],
  );
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackType, setPlaybackType] = useState<
    "beginning" | "lyrics" | "chorus" | null
  >(null);
  const [isRewarding, setIsRewarding] = useState(false);

  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleLyricsSearch = async () => {
    if (!lyrics.trim()) return;

    setIsSearching(true);

    try {
      // Import the service dynamically to avoid issues with SSR
      const { searchSongByLyrics } = await import(
        "../../services/songRecognitionService"
      );

      // Send the lyrics to the search service
      const songResult = await searchSongByLyrics(lyrics);

      if (songResult) {
        // Handle both single result and multiple results
        if (Array.isArray(songResult)) {
          if (songResult.length > 0) {
            setResult(songResult[0]); // Use the first result as main result
            // Store alternative results (if any)
            setAlternativeResults(songResult.slice(1));

            // Reward the user for identifying a song
            await rewardUserForSongIdentification(songResult[0]);
          } else {
            toast({
              title: "No songs found",
              description:
                "We couldn't find any songs with those lyrics. Try different lyrics.",
              variant: "destructive",
            });
          }
        } else {
          setResult(songResult);
          setAlternativeResults([]);

          // Reward the user for identifying a song
          await rewardUserForSongIdentification(songResult);
        }
      } else {
        // No song found
        toast({
          title: "No songs found",
          description:
            "We couldn't find any songs with those lyrics. Try different lyrics.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching lyrics:", error);
      toast({
        title: "Error",
        description:
          "There was an error searching for lyrics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const startAudioAnalysis = (stream: MediaStream) => {
    // Create audio context and analyser
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    // Function to analyze audio levels
    const analyzeAudio = () => {
      if (!analyserRef.current) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average level
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const normalizedLevel = average / 255; // Normalize to 0-1 range

      setAudioLevel(normalizedLevel);

      // Continue analyzing while recording
      if (isRecording) {
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      }
    };

    analyzeAudio();
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setIsRecording(false);
    } else {
      // Start recording
      setResult(null);
      setAlternativeResults([]);
      audioChunksRef.current = [];

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Start audio level analysis
        startAudioAnalysis(stream);

        // Create media recorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Create blob from recorded chunks
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          setAudioBlob(audioBlob);

          // Stop all tracks in the stream
          stream.getTracks().forEach((track) => track.stop());

          // Process the recording
          processRecording(audioBlob);
        };

        // Start recording
        mediaRecorder.start();
        setIsRecording(true);

        // Auto-stop after 15 seconds
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            setIsRecording(false);
          }
        }, 15000);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert(
          "Could not access microphone. Please check permissions and try again.",
        );
      }
    }
  };

  const processRecording = async (blob: Blob) => {
    setIsSearching(true);

    try {
      // Import the service dynamically to avoid issues with SSR
      const { recognizeSongFromAudio } = await import(
        "../../services/songRecognitionService"
      );

      // Send the audio blob to the recognition service
      const songResult = await recognizeSongFromAudio(blob);

      if (songResult) {
        setResult(songResult);
        setAlternativeResults([]);

        // Reward the user for identifying a song
        await rewardUserForSongIdentification(songResult);
      } else {
        // No song found
        toast({
          title: "No song found",
          description:
            "We couldn't identify a song from your recording. Try again with clearer audio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing recording:", error);
      toast({
        title: "Error",
        description:
          "There was an error processing your recording. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Function to reward user for identifying a song
  const rewardUserForSongIdentification = async (songResult: SongResult) => {
    if (!user || isRewarding) return;

    setIsRewarding(true);
    try {
      // Save song to history in Supabase
      await saveSongToHistory(songResult);

      // Reward user with LYRIC tokens
      await rewardForSongIdentification(user.id, songResult.title);

      toast({
        title: "LYRIC Tokens Earned!",
        description: `You earned LYRIC tokens for identifying "${songResult.title}".`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error rewarding user:", error);
    } finally {
      setIsRewarding(false);
    }
  };

  // Function to save identified song to user's history in Supabase
  const saveSongToHistory = async (songResult: SongResult) => {
    if (!user) return;

    try {
      // Determine the identification method based on the active tab
      const activeTab =
        document
          .querySelector('[role="tablist"] [data-state="active"]')
          ?.getAttribute("value") || "lyrics";
      const method = activeTab === "lyrics" ? "type" : "sing";

      const songHistoryEntry = {
        user_id: user.id,
        song_title: songResult.title,
        artist: songResult.artist,
        album: songResult.album || null,
        cover_art_url: songResult.coverArt || null,
        confidence_score: songResult.confidence || null,
        identification_method: method as "type" | "sing" | "speak",
        identified_at: new Date().toISOString(),
      };

      // Using any type to bypass type checking issues with Supabase types
      const { error } = await (supabase as any)
        .from("song_history")
        .insert(songHistoryEntry);

      if (error) throw error;

      console.log("Song saved to history:", songResult.title);

      // Refresh the song history if it's visible on the page
      const event = new CustomEvent("song-identified", { detail: songResult });
      window.dispatchEvent(event);
    } catch (err) {
      console.error("Error saving song to history:", err);
      // Don't show error toast to user as this is a background operation
    }
  };

  const resetSearch = () => {
    setLyrics("");
    setResult(null);
    setAlternativeResults([]);
    setAudioBlob(null);
    setIsPlaying(false);
    setPlaybackType(null);
  };

  const handlePlayback = (type: "beginning" | "lyrics" | "chorus") => {
    // In a real app, this would connect to a music streaming service API
    // For now, we'll just simulate playback with a toast notification
    setIsPlaying(true);
    setPlaybackType(type);

    let message = "";
    switch (type) {
      case "beginning":
        message = `Playing ${result?.title} by ${result?.artist} from the beginning`;
        break;
      case "lyrics":
        message = `Playing ${result?.title} by ${result?.artist} from the matched lyrics`;
        break;
      case "chorus":
        message = `Playing ${result?.title} by ${result?.artist} from the chorus`;
        break;
    }

    toast({
      title: "Now Playing",
      description: message,
      action: (
        <ToastAction altText="Stop" onClick={() => setIsPlaying(false)}>
          Stop
        </ToastAction>
      ),
    });

    // Simulate stopping playback after 10 seconds
    setTimeout(() => {
      if (isPlaying && playbackType === type) {
        setIsPlaying(false);
        setPlaybackType(null);
      }
    }, 10000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Music className="h-6 w-6" />
            LyricFinder Song Recognition
          </CardTitle>
          <CardDescription className="text-white/80">
            Identify songs by lyrics or audio recording
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="lyrics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="lyrics">Lyrics Search</TabsTrigger>
              <TabsTrigger value="audio">Audio Recognition</TabsTrigger>
            </TabsList>

            <TabsContent value="lyrics" className="space-y-4">
              <LyricsSearch
                lyrics={lyrics}
                setLyrics={setLyrics}
                isSearching={isSearching}
                onSearch={handleLyricsSearch}
              />
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <AudioRecording
                isRecording={isRecording}
                isSearching={isSearching}
                onRecordToggle={handleRecordToggle}
                audioLevel={audioLevel}
              />
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-6 space-y-6">
              <SongResultCard song={result} isMainResult={true} />

              {alternativeResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Alternative Matches
                  </h3>
                  <div className="space-y-3">
                    {alternativeResults.map((song, index) => (
                      <SongResultCard key={index} song={song} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetSearch}>
                  New Search
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
          <p>Powered by LyricFinder</p>
          <p>
            {user
              ? "Earn LYRIC tokens for each song identified"
              : "Sign in to earn LYRIC tokens"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
