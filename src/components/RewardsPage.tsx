import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Gift, Clock, Music, Trophy } from "lucide-react";
import Navigation from "./Navigation";
import { Transaction } from "../types/lyricToken";

export default function RewardsPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching token balance and transaction history
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        // In a real app, this would call the blockchain
        // For now, we'll use mock data

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock balance
        setBalance(3.75);

        // Mock transactions
        setTransactions([
          {
            id: "tx1",
            type: "earn",
            amount: 0.1,
            description: "Song identification reward",
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            hash: "0x123...abc",
            status: "confirmed",
          },
          {
            id: "tx2",
            type: "earn",
            amount: 0.05,
            description: "Daily engagement reward",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            hash: "0x456...def",
            status: "confirmed",
          },
          {
            id: "tx3",
            type: "earn",
            amount: 0.1,
            description: "Song identification reward",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            hash: "0x789...ghi",
            status: "confirmed",
          },
          {
            id: "tx4",
            type: "earn",
            amount: 0.5,
            description: "Welcome bonus",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            hash: "0xabc...123",
            status: "confirmed",
          },
        ]);
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [user]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hour${Math.round(diffInHours) !== 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4 pb-20 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-neon-purple-500/20 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-neon-blue/20 filter blur-3xl"></div>
        <div className="absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-neon-pink/20 filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-2xl font-bold gradient-text mb-8">LYRIC Rewards</h1>

        {/* Token Balance Card */}
        <Card
          variant="neon"
          className="mb-8 border-neon-purple/20 shadow-neon-purple"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 gradient-text">
              <Sparkles className="h-5 w-5 text-neon-purple-400" />
              Your LYRIC Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-neon-purple-600 to-neon-blue flex items-center justify-center shadow-neon-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Balance
                  </p>
                  <h2 className="text-3xl font-bold">
                    {loading ? "..." : balance.toFixed(2)} LYRIC
                  </h2>
                </div>
              </div>
              <Button variant="neon-gradient" className="shadow-neon-glow">
                <Gift className="mr-2 h-4 w-4" />
                Claim Daily Bonus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Earning Opportunities */}
        <h2 className="text-xl font-bold mb-4 gradient-text">
          Earning Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-neon-purple-900/50 to-neon-purple-800/30 border border-neon-purple-700/30 backdrop-blur-sm shadow-neon-purple">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-neon-purple-800/50 p-2 rounded-full">
                  <Music className="h-5 w-5 text-neon-purple-400" />
                </div>
                <h3 className="font-medium">Identify Songs</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn 0.1 LYRIC for each song you identify
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neon-blue/30 to-neon-blue/10 border border-neon-blue/30 backdrop-blur-sm shadow-neon-blue">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-neon-blue/20 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-neon-blue" />
                </div>
                <h3 className="font-medium">Daily Engagement</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn 0.05 LYRIC for using the app daily
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neon-pink/30 to-neon-pink/10 border border-neon-pink/30 backdrop-blur-sm shadow-neon-pink">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-neon-pink/20 p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-neon-pink" />
                </div>
                <h3 className="font-medium">Contribute Lyrics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn 0.5 LYRIC for contributing new lyrics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="mb-8 border-neon-purple/20 shadow-neon-glow">
          <CardHeader>
            <CardTitle className="gradient-text">Transaction History</CardTitle>
            <CardDescription>Your recent LYRIC token activity</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-card/50 rounded-lg"></div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-card/30 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${tx.type === "earn" ? "bg-neon-purple-900/30 text-neon-purple-400" : "bg-red-900/30 text-red-400"}`}
                      >
                        {tx.type === "earn" ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${tx.type === "earn" ? "text-neon-purple-400" : "text-red-400"}`}
                    >
                      {tx.type === "earn" ? "+" : "-"}
                      {tx.amount} LYRIC
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
}
