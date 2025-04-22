import { useState } from "react";
import SongRecognition from "./SongRecognition";
import SongHistory from "./SongHistory";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Music, History } from "lucide-react";
import Navigation from "./Navigation";

export default function SongSearchPage() {
  const [activeTab, setActiveTab] = useState<string>("search");

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 pb-20 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-neon-purple-500/20 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-neon-blue/20 filter blur-3xl"></div>
        <div className="absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-neon-pink/20 filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-2xl font-bold gradient-text mb-8">
          Find Your Music
        </h1>

        <Tabs
          defaultValue="search"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Song Recognition</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Your History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <Card
              variant="neon"
              className="border-neon-purple/20 shadow-neon-glow"
            >
              <CardHeader>
                <CardTitle className="gradient-text">Identify a Song</CardTitle>
              </CardHeader>
              <CardContent>
                <SongRecognition />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <SongHistory />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
}
