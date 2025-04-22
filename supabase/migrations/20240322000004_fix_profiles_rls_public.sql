-- Fix row-level security policies for profiles table by adding a public access policy

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles access" ON profiles;

-- Create a public access policy for profiles
CREATE POLICY "Public profiles access"
ON profiles FOR SELECT
USING (true);

-- Create a policy that allows users to insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (true);

-- Create a policy that allows users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);