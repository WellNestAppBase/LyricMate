import axios from "axios";

// Types
export interface StreamingCredentials {
  accessToken: string;
  expiresAt: number;
}

export interface StreamingTrack {
  id: string;
  url: string;
  previewUrl?: string;
  isPlayable: boolean;
}

// YouTube Music API base URL
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "";

// Cache for streaming credentials and track info
const credentialsCache: Record<string, StreamingCredentials> = {};
const trackCache: Record<string, StreamingTrack> = {};

/**
 * Search for a track on YouTube Music
 * @param title The song title
 * @param artist The song artist
 * @returns Promise with track info or null if not found
 */
export async function findTrack(
  title: string,
  artist: string,
): Promise<StreamingTrack | null> {
  try {
    // Check cache first
    const cacheKey = `${title}-${artist}`.toLowerCase();
    if (trackCache[cacheKey]) {
      return trackCache[cacheKey];
    }

    // If no API key is available, return a mock track with a preview URL
    if (!YOUTUBE_API_KEY) {
      console.warn("No YouTube API key available, using mock data");
      return getMockTrack(title, artist);
    }

    // Search for the track on YouTube
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: "snippet",
        q: `${title} ${artist} official audio`,
        type: "video",
        maxResults: 1,
        key: YOUTUBE_API_KEY,
      },
    });

    // Check if we got a result
    if (
      response.data &&
      response.data.items &&
      response.data.items.length > 0
    ) {
      const videoId = response.data.items[0].id.videoId;
      const track: StreamingTrack = {
        id: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        // YouTube doesn't provide preview URLs, so we'll use the full video
        isPlayable: true,
      };

      // Cache the result
      trackCache[cacheKey] = track;
      return track;
    }

    // If no results, return a mock track
    return getMockTrack(title, artist);
  } catch (error) {
    console.error("Error finding track:", error);
    return getMockTrack(title, artist);
  }
}

/**
 * Get a mock track for demo purposes
 * @param title The song title
 * @param artist The song artist
 * @returns A mock track with a preview URL
 */
function getMockTrack(title: string, artist: string): StreamingTrack {
  // For demo purposes, we'll use a sample audio file
  // In a real app, you would use actual preview URLs from the streaming service
  return {
    id: `mock-${title}-${artist}`.replace(/\s+/g, "-").toLowerCase(),
    url: "#",
    // Use a sample audio file for demo purposes
    previewUrl:
      "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
    isPlayable: true,
  };
}

/**
 * Get an embedded player URL for a YouTube video
 * @param videoId The YouTube video ID
 * @returns The embedded player URL
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
}

/**
 * Clear the track cache
 */
export function clearTrackCache(): void {
  Object.keys(trackCache).forEach((key) => delete trackCache[key]);
}
