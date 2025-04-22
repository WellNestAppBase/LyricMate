import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { ArrowLeft, Gift, Coins, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RewardsPage() {
  const navigate = useNavigate();

  // Mock data for rewards
  const lyricBalance = 2.45;
  const dailyStreak = 3;
  const nextReward = 0.05;
  const progress = 65; // Progress towards next level

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Your Rewards</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="mr-2 h-5 w-5 text-primary" />
                LYRIC Balance
              </CardTitle>
              <CardDescription>Your current token balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {lyricBalance} LYRIC
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">
                View Transaction History
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Daily Rewards
              </CardTitle>
              <CardDescription>Keep your streak going!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Daily Streak: {dailyStreak} days</span>
                  <span>Next: +{nextReward} LYRIC</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Gift className="mr-2 h-4 w-4" />
                Claim Daily Reward
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>How to Earn LYRIC Tokens</CardTitle>
              <CardDescription>
                Complete these actions to earn more rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span>Successfully identify a song</span>
                  <span className="font-semibold">+0.1 LYRIC</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Contribute new lyrics to the database</span>
                  <span className="font-semibold">+0.5 LYRIC</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Daily app engagement (5+ minutes)</span>
                  <span className="font-semibold">+0.05 LYRIC</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Refer a friend</span>
                  <span className="font-semibold">+1.0 LYRIC</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
