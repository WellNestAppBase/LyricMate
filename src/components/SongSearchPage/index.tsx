import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Mic, Music, Keyboard, ArrowLeft, MusicNote } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SongSearchPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Find Your Song</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sing Lyrics</h3>
              <p className="text-muted-foreground">
                Record yourself singing a part of the song
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Speak Lyrics</h3>
              <p className="text-muted-foreground">
                Say the lyrics out loud and we'll find the song
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Keyboard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Type Lyrics</h3>
              <p className="text-muted-foreground">
                Enter the lyrics you remember from the song
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Search by Lyrics</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter lyrics you remember..."
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-primary/90">Search</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
