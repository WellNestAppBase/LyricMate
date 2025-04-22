import axios from "axios";

/**
 * Simple function to test Genius API directly without CORS proxies
 * This is meant to be used in a Node.js environment or as a reference
 */
export const searchLyrics = async (query: string) => {
  const accessToken = import.meta.env.VITE_GENIUS_ACCESS_TOKEN;

  try {
    console.log(`Searching Genius API for: "${query}"`);
    console.log(`Using access token: ${accessToken?.substring(0, 5)}...`);

    const res = await axios.get("https://api.genius.com/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { q: query },
    });

    console.log("Search results:", res.data.response.hits);
    return res.data.response.hits;
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Get song details by ID
 */
export const getSongDetails = async (songId: number) => {
  const accessToken = import.meta.env.VITE_GENIUS_ACCESS_TOKEN;

  try {
    const res = await axios.get(`https://api.genius.com/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.response.song;
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
    throw err;
  }
};
