-- Add wallet_address column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
