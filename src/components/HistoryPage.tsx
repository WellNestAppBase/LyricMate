import { useState } from "react";
import SongHistory from "./SongHistory";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { History, Calendar, Star } from "lucide-react";
import Navigation from "./Navigation";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<string>("recent");

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 pb-20 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-neon-purple-500/20 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-neon-blue/20 filter blur-3xl"></div>
        <div className="absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-neon-pink/20 filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-2xl font-bold gradient-text mb-8">Your History</h1>

        <Tabs
          defaultValue="recent"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Recent</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>All History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <SongHistory />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card className="border-neon-purple/20 shadow-neon-glow">
              <CardHeader>
                <CardTitle className="gradient-text">Favorite Songs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-2 opacity-50 text-neon-purple-300" />
                  <p>You haven't favorited any songs yet.</p>
                  <p className="text-sm">Star songs to save them here!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <SongHistory />
            <Card className="mt-4 border-neon-purple/20">
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing most recent 10 songs
                </p>
                <button className="text-neon-purple-300 text-sm mt-2 hover:underline">
                  Load more history
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
}
