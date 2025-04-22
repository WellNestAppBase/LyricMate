import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Heart, Music, Mic, Search } from "lucide-react";
import SongRecognition from "./SongRecognition";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            LyricMATE
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Identify songs by singing, speaking, or typing lyrics and earn
            crypto rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <FeatureButton
            icon={<Mic size={24} />}
            title="Sing Lyrics"
            color="primary"
            description="Record yourself singing to identify a song"
          />
          <FeatureButton
            icon={<Music size={24} />}
            title="Speak Lyrics"
            color="secondary"
            description="Speak the lyrics you remember"
          />
          <FeatureButton
            icon={<Search size={24} />}
            title="Type Lyrics"
            color="accent"
            description="Type the lyrics to find your song"
          />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 gradient-text">
            Popular Songs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularSongs.map((song, index) => (
              <SongCard key={index} song={song} />
            ))}
          </div>
        </div>

        {/* Song Recognition Widget */}
        <Card variant="neon" className="mt-8 p-2">
          <CardHeader>
            <CardTitle className="gradient-text">Try It Now</CardTitle>
          </CardHeader>
          <CardContent>
            <SongRecognition />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface FeatureButtonProps {
  icon: React.ReactNode;
  title: string;
  color: "primary" | "secondary" | "accent";
  description: string;
}

function FeatureButton({
  icon,
  title,
  color,
  description,
}: FeatureButtonProps) {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-primary/10 border-primary/50 hover:bg-primary/20 hover:border-primary shadow-primary/40";
      case "secondary":
        return "bg-secondary/10 border-secondary/50 hover:bg-secondary/20 hover:border-secondary shadow-secondary/40";
      case "accent":
        return "bg-accent/10 border-accent/50 hover:bg-accent/20 hover:border-accent shadow-accent/40";
      default:
        return "bg-primary/10 border-primary/50 hover:bg-primary/20 hover:border-primary shadow-primary/40";
    }
  };

  const getIconColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-primary/20 text-primary";
      case "secondary":
        return "bg-secondary/20 text-secondary";
      case "accent":
        return "bg-accent/20 text-accent";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={`${getColorClasses()} backdrop-blur-sm flex flex-col items-center gap-3 py-6 h-auto card-hover`}
    >
      <div
        className={`w-12 h-12 rounded-full ${getIconColorClasses()} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </Button>
  );
}

interface Song {
  title: string;
  artist: string;
  coverUrl: string;
}

function SongCard({ song }: { song: Song }) {
  return (
    <div className="bg-card/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 card-hover">
      <div className="relative aspect-square">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold truncate">{song.title}</h4>
              <p className="text-xs text-gray-300 truncate">{song.artist}</p>
            </div>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white shadow-neon-glow">
                <Play size={14} />
              </button>
              <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white">
                <Heart size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const popularSongs: Song[] = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    coverUrl:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    coverUrl:
      "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400&q=80",
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    coverUrl:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&q=80",
  },
  {
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
  },
];

export default Home;
