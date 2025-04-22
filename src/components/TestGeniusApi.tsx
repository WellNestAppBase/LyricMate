import { useState } from "react";
import { Button } from "./ui/button";
import { testGeniusApi } from "../services/testGeniusApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function TestGeniusApi() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("Bohemian Rhapsody");
  const [apiStatus, setApiStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const handleTest = async () => {
    setTesting(true);
    setResults(null);
    setApiStatus("idle");
    setStatusMessage("");

    try {
      // Capture console.log output
      const originalLog = console.log;
      const originalError = console.error;
      let logs: string[] = [];

      console.log = (...args) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(" "),
        );
        originalLog(...args);
      };

      console.error = (...args) => {
        logs.push(
          "ERROR: " +
            args
              .map((arg) =>
                typeof arg === "object"
                  ? JSON.stringify(arg, null, 2)
                  : String(arg),
              )
              .join(" "),
        );
        originalError(...args);
      };

      const result = await testGeniusApi(searchTerm);

      // Restore console functions
      console.log = originalLog;
      console.error = originalError;

      setResults(logs.join("\n"));

      // Check if we got valid results
      if (
        result &&
        result.response &&
        result.response.hits &&
        result.response.hits.length > 0
      ) {
        setApiStatus("success");
        setStatusMessage(
          `Found ${result.response.hits.length} results from Genius API for "${searchTerm}"`,
        );
      } else {
        // We got a response but no hits
        if (result) {
          setApiStatus("success");
          setStatusMessage(
            `API connection successful but no results found for "${searchTerm}"`,
          );
        } else {
          setApiStatus("error");
          setStatusMessage(
            `API connection failed or returned unexpected format for "${searchTerm}"`,
          );
        }
      }
    } catch (error) {
      setResults(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setApiStatus("error");
      setStatusMessage(
        `Error testing "${searchTerm}": ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-black/20 text-white">
      <CardHeader>
        <CardTitle>Test Genius API Integration</CardTitle>
        <CardDescription className="text-gray-300">
          Test if your Genius API key is working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="searchTerm" className="text-sm font-medium">
            Search Term or Lyrics
          </label>
          <Input
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter song title or lyrics"
            className="bg-black/30 border-gray-700"
          />
        </div>

        <Button
          onClick={handleTest}
          disabled={testing}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {testing ? "Testing..." : `Test Genius API with "${searchTerm}"`}
        </Button>

        {apiStatus !== "idle" && (
          <Alert variant={apiStatus === "success" ? "default" : "destructive"}>
            {apiStatus === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {apiStatus === "success"
                ? "API Connection Successful"
                : "API Connection Failed"}
            </AlertTitle>
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="logs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logs">API Logs</TabsTrigger>
            <TabsTrigger value="env">Environment Check</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            {results ? (
              <div className="mt-4 p-4 bg-black/50 rounded-md overflow-auto max-h-96">
                <pre className="text-xs text-white whitespace-pre-wrap">
                  {results}
                </pre>
              </div>
            ) : (
              <div className="text-center p-4 text-gray-400">
                Run the test to see API logs
              </div>
            )}
          </TabsContent>

          <TabsContent value="env" className="space-y-4">
            <div className="p-4 bg-black/50 rounded-md">
              <h3 className="font-medium mb-2">Environment Variables</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">VITE_GENIUS_ACCESS_TOKEN:</div>
                <div>
                  {import.meta.env.VITE_GENIUS_ACCESS_TOKEN ? (
                    <span className="text-green-400">
                      Set (
                      {import.meta.env.VITE_GENIUS_ACCESS_TOKEN.substring(0, 5)}
                      ...)
                    </span>
                  ) : (
                    <span className="text-yellow-400">
                      Not set in .env.local (using fallback)
                    </span>
                  )}
                </div>
                <div className="font-medium">VITE_USE_REAL_APIS:</div>
                <div>
                  {import.meta.env.VITE_USE_REAL_APIS ? (
                    <span className="text-green-400">
                      {import.meta.env.VITE_USE_REAL_APIS}
                    </span>
                  ) : (
                    <span className="text-red-400">
                      Not set (using mock data)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
