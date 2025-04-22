// Interface for the LyricToken smart contract
export interface LyricToken {
  // Basic ERC-20 functions
  balanceOf: (address: string) => Promise<number>;
  transfer: (to: string, amount: number) => Promise<boolean>;
  allowance: (owner: string, spender: string) => Promise<number>;
  approve: (spender: string, amount: number) => Promise<boolean>;
  transferFrom: (from: string, to: string, amount: number) => Promise<boolean>;
  totalSupply: () => Promise<number>;

  // Custom functions for our LyricToken
  rewardForSongIdentification: (user: string) => Promise<boolean>;
  rewardForDailyEngagement: (user: string) => Promise<boolean>;
  getTransactionHistory: (user: string) => Promise<Transaction[]>;
}

// Transaction interface for token transfers
export interface Transaction {
  id: string;
  type: "earn" | "spend";
  amount: number;
  description: string;
  timestamp: Date;
  hash?: string; // Blockchain transaction hash
  status?: "pending" | "confirmed" | "failed";
}

// Token reward constants
export const REWARD_AMOUNTS = {
  SONG_IDENTIFICATION: 0.1,
  DAILY_ENGAGEMENT: 0.05,
  LYRIC_CONTRIBUTION: 0.5,
};
