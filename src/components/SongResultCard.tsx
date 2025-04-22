import { useState } from "react";
import { SongResult } from "../services/songRecognitionService";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Music, Play } from "lucide-react";
import SongPlayback from "./SongPlayback";

interface SongResultCardProps {
  song: SongResult;
  isMainResult?: boolean;
}

export default function SongResultCard({
  song,
  isMainResult = false,
}: SongResultCardProps) {
  const [showPlayback, setShowPlayback] = useState(false);

  return (
    <Card
      className={`w-full overflow-hidden ${isMainResult ? "border-primary" : "border-gray-200"}`}
    >
      <CardHeader className="p-4 pb-0 flex flex-row items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={
              song.coverArt ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${song.title}-${song.artist}`
            }
            alt={`${song.title} by ${song.artist}`}
            className="w-16 h-16 rounded-md object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-lg truncate">{song.title}</h3>
          <p className="text-gray-500 truncate">{song.artist}</p>
          {song.album && (
            <p className="text-gray-400 text-sm truncate">{song.album}</p>
          )}
          {song.releaseYear && (
            <p className="text-gray-400 text-sm">{song.releaseYear}</p>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {song.confidence !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm font-medium">
              Match Confidence:
              <span className={`ml-1 ${getConfidenceColor(song.confidence)}`}>
                {Math.round(song.confidence)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Dialog open={showPlayback} onOpenChange={setShowPlayback}>
          <DialogTrigger asChild>
            <Button variant="default" className="w-full">
              <Play className="mr-2 h-4 w-4" /> Play Song
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <SongPlayback song={song} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

// Helper function to get color based on confidence level
function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return "text-green-500";
  if (confidence >= 70) return "text-yellow-500";
  return "text-red-500";
}
