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
import {
  Wallet,
  ArrowUpRight,
  Clock,
  Award,
  Sparkles,
  History,
} from "lucide-react";
import Navigation from "./Navigation";
import {
  getBalance,
  getTransactionHistory,
  rewardForDailyEngagement,
} from "../services/lyricTokenService";
import { Transaction } from "../types/lyricToken";

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [claimingReward, setClaimingReward] = useState<boolean>(false);
  const [claimedToday, setClaimedToday] = useState<boolean>(false);

  // Format date for transaction display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  // Fetch user balance and transaction history when user changes
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch balance
        const userBalance = await getBalance(user.id);
        setBalance(userBalance);

        // Fetch transaction history
        const userTransactions = await getTransactionHistory(user.id);
        setTransactions(userTransactions);

        // Check if user has claimed daily reward today
        const today = new Date().toDateString();
        const claimedToday = userTransactions.some(
          (tx) =>
            tx.description === "Daily app engagement reward" &&
            tx.timestamp.toDateString() === today,
        );
        setClaimedToday(claimedToday);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [user]);

  // Claim daily reward function
  const claimDailyReward = async () => {
    if (!user || claimingReward || claimedToday) return;

    setClaimingReward(true);
    try {
      const result = await rewardForDailyEngagement(user.id);

      if (result) {
        // Update local state with new transaction and balance
        setTransactions([result, ...transactions]);
        setBalance(balance + result.amount);
        setClaimedToday(true);
      }
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    } finally {
      setClaimingReward(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-dark-gradient -z-10" />
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 gradient-text flex items-center gap-2">
          <Wallet className="h-5 w-5 text-neon-pink" />
          LYRIC Wallet
        </h1>

        {/* Wallet Card */}
        <Card className="mb-6 border border-neon-purple/30 bg-card/80 backdrop-blur-md shadow-neon-purple">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl gradient-text">
              Your LYRIC Balance
            </CardTitle>
            <CardDescription>Available LYRIC tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-neon-gradient-alt flex items-center justify-center shadow-neon-glow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Balance
                  </p>
                  <h2 className="text-3xl font-bold">
                    {isLoading ? "..." : balance.toFixed(2)} LYRIC
                  </h2>
                </div>
              </div>

              <Button
                variant="neon-gradient"
                className="w-full shadow-neon-glow font-medium"
                onClick={claimDailyReward}
                disabled={claimingReward || claimedToday || isLoading}
              >
                {claimingReward ? (
                  <>
                    <span className="animate-pulse mr-2">•••</span> Claiming...
                  </>
                ) : claimedToday ? (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Already Claimed Today
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Claim Daily Bonus
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Earning Opportunities */}
        <h2 className="text-xl font-bold mb-4 gradient-text">
          Earning Opportunities
        </h2>
        <div className="grid grid-cols-1 gap-3 mb-6">
          <Card className="border border-neon-purple/20 bg-card/60 backdrop-blur-sm shadow-neon-purple">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-neon-purple/30 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-neon-purple-300" />
                </div>
                <h3 className="font-medium">Identify Songs</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn 0.1 LYRIC for each song you identify
              </p>
            </CardContent>
          </Card>

          <Card className="border border-neon-blue/20 bg-card/60 backdrop-blur-sm shadow-neon-blue">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-neon-blue/30 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-neon-blue" />
                </div>
                <h3 className="font-medium">Daily Engagement</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn 0.05 LYRIC for using the app daily
              </p>
            </CardContent>
          </Card>

          <Card className="border border-neon-pink/20 bg-card/60 backdrop-blur-sm shadow-neon-pink">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-neon-pink/30 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-neon-pink" />
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
        <Card className="border border-neon-purple/30 bg-card/80 backdrop-blur-md shadow-neon-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl gradient-text flex items-center gap-2">
              <History className="h-5 w-5 text-neon-purple-300" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent LYRIC token activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-card/50 rounded-lg"></div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-card/60 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${tx.type === "earn" ? "bg-neon-purple/30 text-neon-purple-300" : "bg-red-900/30 text-red-400"}`}
                      >
                        {tx.type === "earn" ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 transform rotate-180" />
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
                      className={`font-bold ${tx.type === "earn" ? "text-neon-purple-300" : "text-red-400"}`}
                    >
                      {tx.type === "earn" ? "+" : "-"}
                      {tx.amount.toFixed(2)} LYRIC
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
