import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { AlertCircle, Facebook, Mail, X } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "./ui/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const {
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithTwitter,
    loginWithOTP,
    verifyOTP,
    loading,
    error,
    clearError,
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleOTPRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithOTP(otpEmail);
    setOtpSent(true);
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOTP(otpEmail, otpCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-2 border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome Back
          </CardTitle>
          <CardDescription>Sign in to your LyricMate account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">One-Time Code</TabsTrigger>
            </TabsList>
            <TabsContent value="password" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in with Email"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="otp" className="mt-4">
              {!otpSent ? (
                <form onSubmit={handleOTPRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otpEmail">Email</Label>
                    <Input
                      id="otpEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    disabled={loading}
                  >
                    {loading ? "Sending code..." : "Send One-Time Code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOTPVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otpCode">
                      Enter the code sent to {otpEmail}
                    </Label>
                    <Input
                      id="otpCode"
                      type="text"
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setOtpSent(false)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify Code"}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                try {
                  loginWithGoogle();
                  toast({
                    title: "Redirecting to Google",
                    description: "You'll be redirected to Google to sign in",
                    duration: 3000,
                  });
                } catch (error) {
                  toast({
                    title: "Provider Error",
                    description:
                      "Google login is not properly configured in Supabase",
                    variant: "destructive",
                    duration: 5000,
                  });
                }
              }}
              disabled={loading}
              className="flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                try {
                  loginWithFacebook();
                  toast({
                    title: "Redirecting to Facebook",
                    description: "You'll be redirected to Facebook to sign in",
                    duration: 3000,
                  });
                } catch (error) {
                  toast({
                    title: "Provider Error",
                    description:
                      "Facebook login is not properly configured in Supabase",
                    variant: "destructive",
                    duration: 5000,
                  });
                }
              }}
              disabled={loading}
              className="flex items-center justify-center"
            >
              <Facebook className="h-5 w-5 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                try {
                  loginWithTwitter();
                  toast({
                    title: "Redirecting to X/Twitter",
                    description: "You'll be redirected to X/Twitter to sign in",
                    duration: 3000,
                  });
                } catch (error) {
                  toast({
                    title: "Provider Error",
                    description:
                      "Twitter login is not properly configured in Supabase",
                    variant: "destructive",
                    duration: 5000,
                  });
                }
              }}
              disabled={loading}
              className="flex items-center justify-center"
            >
              <X className="h-5 w-5 mr-2" />X
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
