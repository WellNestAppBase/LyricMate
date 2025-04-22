import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Wallet, ArrowUpRight, Clock, Award } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getBalance,
  getTransactionHistory,
  rewardForDailyEngagement,
} from "../services/lyricTokenService";
import { Transaction } from "../types/lyricToken";

export function WalletCard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);

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
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [user]);

  const claimDailyReward = async () => {
    if (!user || claimingReward) return;

    setClaimingReward(true);
    try {
      const result = await rewardForDailyEngagement(user.id);

      if (result) {
        // Update local state with new transaction and balance
        setTransactions([result, ...transactions]);
        setBalance(balance + result.amount);
      }
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    } finally {
      setClaimingReward(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span>{user ? `${user.name}'s Wallet` : "LYRIC Wallet"}</span>
          </div>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : `${balance.toFixed(2)} LYRIC`}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <Button
            onClick={claimDailyReward}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={claimingReward || isLoading || !user}
          >
            {claimingReward ? (
              <>
                <span className="animate-pulse mr-2">•••</span> Claiming...
              </>
            ) : (
              <>
                <Award className="mr-2 h-4 w-4" /> Claim Daily Reward
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Recent Transactions
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse text-muted-foreground">
                  Loading transactions...
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No transactions yet
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === "earn" ? (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <ArrowUpRight className="h-4 w-4 transform rotate-180" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(tx.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-medium ${tx.type === "earn" ? "text-green-600" : "text-red-600"}`}
                  >
                    {tx.type === "earn" ? "+" : "-"}
                    {tx.amount.toFixed(2)} LYRIC
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
