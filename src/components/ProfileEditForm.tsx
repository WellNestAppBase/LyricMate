import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function ProfileEditForm() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUser({ name, file });
      setSuccess("Profile updated successfully!");
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-500/20 text-green-500 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : user?.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "default"}`
                }
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
              />
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
