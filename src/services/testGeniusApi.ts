import { searchSongByLyrics } from "./songRecognitionService";

/**
 * Test function to verify Genius API integration
 * @param lyrics The lyrics to search for
 */
export async function testGeniusApi(
  lyrics: string = "Bohemian Rhapsody",
): Promise<any> {
  console.log(`Testing Genius API with lyrics: "${lyrics}"`);
  console.log(`VITE_USE_REAL_APIS: ${import.meta.env.VITE_USE_REAL_APIS}`);

  // Check if we have a custom API key or using the fallback
  const apiKey =
    import.meta.env.VITE_GENIUS_ACCESS_TOKEN ||
    "kwrzWQkAtOf9-sj9kXAv22vk82dNoV1Dj_JJ-fcLkH8ijqX8nSPHMxHV7xLq7C7c";
  console.log(
    `Using Genius API key for "${lyrics}": ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`,
  );

  try {
    // Force VITE_USE_REAL_APIS to true for this test
    const originalEnv = import.meta.env.VITE_USE_REAL_APIS;
    // @ts-ignore - Temporarily override env variable for testing
    import.meta.env.VITE_USE_REAL_APIS = "true";
    console.log(
      `Set VITE_USE_REAL_APIS to: ${import.meta.env.VITE_USE_REAL_APIS}`,
    );

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results = await searchSongByLyrics(lyrics, true);

    // Restore original env setting
    // @ts-ignore
    import.meta.env.VITE_USE_REAL_APIS = originalEnv;

    console.log(`Genius API test results for "${lyrics}":`, results);

    if (results) {
      console.log(`✅ Genius API integration successful for "${lyrics}"!`);
      return results;
    } else {
      console.error(
        `❌ Genius API returned no results for "${lyrics}". This might be expected if no matches were found.`,
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ Genius API test failed for "${lyrics}":`, error);

    // Debugging guidance
    if (error.response) {
      const status = error.response.status;
      console.error(`HTTP Status ${status} for search "${lyrics}"`);

      if (status === 401) {
        console.error(
          `Authentication error for "${lyrics}": Check if your VITE_GENIUS_ACCESS_TOKEN is correct`,
        );
      } else if (status === 429) {
        console.error(
          `Rate limit exceeded for "${lyrics}": You may need to wait before making more requests`,
        );
      }

      console.error(`Response data for "${lyrics}":`, error.response.data);
    }
    throw error;
  }
}
