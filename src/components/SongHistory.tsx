import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Music, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

type SongHistoryItem = {
  id: string;
  user_id: string;
  song_title: string;
  artist: string;
  album?: string | null;
  cover_art_url?: string | null;
  confidence_score?: number | null;
  identified_at: string;
  identification_method?: string | null;
};

export function SongHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<SongHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Using any type to bypass type checking issues with Supabase types
      const { data, error } = await (supabase as any)
        .from("song_history")
        .select("*")
        .eq("user_id", user.id)
        .order("identified_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      setHistory(data || []);
    } catch (err: any) {
      console.error("Error fetching song history:", err);
      setError(err.message || "Failed to load song history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongHistory();

    // Listen for song identification events to refresh the history
    const handleSongIdentified = () => {
      fetchSongHistory();
    };

    window.addEventListener("song-identified", handleSongIdentified);

    return () => {
      window.removeEventListener("song-identified", handleSongIdentified);
    };
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return format(date, "h:mm a");
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const getInputMethodIcon = (method: string | null) => {
    switch (method) {
      case "sing":
        return <Music className="h-4 w-4" />;
      case "speak":
        return <Music className="h-4 w-4" />;
      case "type":
        return <Music className="h-4 w-4" />;
      default:
        return <Music className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Song History</CardTitle>
          <CardDescription>Loading your song history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Song History</CardTitle>
          <CardDescription>
            There was an error loading your song history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Song History</CardTitle>
          <CardDescription>Your recently identified songs</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchSongHistory}
          title="Refresh history"
          className="h-8 w-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-refresh-cw"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </Button>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>You haven't identified any songs yet.</p>
            <p className="text-sm">
              Start by using the song recognition feature!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-muted/50 rounded-lg flex items-center gap-3 hover:bg-muted transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {getInputMethodIcon(item.identification_method)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.song_title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.artist} {item.album ? `• ${item.album}` : ""}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(item.identified_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SongHistory;
