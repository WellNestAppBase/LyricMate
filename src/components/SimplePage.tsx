import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This is a simple test page to verify routing is working correctly.
          </p>
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </div>
  );
}
