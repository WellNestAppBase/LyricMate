import { SongResult } from "./songRecognitionService";

// Cache implementation for mock functions
const cache: Record<
  string,
  { result: SongResult | SongResult[] | null; timestamp: number }
> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Mock implementation for recognizing a song from audio
 * @returns Promise with mock song result
 */
export function mockRecognizeSongFromAudio(): Promise<SongResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        releaseYear: 1975,
        coverArt:
          "https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?w=300&q=80",
        confidence: 95,
      });
    }, 2000);
  });
}

/**
 * Mock implementation for searching a song by lyrics
 * @param lyrics The lyrics to search for
 * @returns Promise with mock song result
 */
export function mockSearchSongByLyrics(lyrics: string): Promise<SongResult> {
  // Check cache first
  const cacheKey = `lyrics:${lyrics}`;
  const cachedData = cache[cacheKey];

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return Promise.resolve(cachedData.result as SongResult);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        title: "Imagine",
        artist: "John Lennon",
        album: "Imagine",
        releaseYear: 1971,
        coverArt:
          "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
        confidence: 85,
      };

      // Cache the result
      cache[cacheKey] = {
        result,
        timestamp: Date.now(),
      };

      resolve(result);
    }, 2000);
  });
}
