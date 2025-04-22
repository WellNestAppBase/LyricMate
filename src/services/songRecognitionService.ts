import axios from "axios";
import {
  mockRecognizeSongFromAudio,
  mockSearchSongByLyrics,
} from "./songRecognitionService.mock";

// Types
export interface SongResult {
  title: string;
  artist: string;
  album?: string;
  releaseYear?: number;
  coverArt?: string;
  confidence?: number;
}

// Cache implementation
const cache: Record<
  string,
  { result: SongResult | SongResult[] | null; timestamp: number }
> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// AudD API for audio recognition
const AUDD_API_KEY = import.meta.env.VITE_AUDD_API_KEY; // Using the key from environment variables
const AUDD_API_URL = "https://api.audd.io/";

// Musixmatch API for lyrics search
const MUSIXMATCH_API_KEY = import.meta.env.VITE_MUSIXMATCH_API_KEY || "test"; // Fallback to test key
const MUSIXMATCH_API_URL = "https://api.musixmatch.com/ws/1.1";

// Genius API for lyrics search fallback
const GENIUS_API_KEY =
  import.meta.env.VITE_GENIUS_ACCESS_TOKEN ||
  "bIwMcQ7gxRX8sp4VHENmx5CT13VxtFZl_GbZ4D1AzLMWFFXpQ2eDpHoVqTIChoEv"; // Client access token
const GENIUS_API_URL = "https://api.genius.com";

// No CORS proxy needed for server-side requests, but we need one for browser
// Using a reliable proxy that works with Genius API
const CORS_PROXY = "https://corsproxy.org/?";

// Debug flag to log API calls
const DEBUG_API_CALLS = true;

/**
 * Recognize a song from audio data
 * @param audioBlob The audio recording as a Blob
 * @returns Promise with song result or null if not found
 */
export async function recognizeSongFromAudio(
  audioBlob: Blob,
): Promise<SongResult | null> {
  try {
    // Check if we're in development mode with mocked data
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_APIS) {
      return mockRecognizeSongFromAudio();
    }

    // Create form data for the API request
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("api_token", AUDD_API_KEY);
    formData.append("return", "apple_music,spotify");

    // Make the API request
    const response = await axios.post(AUDD_API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Process the response
    if (response.data.status === "success" && response.data.result) {
      const result = response.data.result;
      return {
        title: result.title,
        artist: result.artist,
        album: result.album,
        releaseYear: result.release_date
          ? new Date(result.release_date).getFullYear()
          : undefined,
        coverArt:
          result.spotify?.album?.images?.[0]?.url ||
          result.apple_music?.artwork?.url
            ?.replace("{w}", "300")
            .replace("{h}", "300") ||
          `https://api.dicebear.com/7.x/identicon/svg?seed=${result.title}-${result.artist}`,
        confidence: result.score ? result.score * 100 : undefined,
      };
    }

    return null;
  } catch (error) {
    console.error("Error recognizing song from audio:", error);
    return null;
  }
}

/**
 * Search for a song by lyrics
 * @param lyrics The lyrics to search for
 * @returns Promise with song results or null if not found
 */
export async function searchSongByLyrics(
  lyrics: string,
  forceRealApi = false,
): Promise<SongResult | SongResult[] | null> {
  // Check cache first
  const cacheKey = `lyrics:${lyrics}`;
  const cachedData = cache[cacheKey];

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    console.log("Using cached lyrics search result");
    return cachedData.result;
  }

  try {
    // Check if we're in development mode with mocked data
    if (
      import.meta.env.DEV &&
      !import.meta.env.VITE_USE_REAL_APIS &&
      !forceRealApi
    ) {
      console.log("Using mock data for lyrics search");
      return mockSearchSongByLyrics(lyrics);
    }

    console.log("Attempting to use real APIs for lyrics search");

    try {
      // First try Musixmatch API to search for songs by lyrics
      const results = await searchMusixmatchByLyrics(lyrics);

      if (results && results.length > 0) {
        // Cache the results
        cache[cacheKey] = {
          result: results,
          timestamp: Date.now(),
        };

        return results;
      }

      // If Musixmatch returns no results, try Genius API
      throw new Error("No results from Musixmatch");
    } catch (musixmatchError) {
      console.warn(
        "Musixmatch API failed, trying Genius API:",
        musixmatchError,
      );

      // Try Genius API as fallback
      const geniusResults = await searchGeniusByLyrics(lyrics);

      if (geniusResults && geniusResults.length > 0) {
        // Cache the results
        cache[cacheKey] = {
          result: geniusResults,
          timestamp: Date.now(),
        };

        return geniusResults;
      }

      // If both APIs fail, throw error to trigger mock fallback
      throw new Error("Both Musixmatch and Genius APIs failed");
    }
  } catch (error) {
    console.error("Error searching song by lyrics:", error);

    // Fallback to mock implementation
    return mockSearchSongByLyrics(lyrics);
  }
}

/**
 * Search for songs using Musixmatch API
 * @param lyrics The lyrics to search for
 * @returns Promise with song results or null if not found
 */
async function searchMusixmatchByLyrics(
  lyrics: string,
): Promise<SongResult[] | null> {
  try {
    // Make the API request to Musixmatch using CORS proxy
    const response = await axios.get(
      `${CORS_PROXY}${encodeURIComponent(`${MUSIXMATCH_API_URL}/track.search`)}`,
      {
        params: {
          apikey: MUSIXMATCH_API_KEY,
          q_lyrics: lyrics,
          page_size: 5,
          page: 1,
          s_track_rating: "desc",
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest", // Required by some CORS proxies
        },
      },
    );

    // Check if the response is valid
    if (
      response.data &&
      response.data.message &&
      response.data.message.header &&
      response.data.message.header.status_code === 200 &&
      response.data.message.body &&
      response.data.message.body.track_list &&
      response.data.message.body.track_list.length > 0
    ) {
      // Map the response to our SongResult format
      const results = await Promise.all(
        response.data.message.body.track_list.map(async (item: any) => {
          const track = item.track;

          // Get album art if available
          let coverArt = `https://api.dicebear.com/7.x/identicon/svg?seed=${track.track_name}-${track.artist_name}`;

          try {
            // Try to get album art from Musixmatch
            const albumResponse = await axios.get(
              `${CORS_PROXY}${encodeURIComponent(`${MUSIXMATCH_API_URL}/album.get`)}`,
              {
                params: {
                  apikey: MUSIXMATCH_API_KEY,
                  album_id: track.album_id,
                },
                headers: {
                  "X-Requested-With": "XMLHttpRequest", // Required by some CORS proxies
                },
              },
            );

            if (
              albumResponse.data &&
              albumResponse.data.message &&
              albumResponse.data.message.body &&
              albumResponse.data.message.body.album &&
              albumResponse.data.message.body.album.album_coverart_800x800
            ) {
              coverArt =
                albumResponse.data.message.body.album.album_coverart_800x800;
            }
          } catch (error) {
            console.warn("Could not fetch album art from Musixmatch:", error);
          }

          return {
            title: track.track_name,
            artist: track.artist_name,
            album: track.album_name,
            releaseYear: track.first_release_date
              ? new Date(track.first_release_date).getFullYear()
              : undefined,
            coverArt,
            confidence: track.track_rating
              ? parseFloat(track.track_rating)
              : undefined,
          };
        }),
      );

      return results;
    }

    return null;
  } catch (error) {
    console.error("Error searching Musixmatch:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

/**
 * Search for songs using Genius API
 * @param lyrics The lyrics to search for
 * @param debugMode Whether to log detailed debug information
 * @returns Promise with song results or null if not found
 */
async function searchGeniusByLyrics(
  lyrics: string,
  debugMode = DEBUG_API_CALLS,
): Promise<SongResult[] | null> {
  if (debugMode) {
    console.log(`Searching Genius API for: "${lyrics}"`);
    console.log(
      `Using API key: ${GENIUS_API_KEY.substring(0, 5)}...${GENIUS_API_KEY.substring(GENIUS_API_KEY.length - 5)}`,
    );
    console.log(`API URL: ${GENIUS_API_URL}/search`);
  }

  try {
    // Construct the full URL with search parameter
    const searchUrl = `${GENIUS_API_URL}/search?q=${encodeURIComponent(lyrics)}`;

    if (debugMode) {
      console.log(`Full search URL: ${searchUrl}`);
    }

    // Make the API request to Genius using CORS proxy
    const response = await axios.get(
      `${CORS_PROXY}${encodeURIComponent(searchUrl)}`,
      {
        headers: {
          Authorization: `Bearer ${GENIUS_API_KEY}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );

    if (debugMode) {
      console.log(`Genius API response status: ${response.status}`);
      console.log(`Response data structure:`, Object.keys(response.data || {}));
      if (response.data?.response) {
        console.log(`Hits found: ${response.data.response.hits?.length || 0}`);
      }
    }

    // Check if the response is valid
    if (
      response.data &&
      response.data.response &&
      response.data.response.hits &&
      response.data.response.hits.length > 0
    ) {
      // Map the response to our SongResult format
      const results = await Promise.all(
        response.data.response.hits
          .filter((hit: any) => hit.type === "song")
          .slice(0, 5) // Limit to 5 results
          .map(async (hit: any) => {
            const song = hit.result;

            // Get more details about the song
            let songDetails = song;
            try {
              const songUrl = `${GENIUS_API_URL}/songs/${song.id}`;
              if (debugMode) {
                console.log(`Fetching song details from: ${songUrl}`);
              }

              const detailsResponse = await axios.get(
                `${CORS_PROXY}${encodeURIComponent(songUrl)}`,
                {
                  headers: {
                    Authorization: `Bearer ${GENIUS_API_KEY}`,
                    "X-Requested-With": "XMLHttpRequest",
                  },
                },
              );

              if (
                detailsResponse.data &&
                detailsResponse.data.response &&
                detailsResponse.data.response.song
              ) {
                songDetails = detailsResponse.data.response.song;
              }
            } catch (error) {
              console.warn("Could not fetch song details from Genius:", error);
            }

            return {
              title: song.title,
              artist: song.primary_artist.name,
              album: songDetails.album?.name || "Unknown Album",
              releaseYear: songDetails.release_date
                ? new Date(songDetails.release_date).getFullYear()
                : undefined,
              coverArt:
                song.song_art_image_url ||
                song.header_image_url ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${song.title}-${song.primary_artist.name}`,
              confidence: hit.score ? hit.score * 100 : undefined,
            };
          }),
      );

      return results;
    }

    return null;
  } catch (error) {
    console.error("Error searching Genius:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

/**
 * Clear the cache
 */
export function clearCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
}
