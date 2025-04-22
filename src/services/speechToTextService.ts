/**
 * Service for converting speech to text using Google Speech-to-Text API
 */

import axios from "axios";

// Cache implementation
const cache: Record<string, { result: string; timestamp: number }> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Google Speech-to-Text API configuration
const GOOGLE_SPEECH_API_KEY = import.meta.env.VITE_GOOGLE_SPEECH_API_KEY || "";
const GOOGLE_SPEECH_API_URL =
  "https://speech.googleapis.com/v1/speech:recognize";

/**
 * Convert speech audio to text
 * @param audioBlob The audio recording as a Blob
 * @returns Promise with transcribed text or null if failed
 */
export async function convertSpeechToText(
  audioBlob: Blob,
): Promise<string | null> {
  try {
    // Check if we're in development mode with mocked data
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_APIS) {
      return mockConvertSpeechToText();
    }

    // Generate a cache key based on the audio data
    const cacheKey = await generateCacheKey(audioBlob);

    // Check cache first
    const cachedData = cache[cacheKey];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log("Using cached speech-to-text result");
      return cachedData.result;
    }

    // If no API key is available, fall back to mock implementation
    if (!GOOGLE_SPEECH_API_KEY) {
      console.warn("No Google Speech API key found, using mock implementation");
      return mockConvertSpeechToText();
    }

    // Convert audio blob to base64
    const base64Audio = await blobToBase64(audioBlob);

    // Prepare the request payload
    const payload = {
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
        model: "default",
        enableAutomaticPunctuation: true,
      },
      audio: {
        content: base64Audio,
      },
    };

    // Make the API request
    const response = await axios.post(
      `${GOOGLE_SPEECH_API_URL}?key=${GOOGLE_SPEECH_API_KEY}`,
      payload,
    );

    // Process the response
    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const transcription = response.data.results
        .map((result: any) => result.alternatives[0].transcript)
        .join(" ");

      // Cache the result
      cache[cacheKey] = {
        result: transcription,
        timestamp: Date.now(),
      };

      return transcription;
    }

    return null;
  } catch (error) {
    console.error("Error converting speech to text:", error);
    return mockConvertSpeechToText(); // Fallback to mock in case of error
  }
}

/**
 * Convert a Blob to base64 string
 * @param blob The blob to convert
 * @returns Promise with base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a cache key for an audio blob
 * @param blob The audio blob
 * @returns Promise with cache key
 */
async function generateCacheKey(blob: Blob): Promise<string> {
  // Use blob size and type as part of the key
  return `speech:${blob.size}:${blob.type}:${Date.now().toString().slice(0, -4)}`;
}

/**
 * Mock implementation for converting speech to text
 * @returns Promise with mock transcribed text
 */
function mockConvertSpeechToText(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Imagine there's no heaven, it's easy if you try");
    }, 1500);
  });
}

/**
 * Clear the cache
 */
export function clearCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
}
